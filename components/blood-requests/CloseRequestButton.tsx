'use client';

import { useActionState, useState } from 'react';
import { closeBloodRequest, type RequestActionState } from '@/app/admin/blood-requests/[id]/actions';

const initialState: RequestActionState = { error: null };

export default function CloseRequestButton({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(closeBloodRequest, initialState);

  return <><button className="button primary" type="button" onClick={() => setOpen(true)}>ปิดคำร้อง</button>
    {open && <div className="modal-backdrop" role="presentation"><div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="close-request-title">
      <h2 id="close-request-title">ยืนยันการปิดคำร้อง</h2><p>คำร้องจะเปลี่ยนสถานะเป็น “ยกเลิก” และจะไม่สามารถแก้ไขต่อได้</p>
      {state.error && <div className="form-error" role="alert">{state.error}</div>}
      <div className="confirm-actions"><button className="button" type="button" disabled={pending} onClick={() => setOpen(false)}>กลับ</button><form action={action}><input type="hidden" name="request_id" value={requestId} /><button className="button primary" type="submit" disabled={pending}>{pending ? 'กำลังปิดคำร้อง...' : 'ยืนยันปิดคำร้อง'}</button></form></div>
    </div></div>}
  </>;
}
