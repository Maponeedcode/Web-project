'use client';

import { cardClass, primaryButtonClass } from '@/components/ui/blood-request';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className={`${cardClass} py-10 text-center`} role="alert">
    <h1 className="text-xl font-semibold">โหลดข้อมูลคำร้องไม่สำเร็จ</h1>
    <p className="my-3 text-sm text-[#6480a1]">ตรวจสอบการเชื่อมต่อ Supabase และลองอีกครั้ง</p>
    <button className={primaryButtonClass} type="button" onClick={reset}>ลองใหม่</button>
  </section>;
}
