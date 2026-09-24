'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function HospitalManagementPage() {
  const [adminName, setAdminName] = useState('สุทธิวงค์ ทิพย์มาก');
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // ดึงข้อมูลจาก API แทนการใช้ localStorage
  useEffect(() => {
    async function fetchHospitalData() {
      try {
        const response = await fetch('/api/hospitals');
        const result = await response.json();
        if (result.success) {
          setHospital(result.data);
          setFormData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch hospital data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHospitalData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHospital(formData);
    setIsModalOpen(false);
    // หมายเหตุ: ในขั้นตอนถัดไป สามารถเขียนฟังก์ชันส่งค่า PUT/PATCH ไปอัปเดต Supabase ผ่าน API ได้ที่นี่
  };

  if (loading || !hospital) {
    return (
      <AdminSidebar userName={adminName}>
        <div className="flex h-64 items-center justify-center text-slate-500">
          กำลังโหลดข้อมูลโรงพยาบาล...
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar userName={adminName}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {/* เปลี่ยนจาก Emoji เป็น SVG Icon */}
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                โรงพยาบาลในความดูแลของฉัน <span className="text-sm font-normal text-slate-500">(My Assigned Hospitals)</span>
              </h1>
              <p className="text-sm text-slate-500">ตรวจสอบและอัปเดตข้อมูลสถานที่ตั้ง เบอร์ติดต่อตรง และเวลาทำการของสถานพยาบาลที่คุณรับผิดชอบ</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100">
            ดูแล 1 แห่ง
          </span>
        </div>

        {/* Hospital Card */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-1.5 bg-red-600 w-full" />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{hospital.name}</h2>
                <p className="text-sm text-slate-500">#{hospital.id} • {hospital.province}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500" /> {hospital.status}
              </span>
            </div>

            {/* Address */}
            <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                📍 ที่อยู่แบบละเอียด
              </span>
              <p className="text-sm font-medium text-slate-800 whitespace-pre-line">{hospital.address}</p>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#0e3b6c] text-white p-5 space-y-1 shadow-sm">
                <span className="text-xs text-blue-200 flex items-center gap-1.5">
                  📞 เบอร์ฉุกเฉิน / คลังเลือด
                </span>
                <p className="text-xl font-bold tracking-wide">{hospital.phone}</p>
              </div>

              <div className="rounded-xl bg-slate-50/70 p-5 border border-slate-100 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  👤 ผู้ประสานงาน
                </span>
                <p className="text-lg font-bold text-slate-900">{hospital.coordinator}</p>
                <p className="text-xs text-slate-500">{hospital.coordinator_role}</p>
              </div>
            </div>

            {/* Operating Hours (Updated Schema Structure) */}
            <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                🕒 เวลาทำการ
              </span>
              <div className="text-sm font-medium text-slate-800 space-y-0.5">
                <p>• วันจันทร์ - ศุกร์: {hospital.operating_hours?.weekday}</p>
                <p>• วันเสาร์ - อาทิตย์: {hospital.operating_hours?.weekend}</p>
                <p className="text-xs text-slate-500 pt-1">หมายเหตุ: {hospital.operating_hours?.note}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setFormData(hospital); setIsModalOpen(true); }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
              >
                {/* SVG Icon แทน Emoji ดินสอ */}
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                แก้ไขข้อมูล (Edit Details)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">แก้ไขข้อมูลโรงพยาบาล</h3>
                  <p className="text-xs text-slate-500">อัปเดตที่อยู่ เบอร์ติดต่อตรง ผู้ประสานงาน และเวลาทำการ</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">🔒 ข้อมูลที่ไม่สามารถแก้ไขได้</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500">รหัสโรงพยาบาล</label>
                    <input disabled value={formData.id} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500">ชื่อโรงพยาบาล</label>
                    <input disabled value={formData.name} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500">จังหวัด</label>
                    <input disabled value={formData.province} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">ที่อยู่แบบละเอียด *</label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">เบอร์โทรศัพท์ติดต่อตรง *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">ชื่อผู้ประสานงาน *</label>
                    <input
                      type="text"
                      value={formData.coordinator}
                      onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* ฟิลด์เวลาทำการแยกย่อยตาม Schema ใหม่ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">เวลาทำการ (จันทร์ - ศุกร์) *</label>
                    <input
                      type="text"
                      value={formData.operating_hours?.weekday || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        operating_hours: { ...formData.operating_hours, weekday: e.target.value }
                      })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">เวลาทำการ (เสาร์ - อาทิตย์) *</label>
                    <input
                      type="text"
                      value={formData.operating_hours?.weekend || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        operating_hours: { ...formData.operating_hours, weekend: e.target.value }
                      })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}