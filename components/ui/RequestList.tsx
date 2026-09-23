'use client';

import Link from 'next/link';
import { useState } from 'react';
import UrgencyBadge from '@/components/UrgencyBadge';
import {
  type RequestView, Badge, Heading, Icon, basePath, buttonClass, cardClass,
  displayedRequestStatus, formatDate, inputClass, shortRequestId, statusColor, statusLabels, urgencyLabels,
} from './blood-request';

const pageSize = 6;
const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const tableHeaders = ['รหัสคำร้อง', 'โรงพยาบาล / หน่วยงาน', 'จังหวัด', 'กรุ๊ปเลือด', 'ระดับ', 'ยูนิต', 'วันที่ต้องการ', 'สถานะ', 'จัดการ'];

export default function RequestList({ requests }: { requests: RequestView[] }) {
  const [query, setQuery] = useState('');
  const [blood, setBlood] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  const filtered = requests.filter(request =>
    `${request.id} ${request.hospital} ${request.province}`.toLowerCase().includes(query.trim().toLowerCase()) &&
    (!blood || request.blood === blood) &&
    (!urgency || request.urgency === urgency) &&
    (!status || displayedRequestStatus(request) === status) &&
    (!date || request.date === date),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const stats = [
    { title: 'คำร้องทั้งหมด', count: requests.length, icon: 'file' as const, color: 'bg-[#ffeaed] text-[#dc2626]', hint: 'คำร้องของโรงพยาบาลนี้' },
    { title: 'เปิดรับบริจาค', count: requests.filter(r => displayedRequestStatus(r) === 'OPEN').length, icon: 'clock' as const, color: 'bg-[#fff4e2] text-[#d78500]', hint: 'รอผู้บริจาคตอบรับ' },
    { title: 'กำลังดำเนินการ', count: requests.filter(r => r.status === 'IN_PROGRESS').length, icon: 'users' as const, color: 'bg-[#e5f3ff] text-[#147ee9]', hint: 'อยู่ระหว่างดำเนินการ' },
    { title: 'เสร็จสิ้น', count: requests.filter(r => r.status === 'FULFILLED').length, icon: 'check' as const, color: 'bg-[#e0f7eb] text-[#009c65]', hint: 'ได้รับเลือดครบแล้ว' },
  ];
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value); setPage(1); };

  return <>
    <Heading title="จัดการคำร้องขอเลือด" subtitle="ตรวจสอบและติดตามสถานะคำร้องขอเลือด">
      <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#dc2626] px-5 py-2 font-semibold text-white hover:bg-[#b91c1c]" href={`${basePath}/create`}><Icon name="plus" />สร้างคำร้องขอเลือด</Link>
    </Heading>

    <section className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="ภาพรวมคำร้อง">
      {stats.map(stat => <article className={`${cardClass} flex items-center gap-3 p-4 sm:gap-5`} key={stat.title}>
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-full sm:size-16 ${stat.color}`}><Icon name={stat.icon} className="size-6 sm:size-8" /></span>
        <div><div className="text-xs sm:text-sm">{stat.title}</div><div className="my-1 text-2xl font-bold sm:text-3xl">{stat.count}</div><small className="text-xs text-[#6480a1]">{stat.hint}</small></div>
      </article>)}
    </section>

    <section className={`${cardClass} p-3`}>
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="relative min-w-full flex-1 md:min-w-60"><Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6480a1]" /><input className="min-h-11 w-full rounded-lg border border-[#d3e1ef] bg-[#f7fafc] py-2 pl-10 pr-3 text-sm outline-none focus:border-[#65a1f2]" aria-label="ค้นหาคำร้อง" placeholder="ค้นหารหัสคำร้อง โรงพยาบาล จังหวัด..." value={query} onChange={e => changeFilter(setQuery, e.target.value)} /></label>
        <select className={`${inputClass} w-auto min-w-36 flex-1 md:flex-none`} aria-label="กรุ๊ปเลือด" value={blood} onChange={e => changeFilter(setBlood, e.target.value)}><option value="">ทุกกรุ๊ปเลือด</option>{bloodTypes.map(type => <option key={type}>{type}</option>)}</select>
        <select className={`${inputClass} w-auto min-w-44 flex-1 md:flex-none`} aria-label="ความเร่งด่วน" value={urgency} onChange={e => changeFilter(setUrgency, e.target.value)}><option value="">ทุกระดับความเร่งด่วน</option>{Object.entries(urgencyLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <select className={`${inputClass} w-auto min-w-32 flex-1 md:flex-none`} aria-label="สถานะ" value={status} onChange={e => changeFilter(setStatus, e.target.value)}><option value="">ทุกสถานะ</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <input className={`${inputClass} w-auto min-w-40 flex-1 md:flex-none`} type="date" aria-label="วันที่ต้องการเลือด" value={date} onChange={e => changeFilter(setDate, e.target.value)} />
        <button className={buttonClass} type="button" onClick={() => { setQuery(''); setBlood(''); setUrgency(''); setStatus(''); setDate(''); setPage(1); }}>ล้างตัวกรอง</button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#dee8f3]">
        <table className="w-full min-w-[1050px] border-collapse text-left text-xs text-[#0e3b6c]">
          <caption className="sr-only">รายการคำร้องขอเลือด</caption>
          <thead className="bg-[#edf5fa]"><tr>{tableHeaders.map(header => <th className="px-3 py-4 font-semibold whitespace-nowrap" scope="col" key={header}>{header}</th>)}</tr></thead>
          <tbody>{rows.map(request => <tr className="border-t border-[#e4edf6]" key={request.id}>
            <td className="px-3 py-3" title={request.id}>{shortRequestId(request.id)}</td>
            <td className="px-3 py-3"><span className="flex items-center gap-3 whitespace-nowrap"><Icon name="hospital" className="size-6" /><b>{request.hospital}</b></span></td>
            <td className="px-3 py-3">{request.province}</td>
            <td className="px-3 py-3"><Badge color="red"><span className="text-lg">{request.blood}</span></Badge></td>
            <td className="px-3 py-3"><UrgencyBadge urgency={request.urgency} /></td>
            <td className="px-3 py-3">{request.units}</td>
            <td className="px-3 py-3 whitespace-nowrap">{formatDate(request.date)}</td>
            <td className="px-3 py-3"><Badge color={statusColor(displayedRequestStatus(request))}>{statusLabels[displayedRequestStatus(request)]}</Badge></td>
            <td className="px-3 py-3"><Link className="whitespace-nowrap underline underline-offset-4" aria-label={`ดูคำร้อง ${request.id}`} href={`${basePath}/${request.id}`}>ดูรายละเอียด →</Link></td>
          </tr>)}
          {!rows.length && <tr><td colSpan={9} className="px-5 py-10 text-center whitespace-normal">{requests.length ? 'ไม่พบคำร้องที่ตรงกับตัวกรอง ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง' : 'โรงพยาบาลนี้ยังไม่มีคำร้องขอเลือด'}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 px-1 pt-5 text-xs text-[#55749b] sm:flex-row sm:items-center sm:justify-between">
        <span aria-live="polite">{filtered.length ? `แสดง ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} จาก ${filtered.length} รายการ` : '0 รายการ'}</span>
        <div className="flex gap-2">
          <button className={buttonClass} type="button" aria-label="หน้าก่อนหน้า" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>
          {Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" className={currentPage === index + 1 ? 'min-w-10 rounded-lg bg-[#dc2626] px-3 text-white' : 'min-w-10 rounded-lg border border-[#dee8f3] bg-white px-3'} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>)}
          <button className={buttonClass} type="button" aria-label="หน้าถัดไป" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button>
        </div>
      </div>
    </section>
  </>;
}
