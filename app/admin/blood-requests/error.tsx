'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="card empty-state" role="alert">
    <h1>โหลดข้อมูลคำร้องไม่สำเร็จ</h1>
    <p>ตรวจสอบการเชื่อมต่อ Supabase และลองอีกครั้ง</p>
    <button className="button primary" type="button" onClick={reset}>ลองใหม่</button>
  </section>;
}
