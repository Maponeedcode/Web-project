import { NextResponse } from 'next/server';
// สมมติว่าคุณมีไฟล์ client สำหรับเชื่อมต่อ Supabase
// import { supabase } from '@/lib/supabase'; 

export async function GET() {
  try {
    // ตัวอย่างการดึงข้อมูลจากตาราง hospitals ใน Supabase
    // const { data, error } = await supabase.from('hospitals').select('*').single();
    
    // if (error) throw error;

    // ข้อมูลจำลองที่โครงสร้างตรงกับ Schema จริงของตาราง hospitals
    const hospitalData = {
      id: 'HSP-BKK-002',
      name: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
      province: 'กรุงเทพมหานคร',
      address: 'เลขที่ 1873 ถนนพระรามที่ 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330 อาคารภูมิสิริมังคลานุสรณ์ ชั้น 2 ฝ่ายเวชศาสตร์ชันสูตร',
      phone: '02-256-4300 ต่อ 3456',
      coordinator: 'คุณวรรณา ใจมั่น',
      coordinator_role: 'หัวหน้าห้องรับบริจาค',
      // อัปเดตโครงสร้างเวลาทำการให้รองรับข้อมูลแบบละเอียด
      operating_hours: {
        weekday: '08:30–16:30 น.',
        weekend: '08:30–15:30 น.',
        note: 'จันทร์ – ศุกร์ และ เสาร์ – อาทิตย์'
      },
      status: 'เปิดรับบริจาคปกติ'
    };

    return NextResponse.json({ success: true, data: hospitalData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}