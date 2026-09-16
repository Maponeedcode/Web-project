'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GuestNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex h-20 w-full items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3 select-none">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
            <Image
              src="/logo_bloodConnect.svg"
              alt="BloodConnect Logo"
              width={44}
              height={44}
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-[#0e3b6c]">
              Blood<span className="text-[#ea384c]">Connect</span>
            </span>
            <span className="text-[11px] font-semibold text-[#65a1f2] tracking-wider mt-1 uppercase">
              CONNECT LIVES SAVE LIVES
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#requests" className="hover:text-[#ea384c] transition flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#ea384c]"></span>
            เคสขอรับโลหิตฉุกเฉิน
          </a>
          <a href="#directory" className="hover:text-[#0e3b6c] transition">ค้นหาโรงพยาบาล</a>
          <a href="#education" className="hover:text-[#0e3b6c] transition">การเตรียมตัวก่อนบริจาค</a>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#0e3b6c] bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition shadow-sm"
          >
            สมัครสมาชิก
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-[#0e3b6c] hover:bg-slate-100 focus:outline-none transition"
          aria-label="Toggle Menu"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl w-6 h-6 flex items-center justify-center`}></i>
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
            <a
              href="#requests"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-slate-50 hover:text-[#ea384c] transition"
            >
              <span className="size-2 rounded-full bg-[#ea384c]"></span>
              เคสขอรับโลหิตฉุกเฉิน
            </a>
            <a
              href="#directory"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-slate-50 hover:text-[#65a1f2] transition"
            >
              <i className="fa-solid fa-hospital text-slate-400 w-4 text-center"></i>
              ค้นหาโรงพยาบาล
            </a>
            <a
              href="#education"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-slate-50 hover:text-[#65a1f2] transition"
            >
              <i className="fa-solid fa-book-medical text-slate-400 w-4 text-center"></i>
              การเตรียมตัวก่อนบริจาค
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-3 rounded-xl text-sm font-bold text-[#0e3b6c] bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-3 rounded-xl text-sm font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition shadow-sm"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}