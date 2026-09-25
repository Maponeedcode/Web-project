import { NextResponse } from 'next/server';

// ข้อมูลจำลองที่โครงสร้างตรงกับ Schema ของตาราง hospitals
let mockHospitals = [
  {
    id: '1',
    name: 'โรงพยาบาลศูนย์การแพทย์ มหาวิทยาลัยวลัยลักษณ์',
    province: 'นครศรีธรรมราช',
    address: '222 ต.ไทยบุรี อ.ท่าศาลา',
    phone: '075-672-000',
    operating_hours: '08:30 - 16:30 น.',
    status: 'active'
  },
  {
    id: '2',
    name: 'โรงพยาบาลท่าศาลา',
    province: 'นครศรีธรรมราช',
    address: 'ท่าศาลา, นครศรีธรรมราช',
    phone: '075-521-333',
    operating_hours: 'เปิดบริการ 24 ชั่วโมง',
    status: 'active'
  }
];

// GET: สำหรับดึงข้อมูลโรงพยาบาลทั้งหมด
export async function GET() {
  return NextResponse.json(mockHospitals);
}

// POST: สำหรับเพิ่มโรงพยาบาลใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newHospital = {
      id: Date.now().toString(),
      name: body.name,
      province: body.province,
      address: body.address || '',
      phone: body.phone,
      operating_hours: body.operating_hours || '08:30 - 16:30 น.',
      status: body.status || 'active'
    };
    
    mockHospitals.push(newHospital);
    return NextResponse.json({ success: true, data: newHospital }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}