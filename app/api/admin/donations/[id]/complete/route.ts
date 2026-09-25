import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { bangkokToday } from "@/types/database";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recordId } = await params;
    const body = await request.json();
    const volume_ml = Number(body.volume_ml) || 450;

    // ตรวจสอบ Token
    const token = await getSessionToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์ Admin/Staff
    const { data: session } = await supabaseAdmin
      .from("sessions")
      .select("user_id, users(role)")
      .eq("token", token)
      .single();

    const userRole = (session?.users as unknown as { role: string })?.role;
    if (!session || !["hospital_admin", "system_admin"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. ดึง donor_id จาก donation_record
    const { data: record, error: findError } = await supabaseAdmin
      .from("donation_records")
      .select("record_id, donor_id, request_id")
      .eq("record_id", recordId)
      .single();

    if (findError || !record) {
      return NextResponse.json({ error: "ไม่พบรายการบริจาคนี้" }, { status: 404 });
    }

    const todayStr = bangkokToday();

    // 2. อัปเดต donation_records ให้เป็น COMPLETED
    const { error: updateRecordError } = await supabaseAdmin
      .from("donation_records")
      .update({
        status: "COMPLETED",
        volume_ml,
        donation_date: todayStr,
      })
      .eq("record_id", recordId);

    if (updateRecordError) {
      return NextResponse.json({ error: updateRecordError.message }, { status: 500 });
    }

    // 3. อัปเดต last_donate_date ของ donor เพื่อเริ่มนับ cooldown 90 วัน
    await supabaseAdmin
      .from("donor_profiles")
      .update({
        last_donate_date: todayStr,
        is_ready: false, // ปิดสถานะพร้อมชั่วคราวเนื่องจากต้องพักฟื้น
      })
      .eq("donor_id", record.donor_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete donation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}