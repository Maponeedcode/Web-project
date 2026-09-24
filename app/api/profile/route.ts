import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// NOTE: the `users` table currently only has a `phone` column for this form.
// province / blood type / dob / gender / weight / height / conditions /
// guardian consent / availability toggles / last donation date still need
// their own columns (or a `donor_profiles` table) before they can persist.
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
  }

  const body = await req.json();
  const cleanPhone = String(body.phone ?? '').replace(/[^0-9]/g, '');

  if (cleanPhone.length < 9 || cleanPhone.length > 10) {
    return NextResponse.json({ error: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ phone: cleanPhone })
    .eq('user_id', user.user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'บันทึกข้อมูลสำเร็จ' });
}
