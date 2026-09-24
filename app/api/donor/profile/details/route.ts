import { NextResponse } from "next/server";

import { getDonorSessionUser } from "@/lib/donorSession";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { THAI_PROVINCES } from "@/lib/thaiProvinces";

const PROFILE_COLUMNS =
  "blood_type, rh_factor, gender, date_of_birth, weight, height, province, is_ready, has_chronic_disease, medical_notes, consent_form_url, last_donate_date";

const BLOOD_TYPES = ["A", "B", "AB", "O"];
const GENDERS = ["ชาย", "หญิง"];
const MAX_NOTES_LENGTH = 500;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  const user = await getDonorSessionUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const [userResult, profileResult] = await Promise.all([
    supabaseAdmin.from("users").select("user_name, full_name, phone").eq("user_id", user.user_id).maybeSingle(),
    supabaseAdmin.from("donor_profiles").select(PROFILE_COLUMNS).eq("donor_id", user.user_id).maybeSingle(),
  ]);

  const error = userResult.error ?? profileResult.error;
  if (error) {
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: userResult.data, profile: profileResult.data });
}

export async function PUT(request: Request) {
  const user = await getDonorSessionUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").replace(/[^0-9]/g, "");
  const weight = Number(body.weight);
  const height = body.height === "" || body.height == null ? null : Number(body.height);
  const medicalNotes = String(body.medicalNotes ?? "").trim();
  const lastDonateDate = body.lastDonateDate ? String(body.lastDonateDate) : null;

  if (phone.length < 9 || phone.length > 10) {
    return NextResponse.json({ error: "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)" }, { status: 400 });
  }
  if (!THAI_PROVINCES.includes(body.province)) {
    return NextResponse.json({ error: "กรุณาเลือกจังหวัด" }, { status: 400 });
  }
  if (!BLOOD_TYPES.includes(body.bloodType) || !["+", "-"].includes(body.rh)) {
    return NextResponse.json({ error: "กรุณาเลือกหมู่โลหิตให้ครบถ้วน" }, { status: 400 });
  }
  if (!DATE_PATTERN.test(String(body.dateOfBirth ?? "")) || !GENDERS.includes(body.gender)) {
    return NextResponse.json({ error: "กรุณากรอกวันเกิดและเพศให้ครบถ้วน" }, { status: 400 });
  }
  if (!Number.isFinite(weight) || weight < 45) {
    return NextResponse.json({ error: "น้ำหนักต้องไม่ต่ำกว่า 45 กิโลกรัม" }, { status: 400 });
  }
  if (height !== null && (!Number.isFinite(height) || height <= 0)) {
    return NextResponse.json({ error: "ส่วนสูงไม่ถูกต้อง" }, { status: 400 });
  }
  if (medicalNotes.length > MAX_NOTES_LENGTH) {
    return NextResponse.json({ error: `รายละเอียดโรคประจำตัวต้องไม่เกิน ${MAX_NOTES_LENGTH} ตัวอักษร` }, { status: 400 });
  }
  if (lastDonateDate !== null && !DATE_PATTERN.test(lastDonateDate)) {
    return NextResponse.json({ error: "วันที่บริจาคล่าสุดไม่ถูกต้อง" }, { status: 400 });
  }

  const hasChronicDisease = Boolean(body.hasChronicDisease);

  const { error: userError } = await supabaseAdmin.from("users").update({ phone }).eq("user_id", user.user_id);
  if (userError) {
    return NextResponse.json({ error: "ไม่สามารถบันทึกเบอร์โทรศัพท์ได้", details: userError.message }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("donor_profiles")
    .upsert(
      {
        donor_id: user.user_id,
        blood_type: body.bloodType,
        rh_factor: body.rh === "+" ? "Positive" : "Negative",
        gender: body.gender,
        date_of_birth: body.dateOfBirth,
        weight,
        height,
        province: body.province,
        is_ready: Boolean(body.isReady),
        has_chronic_disease: hasChronicDisease,
        medical_notes: hasChronicDisease && medicalNotes ? medicalNotes : null,
        last_donate_date: lastDonateDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "donor_id" },
    )
    .select(PROFILE_COLUMNS)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "ไม่สามารถบันทึกข้อมูลโปรไฟล์ได้", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
