'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { AuthUser } from '@/lib/auth';

const ROLE_LABELS: Record<AuthUser['role'], string> = {
  donor: 'ผู้ใช้งานทั่วไป',
  hospital_admin: 'เจ้าหน้าที่โรงพยาบาล',
  system_admin: 'ผู้ดูแลระบบ',
};

const NAV_ITEMS = [
  { href: '/profile', label: 'ข้อมูลโปรไฟล์', icon: 'fa-user' },
  { href: '/notifications', label: 'การแจ้งเตือน', icon: 'fa-bell' },
];

export default function ProfileSidebar({ user }: { user: AuthUser }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 flex items-center gap-3">
        <span className="size-12 rounded-full bg-rose-100 text-[#ea384c] flex items-center justify-center shrink-0">
          <i className="fa-solid fa-user text-lg"></i>
        </span>
        <div className="min-w-0">
          <p className="font-bold text-[#0e3b6c] truncate">{user.full_name}</p>
          <p className="text-xs text-slate-400 truncate">@{user.user_name}</p>
          <span className="inline-block mt-1 text-[11px] font-semibold text-[#65a1f2] bg-[#f3f7fb] px-2 py-0.5 rounded-full">
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      </div>

      <nav className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-5 py-3.5 text-sm font-semibold border-b border-slate-100 last:border-b-0 transition ${
                isActive
                  ? 'bg-[#f3f7fb] text-[#0e3b6c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
                {item.label}
              </span>
              <i className="fa-solid fa-chevron-right text-xs text-slate-300"></i>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-[#dc2626] hover:bg-red-50 transition"
        >
          <span className="flex items-center gap-2.5">
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
            ออกจากระบบ
          </span>
          <i className="fa-solid fa-chevron-right text-xs text-red-200"></i>
        </button>
      </nav>
    </aside>
  );
}
