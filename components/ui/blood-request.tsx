import Link from 'next/link';
import type { ReactNode } from 'react';
import type { BloodRequest } from '@/types/database';

export const basePath = '/admin/blood-requests';

const paths = {
  home: 'm3 10 9-7 9 7v10H5V10m4 10v-7h6v7',
  file: 'M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 6v6l4 3',
  users: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6M3 21v-4a6 6 0 0 1 12 0v4M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5',
  hospital: 'M6 21V5h12v16M3 21h18M10 21v-5h4v5M12 7v6m-3-3h6',
  plus: 'M12 3v18M3 12h18',
  check: 'm5 12 5 5L20 7',
  search: 'M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12m5 11 6 6',
  arrow: 'M20 12H4m6-6-6 6 6 6',
  drop: 'M12 2S4 11 4 16a8 8 0 0 0 16 0c0-5-8-14-8-14Z',
  bell: 'M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zM10 21h4',
} as const;

export type RequestView = {
  id: string;
  hospitalId: string;
  hospital: string;
  province: string;
  blood: string;
  units: number;
  urgency: BloodRequest['urgency_level'];
  status: BloodRequest['status'];
  date: string;
  createdAt: string;
  address: string;
  contact: string;
  phone: string;
  purpose: string;
  responseCount: number;
};

export const statusLabels = {
  OPEN: 'เปิดรับบริจาค',
  IN_PROGRESS: 'กำลังดำเนินการ',
  FULFILLED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
};
export const urgencyLabels = { CRITICAL: 'ด่วนมาก', HIGH: 'เร่งด่วน', NORMAL: 'ปกติ' };

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
export function shortRequestId(value: string) { return value.slice(0, 8).toUpperCase(); }
export function statusColor(status: RequestView['status']) {
  return ({ OPEN: 'blue', IN_PROGRESS: 'orange', FULFILLED: 'green', CANCELLED: 'gray' })[status];
}
export function urgencyColor(urgency: RequestView['urgency']) {
  return ({ CRITICAL: 'red', HIGH: 'orange', NORMAL: 'gray' })[urgency];
}

export function Icon({ name }: { name: keyof typeof paths }) {
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
export function Badge({ children, color }: { children: ReactNode; color: string }) {
  return <span className={`badge ${color}`}>{children}</span>;
}
export function Heading({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return <><div className="breadcrumb"><Icon name="home" /><Link href={basePath}>Blood Request</Link><span>›</span><span>{title}</span></div><div className="page-heading"><div><div className="eyebrow">BLOOD REQUEST</div><h1>{title}</h1><p>{subtitle}</p></div>{children}</div></>;
}
export function SectionTitle({ children, icon = 'file' }: { children: ReactNode; icon?: keyof typeof paths }) {
  return <h2><Icon name={icon} />{children}</h2>;
}
