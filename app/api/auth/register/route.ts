import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, fullname, password } = body;

    console.log('--- REGISTER API HIT ---');
    console.log('Username:', username);
    console.log('Password received:', password);
    console.log('Password length:', password ? String(password).length : 0);

    if (!username || !fullname || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
        console.log("Blocked")
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    // 1. Check username
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('user_id')
      .eq('user_name', username.trim()) // trim is delete space like " Pooh " result is "Pooh"
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่อผู้ใช้อื่น' },
        { status: 409 }
      );
    }

    // 2. Hash password with bcrpyt
    const saltRounds = 10; // is a work factor
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 3. Save to  users table
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        user_name: username.trim(),
        full_name: fullname.trim(),
        password_hash,
        role: 'donor',
      })
      .select('user_id, user_name, full_name, role')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'ลงทะเบียนสำเร็จ', user: newUser },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}