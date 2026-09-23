import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// =====================================================
// GET /api/auth/requests
// ดึงคำร้องขอเลือดสำหรับ Donor ที่ Login อยู่
// =====================================================
export async function GET() {
  try {
    // 1. ตรวจสอบ Session
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        {
          error: "กรุณาเข้าสู่ระบบ",
        },
        { status: 401 }
      );
    }

    // 2. หา session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("user_id, expires_at")
      .eq("token", token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        {
          error: "Session ไม่ถูกต้อง",
        },
        { status: 401 }
      );
    }

    // 3. ตรวจสอบ Session หมดอายุ
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        {
          error: "Session หมดอายุ กรุณา Login ใหม่",
        },
        { status: 401 }
      );
    }

    // 4. ดึงข้อมูล User
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("user_id, user_name, full_name, role")
      .eq("user_id", session.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "ไม่พบข้อมูลผู้ใช้",
        },
        { status: 404 }
      );
    }

    // 5. ตรวจสอบว่าเป็น Donor
    if (user.role !== "donor") {
      return NextResponse.json(
        {
          error: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
        },
        { status: 403 }
      );
    }

    // 6. ดึง Blood Requests
    const { data: requests, error: requestsError } = await supabaseAdmin
      .from("blood_requests")
      .select(`
        request_id,
        hospital_id,
        blood_type,
        rh_factor,
        units_needed,
        urgency_level,
        purpose,
        target_date,
        status,
        created_at,
        hospitals (
          name,
          province,
          address,
          contact_phone,
          contact_person
        )
      `)
      .eq("status", "OPEN")
      .order("created_at", {
        ascending: false,
      });

    if (requestsError) {
      console.error(
        "GET /api/auth/requests error:",
        requestsError
      );

      return NextResponse.json(
        {
          error: "Failed to fetch blood requests",
          details: requestsError.message,
        },
        { status: 500 }
      );
    }

    // 7. ส่งข้อมูลกลับ
    return NextResponse.json({
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        full_name: user.full_name,
        role: user.role,
      },
      requests: requests ?? [],
    });
  } catch (error) {
    console.error("GET /api/auth/requests error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}