import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { basePath, Icon } from './ui';

export default function AdminShell({ children, userName }: { children: ReactNode; userName: string }) {
  const initial = userName.trim().slice(0, 1).toUpperCase() || 'A';
  return <div className="blood-request-ui"><a className="skip" href="#blood-request-main">ข้ามไปยังเนื้อหา</a>
    <aside className="sidebar"><Link className="brand" href={basePath}><Image className="brand-drop" src="/logo_bloodConnect.svg" width={32} height={40} alt="" /><div><div className="brand-name"><span>Blood</span>Connect</div><small>Connect Lives Save Lives</small></div></Link>
      <div className="profile"><span className="avatar">{initial}<i /></span><div><strong>{userName}</strong><small>เจ้าหน้าที่โรงพยาบาล</small><small className="online">● ออนไลน์</small></div></div>
      <nav aria-label="เมนูเจ้าหน้าที่"><span className="nav-item inactive" title="ยังไม่เปิดใช้งาน"><Icon name="home" />Dashboard</span><Link className="nav-item active" href={basePath}><Icon name="file" />Blood Request</Link>{(['Notifications', 'History', 'Users', 'Hospitals', 'Reports', 'Settings'] as const).map((name) => <span key={name} className="nav-item inactive" title="ยังไม่เปิดใช้งาน"><Icon name={name === 'Hospitals' ? 'hospital' : name === 'Users' ? 'users' : name === 'Notifications' ? 'bell' : 'clock'} />{name}</span>)}</nav>
      <div className="sidebar-bottom"><div className="quote">“ทุกหยดเลือด<br />คือโอกาสให้ชีวิต”</div><p>Give Blood<br />Give Hope</p><div className="heart-art" aria-hidden="true">♥<span>♡</span></div><div className="copyright"><Image src="/logo_bloodConnect.svg" width={24} height={30} alt="" /><div><b>BloodConnect</b><small>© 2026 All rights reserved.</small></div></div></div>
    </aside><div className="workspace"><header className="topbar"><Link href="/" className="home-link">← หน้าหลัก</Link><div className="top-user"><span className="avatar small">{initial}</span><b>{userName}</b></div></header><main id="blood-request-main"><div className="demo-banner">รายการ รายละเอียด และการสร้างคำร้องเชื่อมกับ Supabase ตามโรงพยาบาลของบัญชี</div>{children}</main></div>
  </div>;
}
