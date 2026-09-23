'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import DonorNavbar from '@/components/layout/DonorNavbar';
import { basePath, Icon } from '@/components/ui/blood-request';

const items = [
  { label: 'Dashboard', icon: 'home' as const },
  { label: 'Blood Request', icon: 'file' as const, href: basePath },
  { label: 'Notifications', icon: 'bell' as const },
  { label: 'History', icon: 'clock' as const },
  { label: 'Users', icon: 'users' as const },
  { label: 'Hospitals', icon: 'hospital' as const },
  { label: 'Reports', icon: 'clock' as const },
  { label: 'Settings', icon: 'clock' as const },
];

export default function AdminSidebar({ children, userName }: { children: ReactNode; userName: string }) {
  const [open, setOpen] = useState(false);
  return <div className="blood-request-ui">
    <a className="skip" href="#blood-request-main">ข้ามไปยังเนื้อหา</a>
    <div className="admin-shell-sidebar">
      {open && <button className="admin-sidebar-overlay" type="button" aria-label="ปิดเมนู" onClick={() => setOpen(false)} />}
      <aside className={`sidebar admin-sidebar${open ? ' is-open' : ''}`} aria-label="เมนูผู้ดูแล">
        <Link className="brand" href={basePath} onClick={() => setOpen(false)}>
          <Image className="brand-drop" src="/logo_bloodConnect.svg" alt="BloodConnect" width={40} height={44} priority />
          <span><b className="brand-name"><span>Blood</span>Connect</b><small>Connect Lives Save Lives</small></span>
        </Link>
        <div className="profile"><span className="avatar">{userName.slice(0, 1).toUpperCase()}<i /></span><div><strong>{userName}</strong><small>เจ้าหน้าที่โรงพยาบาล</small><small className="online">● ออนไลน์</small></div></div>
        <nav aria-label="เมนูหลัก">{items.map(item => item.href ? <Link key={item.label} className="nav-item active" href={item.href} onClick={() => setOpen(false)}><Icon name={item.icon} />{item.label}</Link> : <span key={item.label} className="nav-item inactive" aria-disabled="true"><Icon name={item.icon} />{item.label}</span>)}</nav>
        <div className="sidebar-bottom"><div className="quote">ทุกหยดเลือด<br />คือโอกาสให้ชีวิต</div><p>Give Blood<br />Give Hope</p><div className="heart-art" aria-hidden="true">♥</div><div className="copyright"><Image className="footer-logo" src="/logo_bloodConnect.svg" alt="" width={25} height={28} /><span>BloodConnect<small>© 2026 All rights reserved.</small></span></div></div>
      </aside>
    </div>
    <div className="workspace"><DonorNavbar onMenuClick={() => setOpen(true)} /><main id="blood-request-main">{children}</main></div>
  </div>;
}
