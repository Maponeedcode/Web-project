import { NextResponse } from "next/server";

import { CONSENT_BUCKET, consentPathFor } from "@/lib/consentStorage";
import { getDonorSessionUser } from "@/lib/donorSession";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SIGNED_URL_TTL_SECONDS = 10 * 60;

// Checked against the file's first bytes, not the browser-reported type.
const FILE_KINDS = [
  { ext: "pdf", contentType: "application/pdf", signature: [0x25, 0x50, 0x44, 0x46] },
  { ext: "jpg", contentType: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
] as const;

export async function GET() {
  const user = await getDonorSessionUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { data: profile, error } = await supabaseAdmin
    .from("donor_profiles")
    .select("consent_form_url")
    .eq("donor_id", user.user_id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "ไม่สามารถโหลดหนังสือยินยอมได้", details: error.message }, { status: 500 });
  }

  const stored = profile?.consent_form_url;
  if (!stored) {
    return NextResponse.json({ error: "ยังไม่ได้แนบหนังสือยินยอม" }, { status: 404 });
  }

  if (/^https?:\/\//.test(stored)) {
    return NextResponse.json({ url: stored });
  }

  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from(CONSENT_BUCKET)
    .createSignedUrl(stored, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed) {
    return NextResponse.json({ error: "ไม่พบไฟล์หนังสือยินยอม", details: signError?.message }, { status: 404 });
  }

  return NextResponse.json({ url: signed.signedUrl });
}

export async function POST(request: Request) {
  const user = await getDonorSessionUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "กรุณาเลือกไฟล์หนังสือยินยอม" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "ขนาดไฟล์ต้องไม่เกิน 5 MB" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = FILE_KINDS.find(({ signature }) => signature.every((byte, i) => bytes[i] === byte));

  if (!kind) {
    return NextResponse.json({ error: "รองรับเฉพาะไฟล์ PDF หรือ JPG เท่านั้น" }, { status: 400 });
  }

  // Only stores the file; PUT /api/donor/profile/details links it to the profile.
  const path = consentPathFor(user.user_id, kind.ext);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(CONSENT_BUCKET)
    .upload(path, bytes, { contentType: kind.contentType, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: "อัปโหลดไฟล์ไม่สำเร็จ", details: uploadError.message }, { status: 500 });
  }

  return NextResponse.json({ path });
}
