import { NextResponse } from "next/server";

import { getDonorSessionUser } from "@/lib/donorSession";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "consent-documents";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Checked against the file's first bytes, not the browser-reported type.
const FILE_KINDS = [
  { ext: "pdf", contentType: "application/pdf", signature: [0x25, 0x50, 0x44, 0x46] },
  { ext: "jpg", contentType: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
];

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

  const path = `${user.user_id}/consent.${kind.ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: kind.contentType, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: "อัปโหลดไฟล์ไม่สำเร็จ", details: uploadError.message }, { status: 500 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("donor_profiles")
    .update({ consent_form_url: path, updated_at: new Date().toISOString() })
    .eq("donor_id", user.user_id)
    .select("donor_id");

  if (updateError || !updated?.length) {
    await supabaseAdmin.storage.from(BUCKET).remove([path]);
    return NextResponse.json(
      { error: "กรุณาบันทึกข้อมูลโปรไฟล์ก่อนแนบหนังสือยินยอม", details: updateError?.message },
      { status: updateError ? 500 : 400 },
    );
  }

  const staleExt = kind.ext === "pdf" ? "jpg" : "pdf";
  await supabaseAdmin.storage.from(BUCKET).remove([`${user.user_id}/consent.${staleExt}`]);

  return NextResponse.json({ path });
}
