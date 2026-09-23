'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Hospital } from '@/types/database';
import { updateBloodRequest, type RequestActionState } from '@/app/(authenticated)/(admin)/blood-requests/[id]/actions';
import { type RequestView, Heading, Icon, InfoTable, SectionTitle, basePath, buttonClass, cardClass, inputClass, primaryButtonClass } from './blood-request';

const initialState: RequestActionState = { error: null };
const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const editNotes = ['กรุ๊ปเลือดและ Rh', 'จำนวนยูนิตและความเร่งด่วน', 'วันที่ต้องการเลือด', 'รายละเอียดเคสหรือการรักษา'];

export default function EditRequest({ request, hospital }: { request: RequestView; hospital: Hospital }) {
  const [state, action, pending] = useActionState(updateBloodRequest, initialState);

  return <>
    <Heading title="แก้ไขคำร้องขอเลือด" subtitle="ตรวจสอบและปรับปรุงรายละเอียดคำร้อง" />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,1fr)]">
      <form className="min-w-0 space-y-3" action={action}>
        <input type="hidden" name="request_id" value={request.id} />
        <section className={cardClass}><SectionTitle icon="hospital">ข้อมูลโรงพยาบาล / หน่วยงาน</SectionTitle><InfoTable rows={ [['โรงพยาบาล', hospital.name], ['จังหวัด', hospital.province], ['ที่อยู่', hospital.address]] } /></section>
        <section className={cardClass}>
          <SectionTitle icon="drop">รายละเอียดคำร้องขอเลือด</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>กรุ๊ปเลือดและ Rh <em className="text-[#dc2626]">*</em></span><select className={inputClass} name="blood" required defaultValue={request.blood}>{bloodTypes.map(type => <option key={type}>{type}</option>)}</select></label>
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>จำนวน (ยูนิต) <em className="text-[#dc2626]">*</em></span><input className={inputClass} type="number" name="units" min={1} max={1000} step={1} defaultValue={request.units} required /></label>
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>ความเร่งด่วน <em className="text-[#dc2626]">*</em></span><select className={inputClass} name="urgency" required defaultValue={request.urgency}><option value="CRITICAL">CRITICAL - ด่วนมาก</option><option value="HIGH">HIGH - เร่งด่วน</option><option value="NORMAL">NORMAL - ปกติ</option></select></label>
          </div>
          <div className="mt-4 grid gap-3">
            <label className="flex max-w-lg flex-col gap-2 text-sm font-semibold"><span>วันที่ต้องการเลือด <em className="text-[#dc2626]">*</em></span><input className={inputClass} type="date" name="target_date" defaultValue={request.date} required /></label>
            <label className="flex flex-col gap-2 text-sm font-semibold"><span>รายละเอียดเคส / การรักษา <em className="text-[#dc2626]">*</em></span><textarea className={`${inputClass} min-h-28 resize-y`} name="purpose" rows={4} minLength={5} maxLength={2000} defaultValue={request.purpose} required /></label>
          </div>
        </section>
        {state.error && <div className="rounded-lg border border-[#f5a8b4] bg-[#ffeaed] p-3 text-sm text-[#a91427]" role="alert">{state.error}</div>}
        <div className={`${cardClass} flex flex-wrap items-center justify-between gap-2 p-3`}><Link className={buttonClass} href={`${basePath}/${request.id}`}>ยกเลิก</Link><button className={primaryButtonClass} type="submit" disabled={pending}><Icon name="check" />{pending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</button></div>
      </form>
      <aside className="space-y-4">
        <section className={cardClass}><SectionTitle>ข้อมูลที่แก้ไขได้</SectionTitle><ol className="mt-5 space-y-4">{editNotes.map((note, index) => <li className="flex items-start gap-3 text-sm text-[#557298]" key={note}><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dce8f4] font-bold text-[#0e3b6c]">{index + 1}</span>{note}</li>)}</ol></section>
        <div className="flex items-center gap-4 rounded-xl bg-[#ffedf1] p-5"><span aria-hidden="true" className="text-5xl text-[#ea384c]">♥</span><div><b className="text-sm">ตรวจสอบข้อมูลก่อนบันทึก</b><small className="mt-2 block text-xs">ข้อมูลโรงพยาบาลมาจากบัญชีและไม่สามารถแก้ไขในหน้านี้</small></div></div>
      </aside>
    </div>
  </>;
}
