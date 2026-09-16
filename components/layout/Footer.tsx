import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-slate-200 text-slate-600 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/logo_bloodConnect.svg"
                  alt="BloodConnect Logo"
                  width={44}
                  height={44}
                  className="w-10 h-10 sm:w-11 sm:h-11 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-[#0e3b6c] leading-none">
                    Blood<span className="text-[#ea384c]">Connect</span>
                  </span>
                  <span className="text-[10px] font-semibold text-[#65a1f2] tracking-wider mt-0.5 uppercase">
                    CONNECT LIVES SAVE LIVES
                  </span>
                </div>
              </Link>
              <p className="text-slate-500 leading-relaxed text-xs mt-3 pr-0 lg:pr-6">
                ศูนย์กลางที่ช่วยเชื่อมต่อผู้บริจาคกับผู้ที่กำลังต้องการเลือดในภาวะฉุกเฉิน
                ให้ทุกการช่วยเหลือเกิดขึ้นอย่างรวดเร็ว และ ปลอดภัย
                เพื่อส่งต่อความหวังและโอกาสในการรักษาให้ถึงผู้ที่ต้องการ
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-sm block mb-3">ติดตามเรา</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#ea384c] hover:border-[#65a1f2] hover:text-[#65a1f2] flex items-center justify-center transition shadow-sm"
                >
                  <i className="fa-brands fa-facebook-f text-sm"></i>
                </a>
                <a
                  href="#"
                  aria-label="LINE"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#06c755] hover:border-[#65a1f2] hover:text-[#65a1f2] flex items-center justify-center transition shadow-sm"
                >
                  <i className="fa-brands fa-line text-base"></i>
                </a>
                <a
                  href="#"
                  aria-label="X"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#65a1f2] hover:text-[#65a1f2] flex items-center justify-center transition shadow-sm"
                >
                  <i className="fa-brands fa-x-twitter text-sm"></i>
                </a>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-sm block mb-1">ติดต่อเรา</span>
              <a
                href="mailto:contact@bloodconnect.org"
                className="text-slate-700 hover:text-[#65a1f2] text-sm font-medium transition"
              >
                contact@bloodconnect.org
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4 lg:pt-0">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 sm:mb-4">บริการข้อมูล</h4>
              <ul className="space-y-2.5 text-slate-500">
                <li><a href="#requests" className="hover:text-[#65a1f2] transition">เคสขอรับโลหิตด่วน</a></li>
                <li><a href="#directory" className="hover:text-[#65a1f2] transition">ค้นหาธนาคารเลือด</a></li>
                <li><a href="#education" className="hover:text-[#65a1f2] transition">การเตรียมตัวบริจาค</a></li>
                <li><Link href="/register" className="hover:text-[#65a1f2] transition">ลงทะเบียนผู้บริจาค</Link></li>
                <li><Link href="/login" className="hover:text-[#65a1f2] transition">สำหรับเข้าสู่ระบบ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 sm:mb-4">ช่วยเหลือ</h4>
              <ul className="space-y-2.5 text-slate-500">
                <li><a href="#" className="hover:text-[#65a1f2] transition">คำถามที่พบบ่อย</a></li>
                <li><a href="tel:1664" className="hover:text-[#65a1f2] transition">สายด่วนสภากาชาด 1664</a></li>
                <li><a href="tel:1669" className="hover:text-[#65a1f2] transition">เจ็บป่วยฉุกเฉิน 1669</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center sm:text-left text-slate-400 text-xs">
          © 2026 BloodConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}