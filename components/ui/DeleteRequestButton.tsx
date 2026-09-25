'use client';

import { useActionState, useState } from 'react';
import { deleteBloodRequest, type RequestActionState } from '@/app/(authenticated)/admin/blood-requests/[id]/actions';
import { buttonClass } from './blood-request';

const initialState: RequestActionState = { error: null };

export default function DeleteRequestButton({ requestId, disabled }: { requestId: string; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteBloodRequest, initialState);

  return <>
    <button className={`${buttonClass} text-[#b42318] disabled:cursor-not-allowed disabled:opacity-50`} type="button" disabled={disabled} onClick={() => setOpen(true)}>ลบคำร้อง</button>
    {open && <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0e3b6c]/45 p-5" role="presentation">
      <div className="w-full max-w-[460px] rounded-xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-request-title">
        <h2 className="mb-2 text-lg font-semibold text-[#b42318]" id="delete-request-title">ยืนยันการลบคำร้อง</h2>
        <p className="text-sm text-[#55749b]">คำร้องนี้จะถูกลบถาวรและไม่สามารถกู้คืนได้</p>
        {state.error && <div className="mt-3 rounded-lg border border-[#f5a8b4] bg-[#ffeaed] p-3 text-sm text-[#a91427]" role="alert">{state.error}</div>}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button className={buttonClass} type="button" disabled={pending} onClick={() => setOpen(false)}>กลับ</button>
          <form action={action}><input type="hidden" name="request_id" value={requestId} /><button className="rounded-lg bg-[#b42318] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" type="submit" disabled={pending}>{pending ? 'กำลังลบคำร้อง...' : 'ยืนยันลบคำร้อง'}</button></form>
        </div>
      </div>
    </div>}
  </>;
}
