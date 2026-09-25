import { NextResponse } from "next/server";
import { requireHospitalAdmin } from "@/lib/requireHospitalAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET: ดึงข้อมูลโรงพยาบาลของแอดมินที่ล็อกอิน
export async function GET() {
  try {
    const admin = await requireHospitalAdmin();

    if (!admin.hospital_id) {
      return NextResponse.json(
        { error: "บัญชีนี้ยังไม่ได้ผูกกับโรงพยาบาลใด" },
        { status: 400 }
      );
    }

    const { data: hospital, error } = await supabaseAdmin
      .from("hospitals")
      .select("hospital_id, name, province, address, contact_phone, contact_person")
      .eq("hospital_id", admin.hospital_id)
      .single();

    if (error || !hospital) {
      return NextResponse.json({ error: "ไม่พบข้อมูลโรงพยาบาล" }, { status: 404 });
    }

    return NextResponse.json({
      hospital,
      adminName: admin.full_name || "ผู้ดูแลระบบ",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

// PUT: แก้ไขข้อมูลโรงพยาบาล
export async function PUT(request: Request) {
  try {
    const admin = await requireHospitalAdmin();

    if (!admin.hospital_id) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์แก้ไขข้อมูลโรงพยาบาล" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { address, contact_phone, contact_person } = body;

    const { data: hospital, error } = await supabaseAdmin
      .from("hospitals")
      .update({
        address,
        contact_phone,
        contact_person,
      })
      .eq("hospital_id", admin.hospital_id)
      .select("hospital_id, name, province, address, contact_phone, contact_person")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "บันทึกข้อมูลโรงพยาบาลสำเร็จ",
      hospital,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}