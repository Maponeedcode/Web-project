import { getSessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  if (new Date(session.expires_at) < new Date()) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("user_id, user_name, full_name, role")
    .eq("user_id", session.user_id)
    .single();

  if (userError || !user) {
    return NextResponse.json(
      { user: null },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}