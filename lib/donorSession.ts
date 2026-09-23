import { getSessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface DonorSessionUser {
  user_id: string;
  full_name: string;
  role: string;
}

export async function getDonorSessionUser(): Promise<DonorSessionUser | null> {
  const token = await getSessionToken();

  if (!token) return null;

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select(`
      user_id,
      expires_at,
      users (
        user_id,
        full_name,
        role
      )
    `)
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data?.users) return null;

  const user = data.users as unknown as DonorSessionUser;

  return user.role === "donor" ? user : null;
}
