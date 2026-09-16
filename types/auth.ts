import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface AuthUser {
  user_id: string;
  user_name: string;
  full_name: string;
  role: string;
  hospital_id?: string | null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return null;

  const { data: sessionData, error } = await supabaseAdmin
    .from('sessions')
    .select(`
      session_token,
      expires_at,
      users (
        user_id,
        user_name,
        full_name,
        role,
        hospital_id
      )
    `)
    .eq('session_token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !sessionData || !sessionData.users) return null;

  // Cast Type by use unknown to fix Type Mismatch  Supabase
  const user = (sessionData.users as unknown) as AuthUser;

  return user;
}