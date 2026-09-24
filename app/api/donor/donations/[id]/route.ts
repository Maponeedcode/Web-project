import { NextResponse } from "next/server";

import { getDonorSessionUser } from "@/lib/donorSession";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getDonorSessionUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ไม่พบรหัสรายการบริจาค" }, { status: 400 });
  }

  const { data: donation, error: donationError } = await supabaseAdmin
    .from("donation_records")
    .select("record_id, request_id, status")
    .eq("record_id", id)
    .eq("donor_id", user.user_id)
    .maybeSingle();

  if (donationError) {
    console.error("Find donor donation failed:", donationError);
    return NextResponse.json(
      { error: "ไม่สามารถตรวจสอบรายการบริจาคได้" },
      { status: 500 },
    );
  }

  if (!donation) {
    return NextResponse.json({ error: "ไม่พบรายการบริจาคนี้" }, { status: 404 });
  }

  if (!["ACCEPTED", "PENDING"].includes(donation.status.toUpperCase())) {
    return NextResponse.json(
      { error: "รายการนี้ไม่สามารถยกเลิกได้ในสถานะปัจจุบัน" },
      { status: 409 },
    );
  }

  const { data: updatedDonation, error: updateDonationError } = await supabaseAdmin
    .from("donation_records")
    .update({ status: "CANCELLED" })
    .eq("record_id", id)
    .eq("donor_id", user.user_id)
    .in("status", ["ACCEPTED", "PENDING"])
    .select("record_id, request_id, status")
    .maybeSingle();

  if (updateDonationError) {
    console.error("Cancel donor donation failed:", updateDonationError);
    return NextResponse.json(
      { error: "ยกเลิกรายการบริจาคไม่สำเร็จ" },
      { status: 500 },
    );
  }

  if (!updatedDonation) {
    return NextResponse.json(
      { error: "รายการถูกเปลี่ยนสถานะแล้ว กรุณารีเฟรชข้อมูลอีกครั้ง" },
      { status: 409 },
    );
  }

  if (donation.request_id) {
    const { error: requestError } = await supabaseAdmin
      .from("blood_requests")
      .update({ status: "OPEN" })
      .eq("request_id", donation.request_id)
      .eq("status", "IN_PROGRESS");

    if (requestError) {
      console.error("Reopen blood request after donor cancellation failed:", requestError);
      await supabaseAdmin
        .from("donation_records")
        .update({ status: donation.status })
        .eq("record_id", id)
        .eq("donor_id", user.user_id)
        .eq("status", "CANCELLED");
      return NextResponse.json(
        { error: "ยกเลิกการตอบรับแล้ว แต่ไม่สามารถเปิดคำร้องกลับได้" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    message: "ยกเลิกการตอบรับเรียบร้อยแล้ว",
    donation: updatedDonation,
  });
}
