export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BloodBadge from "@/components/BloodBadge";
import AdminSidebar from "@/components/layout/AdminSidebar";

// ==========================================
// โครงสร้างข้อมูลรายการบริจาคโลหิต (Donation Item Interface)
// ใช้กำหนดรูปแบบข้อมูลที่ดึงมาแสดงผล เช่น รหัสรายการ, วันที่, และสถานะ
// ==========================================
interface DonationItem {
  record_id: string;
  donation_date: string;
  status: "ACCEPTED" | "COMPLETED" | "CANCELLED";
  volume_ml: number | null;
}

// ==========================================
// ฟังก์ชันหลักของหน้าจัดการรายการบริจาคโลหิตสำหรับแอดมิน (Admin Page)
// หน้าที่หลัก: แสดงตารางข้อมูลรายการบริจาคทั้งหมด ตรวจสอบสถานะ 
// และใช้สำหรับพรีเซนต์การจัดการข้อมูลหลังบ้านของระบบบริจาคเลือด
// ==========================================
export default function AdminDonationsPage() {
  return (
    <div className="flex">
      {/* @ts-ignore */}
      <AdminSidebar userName="Admin" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">จัดการรายการบริจาคโลหิต</h1>
        
        {/* ส่วนแสดงตารางข้อมูลหรือจัดการสถานะการบริจาค */}
        <div className="bg-white p-4 rounded shadow">
          <p>ตารางแสดงข้อมูลรายการบริจาคโลหิตในระบบ</p>
        </div>
      </main>
    </div>
  );
}