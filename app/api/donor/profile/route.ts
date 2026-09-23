import { NextResponse } from "next/server";

import { getDonorSessionUser } from "@/lib/donorSession";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(request: Request) {
  const user = await getDonorSessionUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body.is_ready !== "boolean") {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("donor_profiles")
    .update({ is_ready: body.is_ready })
    .eq("donor_id", user.user_id)
    .select("donor_id, blood_type, rh_factor, province, is_ready, last_donate_date")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "ไม่สามารถอัปเดตสถานะได้", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ profile: data });
}
