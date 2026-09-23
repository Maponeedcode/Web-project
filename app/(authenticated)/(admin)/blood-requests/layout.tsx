import type { Metadata } from 'next';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';
import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata: Metadata = { title: 'จัดการคำร้องขอเลือด | BloodConnect' };
export default async function BloodRequestLayout({ children }: { children: React.ReactNode }) {
  const user = await requireHospitalAdmin();
  return <AdminSidebar userName={user.full_name || user.user_name}>{children}</AdminSidebar>;
}
