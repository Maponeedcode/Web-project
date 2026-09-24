'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { AuthUser } from '@/lib/auth';

export default function UserNavbar({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

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
          <div className="hidden sm:flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none text-[#0e3b6c]">
              Blood<span className="text-[#ea384c]">Connect</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="p-2.5 rounded-xl text-slate-500 hover:text-[#0e3b6c] hover:bg-slate-100 transition"
            aria-label="ค้นหา"
          >
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </button>

          <Link
            href="/notifications"
            className="relative p-2.5 rounded-xl text-slate-500 hover:text-[#0e3b6c] hover:bg-slate-100 transition"
            aria-label="การแจ้งเตือน"
          >
            <i className="fa-solid fa-bell text-lg"></i>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pr-2 sm:pr-3 rounded-xl hover:bg-slate-100 transition"
            >
              <span className="size-8 rounded-full bg-[#0e3b6c] text-white flex items-center justify-center">
                <i className="fa-solid fa-user text-sm"></i>
              </span>
              <i className={`fa-solid fa-chevron-down text-xs text-slate-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-bold text-[#0e3b6c] truncate">{user.full_name}</p>
                  <p className="text-xs text-slate-400 truncate">@{user.user_name}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#0e3b6c] transition"
                >
                  <i className="fa-solid fa-user w-4 text-center"></i>
                  ข้อมูลโปรไฟล์
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#dc2626] hover:bg-red-50 transition"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
