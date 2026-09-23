'use client';

import { useActionState, useState } from 'react';
import { closeBloodRequest, type RequestActionState } from '@/app/(authenticated)/(admin)/blood-requests/[id]/actions';
import { buttonClass, primaryButtonClass } from './blood-request';

const initialState: RequestActionState = { error: null };

export default function CloseRequestButton({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(closeBloodRequest, initialState);

  return <><button className={primaryButtonClass} type="button" onClick={() => setOpen(true)}>ปิดคำร้อง</button>
    {open && <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0e3b6c]/45 p-5" role="presentation"><div className="w-full max-w-[460px] rounded-xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="close-request-title">
      <h2 className="mb-2 text-lg font-semibold text-[#0e3b6c]" id="close-request-title">ยืนยันการปิดคำร้อง</h2><p className="text-sm text-[#55749b]">คำร้องจะเปลี่ยนสถานะเป็น “ยกเลิก” และจะไม่สามารถแก้ไขต่อได้</p>
      {state.error && <div className="mt-3 rounded-lg border border-[#f5a8b4] bg-[#ffeaed] p-3 text-sm text-[#a91427]" role="alert">{state.error}</div>}
      <div className="mt-6 flex flex-wrap justify-end gap-2"><button className={buttonClass} type="button" disabled={pending} onClick={() => setOpen(false)}>กลับ</button><form action={action}><input type="hidden" name="request_id" value={requestId} /><button className={primaryButtonClass} type="submit" disabled={pending}>{pending ? 'กำลังปิดคำร้อง...' : 'ยืนยันปิดคำร้อง'}</button></form></div>
    </div></div>}
  </>;
}
