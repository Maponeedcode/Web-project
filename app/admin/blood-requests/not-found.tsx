import Link from 'next/link';
export default function NotFound() { return <section className="card"><h1>ไม่พบคำร้องนี้</h1><p>เลือกคำร้องจากรายการตัวอย่างอีกครั้ง</p><Link className="button" href="/admin/blood-requests">กลับไปหน้าจัดการคำร้อง</Link></section>; }
