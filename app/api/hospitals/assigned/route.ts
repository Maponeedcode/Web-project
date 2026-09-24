import { NextResponse } from 'next/server';

// ข้อมูลจำลองสำหรับทดสอบการดึงผ่าน API (ในอนาคตสามารถเปลี่ยนไป Query จาก Supabase ได้ที่นี่)
let assignedHospital = {
  id: '1',
  code: '#HSP-BKK-002',
  name: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
  province: 'กรุงเทพมหานคร',
  address: 'เลขที่ 1873 ถนนพระรามที่ 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330',
  building_detail: 'อาคารภูมิสิริมังคลานุสรณ์ ชั้น 2 ฝ่ายเวชศาสตร์ชันสูตร',
  phone: '02-256-4300 ต่อ 3456',
  manager_name: 'คุณวรรณา ใจมั่น',
  manager_role: 'หัวหน้าห้องรับบริจาค',
  operating_hours: 'จันทร์–ศุกร์ 08:30–16:30 น. / เสาร์–อาทิตย์ 08:30–15:30 น.',
  status: 'เปิดรับบริจาคปกติ',
};

// GET: ดึงข้อมูลโรงพยาบาล
export async function GET() {
  try {
    return NextResponse.json(assignedHospital, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hospital data' }, { status: 500 });
  }
}

// PUT: อัปเดตข้อมูลโรงพยาบาล
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // อัปเดตข้อมูลเฉพาะฟิลด์ที่อนุญาตให้แก้ไข
    assignedHospital = {
      ...assignedHospital,
      address: body.address ?? assignedHospital.address,
      building_detail: body.building_detail ?? assignedHospital.building_detail,
      phone: body.phone ?? assignedHospital.phone,
      manager_name: body.manager_name ?? assignedHospital.manager_name,
      manager_role: body.manager_role ?? assignedHospital.manager_role,
      operating_hours: body.operating_hours ?? assignedHospital.operating_hours,
    };

    return NextResponse.json(assignedHospital, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hospital data' }, { status: 500 });
  }
}