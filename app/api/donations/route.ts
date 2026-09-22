import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSessionToken } from "@/lib/session";

// =========================================
// POST /api/donations
// =========================================
export async function POST(request: Request) {
  try {
    console.log("===== DONATE API =====");

    // =========================================
    // 1. ตรวจสอบ Session
    // =========================================
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        {
          error: "Please login first.",
        },
        { status: 401 }
      );
    }

    // =========================================
    // 2. หา User จาก Session
    // =========================================
    const {
      data: session,
      error: sessionError,
    } = await supabaseAdmin
      .from("sessions")
      .select("user_id, expires_at")
      .eq("token", token)
      .single();

    if (sessionError || !session) {
      console.error("SESSION ERROR:", sessionError);

      return NextResponse.json(
        {
          error: "Invalid session.",
          details: sessionError?.message,
        },
        { status: 401 }
      );
    }

    // ตรวจสอบ session หมดอายุ
    if (
      session.expires_at &&
      new Date(session.expires_at) < new Date()
    ) {
      return NextResponse.json(
        {
          error: "Session expired.",
        },
        { status: 401 }
      );
    }

    const userId = session.user_id;

    console.log("USER ID:", userId);

    // =========================================
    // 3. รับ request_id
    // =========================================
    const body = await request.json();

    const requestId = body.request_id;

    console.log("REQUEST ID:", requestId);

    if (!requestId) {
      return NextResponse.json(
        {
          error: "request_id is required.",
        },
        { status: 400 }
      );
    }

    // =========================================
    // 4. หา Blood Request
    // =========================================
    const {
      data: bloodRequest,
      error: requestError,
    } = await supabaseAdmin
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
        created_at
      `)
      .eq("request_id", requestId)
      .single();

    if (requestError) {
      console.error(
        "BLOOD REQUEST ERROR:",
        requestError
      );

      return NextResponse.json(
        {
          error: "Failed to find blood request.",
          details: requestError.message,
          code: requestError.code,
        },
        { status: 500 }
      );
    }

    if (!bloodRequest) {
      return NextResponse.json(
        {
          error: "Blood request not found.",
        },
        { status: 404 }
      );
    }

    console.log(
      "BLOOD REQUEST:",
      bloodRequest
    );

    // =========================================
    // 5. ตรวจสอบ Status
    // =========================================
    if (bloodRequest.status !== "OPEN") {
      return NextResponse.json(
        {
          error:
            "This blood request is no longer available.",
          current_status:
            bloodRequest.status,
        },
        { status: 409 }
      );
    }

    // =========================================
    // 6. INSERT Donation
    // =========================================
    console.log("INSERT DONATION...");

    const {
      data: donation,
      error: donationError,
    } = await supabaseAdmin
      .from("donations")
      .insert({
        request_id: requestId,
        donor_id: userId,
        status: "ACCEPTED",
      })
      .select()
      .single();

    if (donationError) {
      console.error(
        "DONATION INSERT ERROR:",
        donationError
      );

      return NextResponse.json(
        {
          error: "Failed to create donation.",
          details:
            donationError.message,
          code:
            donationError.code,
          hint:
            donationError.hint,
        },
        { status: 500 }
      );
    }

    console.log(
      "DONATION CREATED:",
      donation
    );

    // =========================================
    // 7. Update Blood Request
    // =========================================
    const {
      error: updateError,
    } = await supabaseAdmin
      .from("blood_requests")
      .update({
        status: "IN_PROGRESS",
      })
      .eq(
        "request_id",
        requestId
      );

    if (updateError) {
      console.error(
        "UPDATE REQUEST ERROR:",
        updateError
      );
    }

    // =========================================
    // 8. Success
    // =========================================
    return NextResponse.json(
      {
        message:
          "Donation accepted successfully.",

        donation: donation,

        request: bloodRequest,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "DONATE API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}