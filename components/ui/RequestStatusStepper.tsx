import { formatDate, formatDateTime, statusLabels, type RequestView } from './blood-request';

export default function RequestStatusStepper({ status, createdAt, date }: Pick<RequestView, 'status' | 'createdAt' | 'date'>) {
  const steps: RequestView['status'][] = status === 'CANCELLED' || status === 'EXPIRED'
    ? ['OPEN', status]
    : ['OPEN', 'IN_PROGRESS', 'FULFILLED'];
  const currentIndex = steps.indexOf(status);

  return <>
    <ol className="space-y-0" aria-label="ขั้นตอนคำร้อง">
      {steps.map((step, index) => {
        const current = index === currentIndex;
        const previous = index < currentIndex;
        return <li key={step} className="relative flex gap-3 pb-5 last:pb-0" aria-current={current ? 'step' : undefined}>
          {index < steps.length - 1 && <span className={`absolute left-[11px] top-6 h-[calc(100%-24px)] w-0.5 ${previous ? 'bg-[#147ee9]' : 'bg-[#dce8f4]'}`} aria-hidden="true" />}
          <span className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${current ? 'border-[#147ee9] bg-[#147ee9] text-white' : previous ? 'border-[#147ee9] bg-white text-[#147ee9]' : 'border-[#dce8f4] bg-white text-[#8ca1b7]'}`} aria-hidden="true">{previous ? '✓' : index + 1}</span>
          <div className="min-w-0 pt-0.5">
            <span className={`text-sm ${current ? 'font-semibold text-[#0e3b6c]' : 'text-[#6480a1]'}`}>{statusLabels[step]}</span>
            {index === 0 && <small className="block text-xs text-[#6480a1]">สร้างเมื่อ {formatDateTime(createdAt)}</small>}
            {current && status === 'EXPIRED' && <small className="block text-xs text-[#6480a1]">เลยวันที่ต้องการเลือด {formatDate(date)}</small>}
            {current && index !== 0 && <small className="block text-xs text-[#147ee9]">สถานะปัจจุบัน</small>}
          </div>
        </li>;
      })}
    </ol>
    <p className="mt-4 text-xs text-[#6480a1]">ระบบแสดงขั้นตอนจากสถานะปัจจุบัน โดยยังไม่ได้บันทึกวันเวลาที่เปลี่ยนสถานะ</p>
  </>;
}
