'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Hospital } from '@/types/database';
import { createBloodRequest, type CreateRequestState } from '@/app/(authenticated)/admin/blood-requests/create/actions';
import { basePath, Heading, Icon, SectionTitle } from './blood-request';

const initialState: CreateRequestState = { error: null };

export default function CreateRequest({ hospital }: { hospital: Hospital }) {
  const [state, action, pending] = useActionState(createBloodRequest, initialState);

  return <><Heading title="สร้างคำร้องขอเลือด" subtitle="กรอกข้อมูลให้ครบถ้วนเพื่อประกาศคำร้องของโรงพยาบาล" />
    <div className="create-layout"><form action={action}><section className="card form-card"><SectionTitle icon="hospital">ข้อมูลโรงพยาบาล / หน่วยงาน</SectionTitle>
      <dl className="hospital-preview"><div><dt>โรงพยาบาล</dt><dd>{hospital.name}</dd></div><div><dt>จังหวัด</dt><dd>{hospital.province}</dd></div><div><dt>ที่อยู่</dt><dd>{hospital.address}</dd></div></dl>
      <p className="form-hint">ระบบใช้โรงพยาบาลที่ผูกกับบัญชีของคุณ ไม่สามารถเปลี่ยนโรงพยาบาลจากแบบฟอร์มนี้ได้</p>
    </section><section className="card form-card"><SectionTitle icon="drop">รายละเอียดคำร้องขอเลือด</SectionTitle><div className="form-grid three">
      <label className="field"><span>กรุ๊ปเลือดและ Rh <em>*</em></span><select name="blood" required defaultValue=""><option value="" disabled>เลือกกรุ๊ปเลือด</option>{['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(b => <option key={b}>{b}</option>)}</select></label>
      <label className="field"><span>จำนวน (ยูนิต) <em>*</em></span><input type="number" name="units" min={1} max={1000} step={1} defaultValue={1} required /></label>
      <label className="field"><span>ความเร่งด่วน <em>*</em></span><select name="urgency" required defaultValue="NORMAL"><option value="CRITICAL">CRITICAL - ด่วนมาก</option><option value="HIGH">HIGH - เร่งด่วน</option><option value="NORMAL">NORMAL - ปกติ</option></select></label>
    </div><div className="form-grid spaced"><label className="field"><span>วันที่ต้องการเลือด <em>*</em></span><input type="date" name="target_date" required /></label><label className="field full"><span>รายละเอียดเคส / การรักษา <em>*</em></span><textarea name="purpose" rows={4} minLength={5} maxLength={2000} required placeholder="ระบุรายละเอียดที่จำเป็นสำหรับการประสานงาน" /></label></div></section>
    <section className="card form-card"><SectionTitle icon="users">ข้อมูลผู้ติดต่อของโรงพยาบาล</SectionTitle><dl className="hospital-preview"><div><dt>ชื่อผู้ติดต่อ</dt><dd>{hospital.contact_person || 'ไม่ระบุ'}</dd></div><div><dt>เบอร์ติดต่อ</dt><dd>{hospital.contact_phone}</dd></div></dl></section>
    {state.error && <div className="form-error" role="alert">{state.error}</div>}
    <div className="card form-actions"><Link className="button" href={basePath}>ยกเลิก</Link><button className="button primary" type="submit" disabled={pending}><Icon name="check" />{pending ? 'กำลังสร้างคำร้อง...' : 'สร้างคำร้องขอเลือด'}</button></div>
    </form><aside className="guidance"><section className="card"><SectionTitle>คำแนะนำในการสร้างคำร้อง</SectionTitle><ol className="steps"><li>ตรวจสอบกรุ๊ปเลือด Rh และจำนวนยูนิต</li><li>เลือกระดับความเร่งด่วนตามความเหมาะสม</li><li>ระบุวันที่และรายละเอียดให้ชัดเจน</li><li>เมื่อสร้างสำเร็จ ระบบจะเปิดหน้ารายละเอียดคำร้องใหม่</li></ol></section><section className="card"><SectionTitle icon="clock">ระดับความเร่งด่วน</SectionTitle>{[['red', 'CRITICAL - ด่วนมาก', 'ต้องการเลือดภายใน 24 ชั่วโมง'], ['orange', 'HIGH - เร่งด่วน', 'ต้องการเลือดภายใน 1–3 วัน'], ['blue', 'NORMAL - ปกติ', 'วางแผนล่วงหน้าตั้งแต่ 3 วัน']].map(([color, title, description]) => <div className={`urgency ${color}`} key={title}><Icon name="drop" /><div><b>{title}</b><small>{description}</small></div></div>)}</section><div className="hope"><span aria-hidden="true">♥</span><div><b>ทุกหยดเลือด คือโอกาสให้ชีวิต</b><small>ขอบคุณที่เป็นส่วนหนึ่งในการช่วยชีวิต</small></div></div></aside></div>
  </>;
}
