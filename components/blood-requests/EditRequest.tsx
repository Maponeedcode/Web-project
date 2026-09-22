'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Hospital } from '@/types/database';
import { updateBloodRequest, type RequestActionState } from '@/app/admin/blood-requests/[id]/actions';
import type { RequestView } from './demo-data';
import { basePath, Heading, Icon, SectionTitle } from './ui';

const initialState: RequestActionState = { error: null };

export default function EditRequest({ request, hospital }: { request: RequestView; hospital: Hospital }) {
  const [state, action, pending] = useActionState(updateBloodRequest, initialState);

  return <><Heading title="แก้ไขคำร้องขอเลือด" subtitle="ตรวจสอบและปรับปรุงรายละเอียดคำร้อง" />
    <div className="create-layout"><form action={action}><input type="hidden" name="request_id" value={request.id} />
      <section className="card form-card"><SectionTitle icon="hospital">ข้อมูลโรงพยาบาล / หน่วยงาน</SectionTitle><dl className="hospital-preview"><div><dt>โรงพยาบาล</dt><dd>{hospital.name}</dd></div><div><dt>จังหวัด</dt><dd>{hospital.province}</dd></div><div><dt>ที่อยู่</dt><dd>{hospital.address}</dd></div></dl></section>
      <section className="card form-card"><SectionTitle icon="drop">รายละเอียดคำร้องขอเลือด</SectionTitle><div className="form-grid three">
        <label className="field"><span>กรุ๊ปเลือดและ Rh <em>*</em></span><select name="blood" required defaultValue={request.blood}>{['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(b => <option key={b}>{b}</option>)}</select></label>
        <label className="field"><span>จำนวน (ยูนิต) <em>*</em></span><input type="number" name="units" min={1} max={1000} step={1} defaultValue={request.units} required /></label>
        <label className="field"><span>ความเร่งด่วน <em>*</em></span><select name="urgency" required defaultValue={request.urgency}><option value="CRITICAL">CRITICAL - ด่วนมาก</option><option value="HIGH">HIGH - เร่งด่วน</option><option value="NORMAL">NORMAL - ปกติ</option></select></label>
      </div><div className="form-grid spaced"><label className="field"><span>วันที่ต้องการเลือด <em>*</em></span><input type="date" name="target_date" defaultValue={request.date} required /></label><label className="field full"><span>รายละเอียดเคส / การรักษา <em>*</em></span><textarea name="purpose" rows={4} minLength={5} maxLength={2000} defaultValue={request.purpose} required /></label></div></section>
      {state.error && <div className="form-error" role="alert">{state.error}</div>}
      <div className="card form-actions"><Link className="button" href={`${basePath}/${request.id}`}>ยกเลิก</Link><button className="button primary" type="submit" disabled={pending}><Icon name="check" />{pending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</button></div>
    </form><aside className="guidance"><section className="card"><SectionTitle>ข้อมูลที่แก้ไขได้</SectionTitle><ol className="steps"><li>กรุ๊ปเลือดและ Rh</li><li>จำนวนยูนิตและความเร่งด่วน</li><li>วันที่ต้องการเลือด</li><li>รายละเอียดเคสหรือการรักษา</li></ol></section><div className="hope"><span aria-hidden="true">♥</span><div><b>ตรวจสอบข้อมูลก่อนบันทึก</b><small>ข้อมูลโรงพยาบาลมาจากบัญชีและไม่สามารถแก้ไขในหน้านี้</small></div></div></aside></div>
  </>;
}
