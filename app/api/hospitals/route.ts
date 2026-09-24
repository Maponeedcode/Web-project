import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// 1. GET: ดึงข้อมูลโรงพยาบาลของแอดมินที่ล็อกอินอยู่
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 });
    }

    // ตรวจสอบ Session จาก Token
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('user_id')
      .eq('token', token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'เซสชันหมดอายุหรือไม่ถูกต้อง' }, { status: 401 });
    }

    // ดึงข้อมูลโรงพยาบาลหลักมาแสดง
    const { data: hospital, error: hospitalError } = await supabaseAdmin
      .from('hospitals')
      .select('*')
      .limit(1)
      .single();

    if (hospitalError) {
      return NextResponse.json({ error: hospitalError.message }, { status: 500 });
    }

    return NextResponse.json({ hospital });
  } catch (err: any) {
    console.error('Get Hospital API Error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// 2. PUT: อัปเดตข้อมูลโรงพยาบาล
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, address, phone, coordinator, hours } = body;

    const { data, error } = await supabaseAdmin
      .from('hospitals')
      .update({
        address,
        phone,
        coordinator,
        hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'อัปเดตข้อมูลโรงพยาบาลสำเร็จ',
      hospital: data,
    });
  } catch (err: any) {
    console.error('Update Hospital API Error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}