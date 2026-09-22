import type { Metadata } from 'next';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';
import AdminShell from '@/components/blood-requests/AdminShell';
import './blood-requests.css';

export const metadata: Metadata = { title: 'จัดการคำร้องขอเลือด | BloodConnect' };
export default async function BloodRequestLayout({ children }: { children: React.ReactNode }) {
  const user = await requireHospitalAdmin();
  return <AdminShell userName={user.full_name || user.user_name}>{children}</AdminShell>;
}
