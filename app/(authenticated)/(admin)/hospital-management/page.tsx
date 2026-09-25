'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export interface HospitalDetail {
  id: string;
  code: string;
  name: string;
  province: string;
  address: string;
  building_detail?: string;
  phone: string;
  manager_name: string;
  manager_role: string;
  operating_hours: string;
  status: string;
}

export default function AssignedHospitalPage() {
  const [hospital, setHospital] = useState<HospitalDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<HospitalDetail>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ดึงข้อมูลผ่าน API
  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hospitals/assigned');
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลโรงพยาบาลได้');
      const data = await res.json();
      setHospital(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const handleOpenModal = () => {
    if (hospital) {
      setFormData(hospital);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/hospitals/assigned', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('บันทึกข้อมูลไม่สำเร็จ');

      const updatedData = await res.json();
      setHospital(updatedData);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminSidebar userName="สุทธิวงค์ ทิพย์มาก">
        <div className="flex justify-center items-center py-20 text-gray-500 gap-2">
          <i className="fa-solid fa-spinner fa-spin text-xl"></i> กำลังโหลดข้อมูล...
        </div>
      </AdminSidebar>
    );
  }

  if (error || !hospital) {
    return (
      <AdminSidebar userName="สุทธิวงค์ ทิพย์มาก">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i> {error || 'ไม่พบข้อมูลโรงพยาบาล'}
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar userName="สุทธิวงค์ ทิพย์มาก">
      {/* ส่วนหัว */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-hospital"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              โรงพยาบาลในความดูแลของฉัน 
              <span className="text-sm font-normal text-gray-500">(My Assigned Hospitals)</span>
            </h1>
            <p className="text-sm text-gray-500">ตรวจสอบและอัปเดตข้อมูลสถานที่ เบอร์ติดต่อตรง และเวลาทำการของสถานพยาบาลที่คุณรับผิดชอบ</p>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-blue-100">
          <i className="fa-solid fa-shield-heart"></i> ดูแล 1 แห่ง
        </div>
      </div>

      {/* Card แสดงรายละเอียดโรงพยาบาล */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600 rounded-t-2xl"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pt-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{hospital.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-semibold text-gray-700">{hospital.code}</span> · {hospital.province}
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 mt-2 md:mt-0">
            <i className="fa-solid fa-circle text-[8px]"></i> {hospital.status}
          </span>
        </div>

        {/* ที่อยู่แบบละเอียด */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-1">
            <i className="fa-solid fa-location-dot text-gray-400"></i> ที่อยู่แบบละเอียด
          </p>
          <p className="text-gray-800 text-sm font-medium">{hospital.address}</p>
          {hospital.building_detail && (
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1.5">
              <i className="fa-solid fa-building text-gray-400"></i> {hospital.building_detail}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* เบอร์โทรฉุกเฉิน / คลังเลือด */}
          <div className="bg-[#0d233a] text-white rounded-xl p-5 shadow-sm">
            <p className="text-xs text-gray-300 flex items-center gap-1.5 mb-2">
              <i className="fa-solid fa-phone-volume text-blue-300"></i> เบอร์ฉุกเฉิน / คลังเลือด
            </p>
            <p className="text-xl font-bold tracking-wide">{hospital.phone}</p>
          </div>

          {/* ผู้ประสานงาน */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-2">
              <i className="fa-solid fa-user-tie text-gray-400"></i> ผู้ประสานงาน
            </p>
            <p className="text-base font-bold text-gray-900">{hospital.manager_name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{hospital.manager_role}</p>
          </div>
        </div>

        {/* เวลาทำการ */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-2">
            <i className="fa-regular fa-clock text-gray-400"></i> เวลาทำการ
          </p>
          <div className="text-sm font-medium text-gray-800">
            {hospital.operating_hours}
          </div>
        </div>

        {/* ปุ่มแก้ไขข้อมูล */}
        <div className="flex justify-end">
          <button
            onClick={handleOpenModal}
            className="bg-[#0d233a] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i> แก้ไขข้อมูล (Edit Details)
          </button>
        </div>
      </div>

      {/* Modal สำหรับแก้ไขข้อมูล */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">แก้ไขข้อมูลโรงพยาบาล</h2>
                  <p className="text-xs text-gray-500">อัปเดตที่อยู่ เบอร์ติดต่อตรง ผู้ประสานงาน และเวลาทำการ</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* ข้อมูลที่ไม่สามารถแก้ไขได้ */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-3">
                <i className="fa-solid fa-lock text-gray-400"></i> ข้อมูลที่ไม่สามารถแก้ไขได้
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">รหัสโรงพยาบาล</label>
                  <input type="text" disabled value={formData.code || ''} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">ชื่อโรงพยาบาล</label>
                  <input type="text" disabled value={formData.name || ''} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">จังหวัด</label>
                  <input type="text" disabled value={formData.province || ''} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ที่อยู่แบบละเอียด *</label>
                <textarea 
                  rows={2}
                  required
                  value={formData.address || ''} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อตรง *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone || ''} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mesh mb-1">ชื่อผู้ประสานงาน *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.manager_name || ''} 
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">เวลาทำการ *</label>
                <input 
                  type="text"
                  required
                  value={formData.operating_hours || ''} 
                  onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  {submitting && <i className="fa-solid fa-spinner fa-spin"></i>}
                  <i className="fa-solid fa-floppy-disk"></i> บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}
