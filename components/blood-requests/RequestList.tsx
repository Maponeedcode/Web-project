'use client';
import Link from 'next/link';
import { useState } from 'react';
import { type RequestView, formatDate, shortRequestId, statusLabels, urgencyLabels, statusColor, urgencyColor } from './demo-data';
import { Badge, basePath, Heading, Icon } from './ui';

export default function RequestList({ requests }: { requests: RequestView[] }) {
  const [query, setQuery] = useState('');
  const [blood, setBlood] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const filtered = requests.filter(r => `${r.id} ${r.hospital} ${r.province}`.toLowerCase().includes(query.trim().toLowerCase()) && (!blood || r.blood === blood) && (!urgency || r.urgency === urgency) && (!status || r.status === status) && (!date || r.date === date));
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const stats = [
    { title: 'คำร้องทั้งหมด', count: requests.length, color: 'red', icon: 'file' as const, hint: 'คำร้องของโรงพยาบาลนี้' },
    { title: 'เปิดรับบริจาค', count: requests.filter(r => r.status === 'OPEN').length, color: 'orange', icon: 'clock' as const, hint: 'รอผู้บริจาคตอบรับ' },
    { title: 'กำลังดำเนินการ', count: requests.filter(r => r.status === 'IN_PROGRESS').length, color: 'blue', icon: 'users' as const, hint: 'อยู่ระหว่างดำเนินการ' },
    { title: 'เสร็จสิ้น', count: requests.filter(r => r.status === 'FULFILLED').length, color: 'green', icon: 'check' as const, hint: 'ได้รับเลือดครบแล้ว' },
  ];
  return <><Heading title="จัดการคำร้องขอเลือด" subtitle="ตรวจสอบและติดตามสถานะคำร้องขอเลือด"><Link className="button primary" href={`${basePath}/create`}><Icon name="plus" />สร้างคำร้องขอเลือด</Link></Heading>
    <section className="stats" aria-label="ภาพรวมคำร้อง">{stats.map(s => <article className="stat card" key={s.title}><span className={`stat-icon ${s.color}`}><Icon name={s.icon} /></span><div><div>{s.title}</div><div className="stat-value">{s.count}</div><small>{s.hint}</small></div></article>)}</section>
    <section className="card table-card"><div className="filters"><label className="search-input"><Icon name="search" /><input aria-label="ค้นหาคำร้อง" placeholder="ค้นหารหัสคำร้อง โรงพยาบาล จังหวัด..." value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /></label>
      <select aria-label="กรุ๊ปเลือด" value={blood} onChange={e => { setBlood(e.target.value); setPage(1); }}><option value="">ทุกกรุ๊ปเลือด</option>{['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(b => <option key={b}>{b}</option>)}</select>
      <select aria-label="ความเร่งด่วน" value={urgency} onChange={e => { setUrgency(e.target.value); setPage(1); }}><option value="">ทุกระดับความเร่งด่วน</option>{Object.entries(urgencyLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      <select aria-label="สถานะ" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">ทุกสถานะ</option>{Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      <input type="date" aria-label="วันที่ต้องการเลือด" value={date} onChange={e => { setDate(e.target.value); setPage(1); }} /><button className="button" onClick={() => { setQuery(''); setBlood(''); setUrgency(''); setStatus(''); setDate(''); setPage(1); }}>ล้างตัวกรอง</button></div>
      <div className="table-scroll"><table className="request-table"><caption className="sr-only">รายการคำร้องขอเลือด</caption><thead><tr>{['รหัสคำร้อง', 'โรงพยาบาล / หน่วยงาน', 'จังหวัด', 'กรุ๊ปเลือด', 'ระดับ', 'ยูนิต', 'วันที่ต้องการ', 'สถานะ', 'จัดการ'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id}><td title={r.id}>{shortRequestId(r.id)}</td><td><span className="hospital-cell"><Icon name="hospital" /><b>{r.hospital}</b></span></td><td>{r.province}</td><td><span className="blood red">{r.blood}</span></td><td><Badge color={urgencyColor(r.urgency)}>{urgencyLabels[r.urgency]}</Badge></td><td>{r.units}</td><td>{formatDate(r.date)}</td><td><Badge color={statusColor(r.status)}>{statusLabels[r.status]}</Badge></td><td><Link className="detail-link" aria-label={`ดูคำร้อง ${r.id}`} href={`${basePath}/${r.id}`}>ดูรายละเอียด →</Link></td></tr>)}{!rows.length && <tr><td colSpan={9} className="empty-state">{requests.length ? 'ไม่พบคำร้องที่ตรงกับตัวกรอง ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง' : 'โรงพยาบาลนี้ยังไม่มีคำร้องขอเลือด'}</td></tr>}</tbody></table></div>
      <div className="pagination"><span aria-live="polite">{filtered.length ? `แสดง ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} จาก ${filtered.length} รายการ` : '0 รายการ'}</span><div><button aria-label="หน้าก่อนหน้า" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, i) => <button key={i} className={currentPage === i + 1 ? 'selected' : ''} aria-current={currentPage === i + 1 ? 'page' : undefined} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button aria-label="หน้าถัดไป" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button></div></div>
    </section></>;
}
