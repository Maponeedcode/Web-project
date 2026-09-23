'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Hospital } from '@/types/database';
import { createBloodRequest, type CreateRequestState } from '@/app/(authenticated)/(admin)/blood-requests/create/actions';
import { Heading, Icon, InfoTable, SectionTitle, basePath, buttonClass, cardClass, inputClass, primaryButtonClass } from './blood-request';

const initialState: CreateRequestState = { error: null };
const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const steps = [
  'ตรวจสอบกรุ๊ปเลือด Rh และจำนวนยูนิต',
  'เลือกระดับความเร่งด่วนตามความเหมาะสม',
  'ระบุวันที่และรายละเอียดให้ชัดเจน',
  'เมื่อสร้างสำเร็จ ระบบจะเปิดหน้ารายละเอียดคำร้องใหม่',
];
const urgencyGuide = [
  { label: 'CRITICAL - ด่วนมาก', hint: 'ต้องการเลือดภายใน 24 ชั่วโมง', style: 'bg-[#ffeaed] text-[#dc2626]' },
  { label: 'HIGH - เร่งด่วน', hint: 'ต้องการเลือดภายใน 1–3 วัน', style: 'bg-[#fff4e2] text-[#d78500]' },
  { label: 'NORMAL - ปกติ', hint: 'วางแผนล่วงหน้าตั้งแต่ 3 วัน', style: 'bg-[#e5f3ff] text-[#147ee9]' },
];

export default function CreateRequest({ hospital }: { hospital: Hospital }) {
  const [state, action, pending] = useActionState(createBloodRequest, initialState);

  return <>
    <Heading title="สร้างคำร้องขอเลือด" subtitle="กรอกข้อมูลให้ครบถ้วนเพื่อประกาศคำร้องของโรงพยาบาล" />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,1fr)]">
      <form className="min-w-0 space-y-3" action={action}>
        <section className={cardClass}>
          <SectionTitle icon="hospital">ข้อมูลโรงพยาบาล / หน่วยงาน</SectionTitle>
          <InfoTable rows={ [['โรงพยาบาล', hospital.name], ['จังหวัด', hospital.province], ['ที่อยู่', hospital.address]] } />
          <p className="mt-3 text-xs text-[#6480a1]">ระบบใช้โรงพยาบาลที่ผูกกับบัญชีของคุณ ไม่สามารถเปลี่ยนโรงพยาบาลจากแบบฟอร์มนี้ได้</p>
        </section>
        <section className={cardClass}>
          <SectionTitle icon="drop">รายละเอียดคำร้องขอเลือด</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>กรุ๊ปเลือดและ Rh <em className="text-[#dc2626]">*</em></span><select className={inputClass} name="blood" required defaultValue=""><option value="" disabled>เลือกกรุ๊ปเลือด</option>{bloodTypes.map(type => <option key={type}>{type}</option>)}</select></label>
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>จำนวน (ยูนิต) <em className="text-[#dc2626]">*</em></span><input className={inputClass} type="number" name="units" min={1} max={1000} step={1} defaultValue={1} required /></label>
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>ความเร่งด่วน <em className="text-[#dc2626]">*</em></span><select className={inputClass} name="urgency" required defaultValue="NORMAL"><option value="CRITICAL">CRITICAL - ด่วนมาก</option><option value="HIGH">HIGH - เร่งด่วน</option><option value="NORMAL">NORMAL - ปกติ</option></select></label>
          </div>
          <div className="mt-4 grid gap-3">
            <label className="flex max-w-lg flex-col gap-2 text-sm font-semibold"><span>วันที่ต้องการเลือด <em className="text-[#dc2626]">*</em></span><input className={inputClass} type="date" name="target_date" required /></label>
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>รายละเอียดเคส / การรักษา <em className="text-[#dc2626]">*</em></span><textarea className={`${inputClass} min-h-28 resize-y`} name="purpose" rows={4} minLength={5} maxLength={2000} required placeholder="ระบุรายละเอียดที่จำเป็นสำหรับการประสานงาน" /></label>
          </div>
        </section>
        <section className={cardClass}><SectionTitle icon="users">ข้อมูลผู้ติดต่อของโรงพยาบาล</SectionTitle><InfoTable rows={ [['ชื่อผู้ติดต่อ', hospital.contact_person || 'ไม่ระบุ'], ['เบอร์ติดต่อ', hospital.contact_phone]] } /></section>
        {state.error && <div className="rounded-lg border border-[#f5a8b4] bg-[#ffeaed] p-3 text-sm text-[#a91427]" role="alert">{state.error}</div>}
        <div className={`${cardClass} flex flex-wrap items-center justify-between gap-2 p-3`}><Link className={buttonClass} href={basePath}>ยกเลิก</Link><button className={primaryButtonClass} type="submit" disabled={pending}><Icon name="check" />{pending ? 'กำลังสร้างคำร้อง...' : 'สร้างคำร้องขอเลือด'}</button></div>
      </form>

      <aside className="space-y-4">
        <section className={cardClass}><SectionTitle>คำแนะนำในการสร้างคำร้อง</SectionTitle><ol className="mt-5 space-y-4">{steps.map((step, index) => <li className="flex items-start gap-3 text-sm text-[#557298]" key={step}><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dce8f4] font-bold text-[#0e3b6c]">{index + 1}</span>{step}</li>)}</ol></section>
        <section className={cardClass}><SectionTitle icon="clock">ระดับความเร่งด่วน</SectionTitle><div className="space-y-2">{urgencyGuide.map(item => <div className={`flex items-center gap-3 rounded-lg p-3 ${item.style}`} key={item.label}><Icon name="drop" className="size-7" /><div><b className="text-sm">{item.label}</b><small className="block text-xs">{item.hint}</small></div></div>)}</div></section>
        <div className="flex items-center gap-4 rounded-xl bg-[#ffedf1] p-5"><span aria-hidden="true" className="text-5xl text-[#ea384c]">♥</span><div><b className="text-sm">ทุกหยดเลือด คือโอกาสให้ชีวิต</b><small className="mt-2 block text-xs">ขอบคุณที่เป็นส่วนหนึ่งในการช่วยชีวิต</small></div></div>
      </aside>
    </div>
  </>;
}
