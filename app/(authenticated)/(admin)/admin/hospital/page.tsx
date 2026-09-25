"use client";

import { useState, useEffect } from "react";
import type { Hospital } from "@/types/database";

export default function AdminHospitalPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    address: "",
    contact_phone: "",
    contact_person: "",
    operating_hours: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/hospital", { credentials: "include" });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "ไม่สามารถดึงข้อมูลโรงพยาบาลได้");
      }

      const data = await res.json();
      setHospital(data.hospital);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const handleOpenModal = () => {
    if (hospital) {
      setFormData({
        address: hospital.address || "",
        contact_phone: hospital.contact_phone || "",
        contact_person: hospital.contact_person || "",
        operating_hours: (hospital as any).operating_hours || "จันทร์ - ศุกร์ 08:30 - 16:30 น.",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await fetch("/api/admin/hospital", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "บันทึกข้อมูลไม่สำเร็จ");

      setHospital(result.hospital);
      setIsModalOpen(false);
      setFeedback({ type: "success", message: "บันทึกข้อมูลโรงพยาบาลสำเร็จแล้ว" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "เกิดข้อผิดพลาดในการบันทึก" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 gap-2">
        <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#126fd1]"></i>
        <span>กำลังโหลดข้อมูลโรงพยาบาล...</span>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 flex items-center gap-3">
        <i className="fa-solid fa-circle-exclamation text-xl"></i>
        <div>
          <p className="font-bold">เกิดข้อผิดพลาด</p>
          <p className="text-sm">{error || "ไม่พบข้อมูลโรงพยาบาล"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-medium border ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${feedback.type === "success" ? "fa-circle-check text-emerald-600" : "fa-circle-exclamation text-red-600"}`} />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      {/* ส่วนหัวหน้า */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-[#126fd1] text-xl shadow-sm">
            <i className="fa-solid fa-hospital"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0e3b6c] flex items-center gap-2">
              โรงพยาบาลในความดูแลของฉัน 
              <span className="text-sm font-normal text-slate-500">(My Assigned Hospital)</span>
            </h1>
            <p className="text-sm text-slate-500">ตรวจสอบและอัปเดตข้อมูลสถานที่ เบอร์ติดต่อตรง และเวลาทำการของสถานพยาบาลที่คุณรับผิดชอบ</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#126fd1]">
          <i className="fa-solid fa-shield-heart"></i> ดูแล 1 แห่ง
        </div>
      </div>

      {/* กล่องแสดงข้อมูลโรงพยาบาล */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ea384c]"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pt-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{hospital.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-700 font-mono">#{hospital.hospital_id}</span> · {hospital.province}
            </p>
          </div>
          <span className="mt-2 md:mt-0 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <i className="fa-solid fa-circle text-[8px]"></i> พร้อมรับบริจาคปกติ
          </span>
        </div>

        {/* ที่อยู่ */}
        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <i className="fa-solid fa-location-dot text-[#ea384c]"></i> ที่อยู่แบบละเอียด
          </p>
          <p className="whitespace-pre-line text-sm font-medium text-slate-800">{hospital.address || "ยังไม่ได้ระบุที่อยู่"}</p>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#0e3b6c] p-5 text-white shadow-sm">
            <p className="mb-2 flex items-center gap-1.5 text-xs text-blue-200">
              <i className="fa-solid fa-phone-volume text-blue-300"></i> เบอร์ฉุกเฉิน / คลังเลือด
            </p>
            <p className="text-xl font-bold tracking-wide">{hospital.contact_phone || "ยังไม่ได้ระบุเบอร์โทร"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
              <i className="fa-solid fa-user-tie text-slate-400"></i> ผู้ประสานงานหลัก
            </p>
            <p className="text-base font-bold text-slate-900">{hospital.contact_person || "ไม่ระบุชื่อผู้ประสานงาน"}</p>
            <p className="mt-0.5 text-xs text-slate-500">เจ้าหน้าที่ประจำสถานพยาบาล</p>
          </div>
        </div>

        {/* เวลาทำการ */}
        <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <i className="fa-regular fa-clock text-[#126fd1]"></i> เวลาทำการรับบริจาค
          </p>
          <div className="text-sm font-medium text-slate-800">
            {(hospital as any).operating_hours || "จันทร์ - ศุกร์ 08:30 - 16:30 น."}
          </div>
        </div>

        {/* ปุ่มเปิด Modal แก้ไข */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-xl bg-[#0e3b6c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a2747] shadow-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i> แก้ไขข้อมูล (Edit Details)
          </button>
        </div>
      </div>

      {/* Modal แก้ไขข้อมูล */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#126fd1]">
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">แก้ไขข้อมูลโรงพยาบาล</h2>
                  <p className="text-xs text-slate-500">อัปเดตที่อยู่ เบอร์ติดต่อตรง ผู้ประสานงาน และเวลาทำการ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* ส่วนที่ห้ามแก้ไข */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <i className="fa-solid fa-lock text-slate-400"></i> ข้อมูลที่ไม่สามารถแก้ไขได้
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">รหัสโรงพยาบาล</label>
                  <input type="text" disabled value={hospital.hospital_id} className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-600" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">ชื่อโรงพยาบาล</label>
                  <input type="text" disabled value={hospital.name} className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-600" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">จังหวัด</label>
                  <input type="text" disabled value={hospital.province} className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-600" />
                </div>
              </div>
            </div>

            {/* ฟอร์มแก้ไข */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">ที่อยู่แบบละเอียด *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#126fd1] focus:outline-none focus:ring-1 focus:ring-[#126fd1]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">เบอร์โทรศัพท์ติดต่อตรง *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#126fd1] focus:outline-none focus:ring-1 focus:ring-[#126fd1]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">ชื่อผู้ประสานงานหลัก</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="เช่น คุณวรรณา ใจมั่น"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#126fd1] focus:outline-none focus:ring-1 focus:ring-[#126fd1]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">เวลาทำการรับบริจาค</label>
                <input
                  type="text"
                  value={formData.operating_hours}
                  onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                  placeholder="เช่น จันทร์ - ศุกร์ 08:30 - 16:30 น."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#126fd1] focus:outline-none focus:ring-1 focus:ring-[#126fd1]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-[#ea384c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#c92f40] shadow-sm disabled:opacity-50"
                >
                  {submitting && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                  <i className="fa-solid fa-floppy-disk"></i> บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}