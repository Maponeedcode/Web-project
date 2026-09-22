import type { ReactNode } from 'react';
import HospitalNavbar from '@/components/layout/HospitalNavbar';
import HospitalSidebar from '@/components/layout/HospitalSidebar';

export default function AdminShell({ children, userName }: { children: ReactNode; userName: string }) {
  return (
    <div className="blood-request-ui">
      <a className="skip" href="#blood-request-main">ข้ามไปยังเนื้อหา</a>
      <HospitalSidebar userName={userName} />
      <div className="workspace">
        <HospitalNavbar userName={userName} />
        <main id="blood-request-main">{children}</main>
      </div>
    </div>
  );
}
