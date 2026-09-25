import Link from 'next/link';
import { basePath, buttonClass, cardClass } from '@/components/ui/blood-request';

export default function NotFound() {
  return <section className={cardClass}><h1 className="text-xl font-semibold">ไม่พบคำร้องนี้</h1><p className="my-3 text-sm text-[#6480a1]">เลือกคำร้องจากรายการอีกครั้ง</p><Link className={buttonClass} href={basePath}>กลับไปหน้าจัดการคำร้อง</Link></section>;
}
