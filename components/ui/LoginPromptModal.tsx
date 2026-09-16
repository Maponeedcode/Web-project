'use client';

import Link from 'next/link';

interface ModalProps {
  isOpen: boolean;
  hospitalName: string;
  bloodType: string;
  onClose: () => void;
}

export default function LoginPromptModal({ isOpen, hospitalName, bloodType, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e3b6c]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition flex items-center justify-center focus:outline-none shrink-0"
          aria-label="ปิดหน้าต่าง"
        >
          <i className="fa-solid fa-xmark text-xs sm:text-sm"></i>
        </button>

        <div className="flex items-center gap-3 sm:gap-4 mb-3.5 sm:mb-5 pr-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 text-[#dc2626] flex items-center justify-center shrink-0 text-base sm:text-lg shadow-sm">
            <i className="fa-solid fa-shield-heart"></i>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#ea384c] block">
              DONOR VERIFICATION
            </span>
            <h3 className="text-sm sm:text-lg md:text-xl font-black text-[#0e3b6c] leading-snug">
              ยืนยันความพร้อมก่อนตอบรับเคส
            </h3>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-3 flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-[#0e3b6c] text-white flex flex-col items-center justify-center shrink-0 shadow-sm px-1 text-center">
            <span className="text-xl font-black leading-none tracking-tight">{bloodType}</span>
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-400 block">สถานพยาบาลที่ขอรับโลหิต</span>
            <h4 className="text-sm sm:text-base font-bold text-[#0e3b6c] truncate leading-tight mt-0.5">
              {hospitalName}
            </h4>
            <p className="text-[11px] text-[#65a1f2] font-semibold flex items-center gap-1.5 mt-1 leading-tight">
              <i className="fa-solid fa-circle-info text-[10px] shrink-0"></i>
              <span className="truncate">ต้องการการยืนยันประวัติสุขภาพเพื่อความปลอดภัย</span>
            </p>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 mb-4 space-y-1.5 sm:space-y-2">
          <div className="flex items-start gap-2 text-[10.5px] sm:text-xs text-slate-700 leading-relaxed font-medium">
            <i className="fa-solid fa-circle-check text-emerald-600 text-xs sm:text-sm shrink-0"></i>
            <span>ระบบจำเป็นต้องตรวจสอบ<strong>กรุ๊ปเลือดที่เข้ากันได้</strong>ระหว่างคุณและเคสขอรับบริจาค</span>
          </div>
          <div className="flex items-start gap-2 text-[10.5px] sm:text-xs text-slate-700 leading-relaxed font-medium">
            <i className="fa-solid fa-circle-check text-emerald-600 text-xs sm:text-sm shrink-0"></i>
            <span>ตรวจสอบ<strong>ระยะเวลาพักฟื้นครบ 90 วัน</strong>หลังการบริจาคครั้งล่าสุด</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/login"
            className="w-full py-2.5 sm:py-3.5 px-4 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>เข้าสู่ระบบเพื่อยืนยันการบริจาค</span>
            <i className="fa-solid fa-arrow-right text-[11px] sm:text-xs"></i>
          </Link>
          <Link
            href="/register"
            className="w-full py-2 sm:py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-[#0e3b6c] text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl border border-slate-200 transition text-center"
          >
            สมัครสมาชิกใหม่
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="py-0.5 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-slate-600 transition text-center"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}