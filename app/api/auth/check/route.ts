import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Find token in sessions with users (join)
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

    if (error || !sessionData || !sessionData.users) {
      // หาก Session หมดอายุหรือไม่ถูกต้อง ให้ล้าง Cookie ทิ้ง
      cookieStore.delete('session_token');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: sessionData.users,
    });
  } catch (err: any) {
    console.error('Check Session Error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 });
  }
}