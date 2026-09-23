import Link from 'next/link';
import type { ReactNode } from 'react';
import { bangkokToday, type BloodRequest } from '@/types/database';

export const basePath = '/blood-requests';

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
  drop: 'M12 22a8 8 0 0 0 8-8c0-4.4-8-12-8-12S4 9.6 4 14a8 8 0 0 0 8 8Z',
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
  target_date: string;
  createdAt: string;
  address: string;
  contact: string;
  phone: string;
  purpose: string;
  responseCount: number;
};

// ตรวจสอบว่าคำร้องเลยกำหนดวันหรือไม่
export function isRequestExpired(date: string, status: BloodRequest['status']) {
  return status === 'OPEN' && date < bangkokToday();
}

export function displayedRequestStatus(request: Pick<RequestView, 'date' | 'status'>): RequestView['status'] {
  return isRequestExpired(request.date, request.status) ? 'EXPIRED' : request.status;
}

export const statusLabels = {
  OPEN: 'เปิดรับบริจาค',
  IN_PROGRESS: 'กำลังดำเนินการ',
  FULFILLED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
  EXPIRED: 'สิ้นสุดระยะเวลา / หมดอายุ',
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

export function statusColor(status: RequestView['status'], isExpired: boolean = false) {
  if (isExpired) return 'orange';
  return ({ OPEN: 'blue', IN_PROGRESS: 'orange', FULFILLED: 'green', CANCELLED: 'gray', EXPIRED: 'orange' } as const)[status];
}

export const cardClass = 'rounded-xl border border-[#dce8f4] bg-white p-5 shadow-sm';
export const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#c6d6ea] bg-white px-4 py-2 text-sm font-semibold text-[#0e3b6c] transition hover:bg-[#f3f7fb] disabled:cursor-not-allowed disabled:opacity-50';
export const primaryButtonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#dc2626] bg-[#dc2626] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-50';
export const inputClass = 'min-h-11 rounded-lg border border-[#d3e1ef] bg-[#f7fafc] px-3 py-2 text-sm text-[#0e3b6c] outline-none focus:border-[#65a1f2] focus:ring-2 focus:ring-[#65a1f2]/20';

export function Icon({ name, className = 'size-5' }: { name: keyof typeof paths; className?: string }) {
  return <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

const badgeStyles = {
  red: 'bg-[#ffeaed] text-[#dc2626]',
  orange: 'bg-[#fff4e2] text-[#d78500]',
  blue: 'bg-[#e5f3ff] text-[#147ee9]',
  green: 'bg-[#e0f7eb] text-[#009c65]',
  gray: 'bg-[#edf1f6] text-[#607796]',
};

export function Badge({ children, color }: { children: ReactNode; color: keyof typeof badgeStyles }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${badgeStyles[color]}`}>{children}</span>;
}

export function Heading({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return <>
    <div className="mb-5 flex items-center gap-3 text-xs text-[#55749b] sm:text-sm">
      <Icon name="home" className="size-4" /><Link href={basePath} className="hover:underline">Blood Request</Link><span>›</span><span>{title}</span>
    </div>
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div><p className="mb-1 text-xs font-bold tracking-[0.14em] text-[#dc2626]">BLOOD REQUEST</p><h1 className="text-2xl font-semibold text-[#0e3b6c] sm:text-3xl">{title}</h1><p className="mt-1 text-sm text-[#0e3b6c]">{subtitle}</p></div>
      {children}
    </div>
  </>;
}

export function SectionTitle({ children, icon = 'file' }: { children: ReactNode; icon?: keyof typeof paths }) {
  return <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-[#0e3b6c]"><Icon name={icon} className="size-5 text-[#dc2626]" />{children}</h2>;
}

export function InfoTable({ rows }: { rows: [string, ReactNode][] }) {
  return <dl className="overflow-hidden rounded-lg border border-[#dee8f3] text-xs sm:text-sm">
    {rows.map(([label, value]) => <div key={label} className="grid grid-cols-[35%_65%] border-b border-[#dee8f3] last:border-b-0">
      <dt className="bg-[#f7fafc] px-3 py-2 font-medium">{label}</dt><dd className="min-w-0 break-words border-l border-[#dee8f3] px-3 py-2">{value}</dd>
    </div>)}
  </dl>;
}

export function StatusTimeline({ request }: { request: RequestView }) {
  const isExpired = isRequestExpired(request.date, request.status);

  let steps: { key: string; label: string; desc?: string }[] = [];

  if (request.status === 'CANCELLED') {
    steps = [
      { key: 'OPEN', label: 'เปิดรับบริจาค', desc: `สร้างเมื่อ ${formatDateTime(request.createdAt)}` },
      { key: 'CANCELLED', label: 'ยกเลิกคำร้อง', desc: 'คำร้องนี้ถูกยกเลิกแล้ว' },
    ];
  } else if (isExpired) {
    steps = [
      { key: 'OPEN', label: 'เปิดรับบริจาค', desc: `สร้างเมื่อ ${formatDateTime(request.createdAt)}` },
      { key: 'EXPIRED', label: statusLabels.EXPIRED, desc: `สิ้นสุดเมื่อ ${formatDate(request.date)}` },
    ];
  } else {
    steps = [
      { key: 'OPEN', label: 'เปิดรับบริจาค', desc: `สร้างเมื่อ ${formatDateTime(request.createdAt)}` },
      { key: 'IN_PROGRESS', label: 'กำลังดำเนินการรวบรวมโลหิต' },
      { key: 'FULFILLED', label: 'เสร็จสิ้น (ได้รับโลหิตครบแล้ว)' },
    ];
  }

  const currentStepKey = isExpired ? 'EXPIRED' : request.status;
  const currentStepIndex = steps.findIndex((s) => s.key === currentStepKey);

  return (
    <div className={cardClass}>
      <SectionTitle icon="clock">สถานะคำร้อง</SectionTitle>
      <div className="relative pl-6">
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isPassed = index <= currentStepIndex;
          const isLast = index === steps.length - 1;

          let dotClass = 'border-[#c6d6ea] bg-white';
          const lineClass = index < currentStepIndex ? 'bg-[#0e3b6c]' : 'bg-[#e2edf8]';

          if (isExpired && isCurrent) {
            dotClass = 'border-[#d78500] bg-[#d78500] ring-4 ring-[#fff4e2]';
          } else if (request.status === 'CANCELLED' && isCurrent) {
            dotClass = 'border-[#dc2626] bg-[#dc2626] ring-4 ring-[#ffeaed]';
          } else if (isPassed) {
            dotClass = 'border-[#0e3b6c] bg-[#0e3b6c]';
          }

          return (
            <div key={step.key} className="relative pb-6 last:pb-0">
              {!isLast && (
                <div className={`absolute left-[-15px] top-3 h-full w-[2px] -translate-x-1/2 transition-colors ${lineClass}`} />
              )}
              <div className={`absolute left-[-15px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 transition-all ${dotClass}`} />
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${
                  isCurrent
                    ? isExpired
                      ? 'font-semibold text-[#d78500]'
                      : request.status === 'CANCELLED'
                      ? 'font-semibold text-[#dc2626]'
                      : 'font-semibold text-[#0e3b6c]'
                    : isPassed
                    ? 'text-[#0e3b6c]'
                    : 'text-[#607796]'
                }`}>
                  {step.label}
                </span>
                {step.desc && <span className="mt-0.5 text-xs text-[#607796]">{step.desc}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
