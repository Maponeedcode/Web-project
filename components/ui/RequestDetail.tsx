import Link from 'next/link';
import UrgencyBadge from '@/components/UrgencyBadge';
import CloseRequestButton from './CloseRequestButton';
import RequestStatusStepper from './RequestStatusStepper';
import {
  type RequestView, Badge, Heading, Icon, InfoTable, SectionTitle, basePath, buttonClass,
  cardClass, formatDate, formatDateTime, primaryButtonClass, shortRequestId,
  statusColor, statusLabels,
} from './blood-request';

export default function RequestDetail({ request }: { request: RequestView }) {
  const editable = request.status === 'OPEN' || request.status === 'IN_PROGRESS';
  return <>
    <Heading title="รายละเอียดคำร้องขอเลือด" subtitle="ตรวจสอบข้อมูล ติดตามสถานะ และการตอบรับ">
      <div className="flex flex-wrap gap-2">
        <Link className={buttonClass} href={basePath}><Icon name="arrow" />กลับ</Link>
        {editable ? <Link className={buttonClass} href={`${basePath}/${request.id}/edit`}>แก้ไขคำร้อง</Link> : <button className={buttonClass} disabled>แก้ไขคำร้อง</button>}
        {editable ? <CloseRequestButton requestId={request.id} /> : <button className={primaryButtonClass} disabled>ปิดคำร้องแล้ว</button>}
      </div>
    </Heading>

    <section className={`${cardClass} mb-3 flex flex-col justify-between gap-5 xl:flex-row xl:items-center`}>
      <div className="flex items-center gap-3 sm:gap-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#ffe5ea] text-3xl font-bold text-[#dc2626] sm:size-24 sm:text-4xl">{request.blood}</span>
        <div><h2 className="mb-2 text-base font-semibold sm:text-xl" title={request.id}>คำร้องขอเลือด #{shortRequestId(request.id)}</h2><h3 className="flex items-center gap-2 text-sm sm:text-base"><Icon name="hospital" />{request.hospital}</h3><p className="mb-2 text-sm text-[#6480a1]">จ.{request.province}</p><small className="text-xs text-[#6480a1]">สร้างเมื่อ {formatDateTime(request.createdAt)}</small></div>
      </div>
      <div className="min-w-0 xl:w-1/2">
        <div className="mb-3 flex flex-wrap gap-2"><UrgencyBadge urgency={request.urgency} /><Badge color={statusColor(request.status)}>{statusLabels[request.status]}</Badge></div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#eef4f9] bg-[#f5f9fd] p-3"><Icon name="clock" /><span><small className="block text-xs text-[#6480a1]">วันที่ต้องการเลือด</small><b className="text-xs">{formatDate(request.date)}</b></span></div>
          <div className="flex items-center gap-2 rounded-lg border border-[#eef4f9] bg-[#f5f9fd] p-3"><Icon name="drop" className="size-5 shrink-0" /><span><small className="block text-xs text-[#6480a1]">จำนวนที่ต้องการ</small><b className="text-xs">{request.units} ยูนิต</b></span></div>
          <div className="flex items-center gap-2 rounded-lg border border-[#eef4f9] bg-[#f5f9fd] p-3"><Icon name="users" /><span><small className="block text-xs text-[#6480a1]">รายการบริจาคที่เกี่ยวข้อง</small><b className="text-xs">{request.responseCount} รายการ</b></span></div>
        </div>
      </div>
    </section>

    <nav className={`${cardClass} mb-3 flex flex-wrap gap-1 p-0`} aria-label="ส่วนรายละเอียด">
      <a className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm hover:border-[#dc2626] hover:text-[#dc2626]" href="#information"><Icon name="file" />รายละเอียด</a>
      <a className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm hover:border-[#dc2626] hover:text-[#dc2626]" href="#donors"><Icon name="users" />ผู้บริจาคที่ตอบรับ</a>
      <a className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm hover:border-[#dc2626] hover:text-[#dc2626]" href="#timeline"><Icon name="clock" />ขั้นตอนคำร้อง</a>
    </nav>

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <section className={`${cardClass} scroll-mt-20 self-start`} id="information"><SectionTitle>ข้อมูลคำร้อง</SectionTitle><InfoTable rows={[
        ['โรงพยาบาล / หน่วยงาน', request.hospital],
        ['จังหวัด', request.province],
        ['ที่อยู่', request.address],
        ['กรุ๊ปเลือดที่ต้องการ', <Badge key="blood" color="red">{request.blood}</Badge>],
        ['จำนวนโลหิตที่ต้องการ', `${request.units} ยูนิต`],
        ['ระดับความเร่งด่วน', <UrgencyBadge key="urgency" urgency={request.urgency} />],
        ['วันที่ต้องการเลือด', formatDate(request.date)],
        ['รายละเอียดเคส / การรักษา', request.purpose],
      ]} /></section>
      <div className="space-y-3">
        <section className={cardClass}><SectionTitle icon="hospital">สถานที่และข้อมูลติดต่อ</SectionTitle><InfoTable rows={[
          ['ที่อยู่', request.address], ['ชื่อผู้ติดต่อ', request.contact], ['เบอร์ติดต่อ', request.phone],
        ]} /></section>
        <section className={`${cardClass} scroll-mt-20`} id="timeline"><SectionTitle icon="clock">ขั้นตอนคำร้อง</SectionTitle>
          <RequestStatusStepper status={request.status} createdAt={request.createdAt} />
        </section>
        <section className={`${cardClass} scroll-mt-20`} id="donors"><SectionTitle icon="users">รายการบริจาคที่เกี่ยวข้อง</SectionTitle><strong className="ml-8 text-xl">{request.responseCount} รายการ</strong><p className="ml-8 mt-1 text-xs text-[#6480a1]">{request.responseCount ? 'พบรายการบริจาคที่เชื่อมกับคำร้องนี้' : 'ยังไม่มีรายการบริจาคที่เชื่อมกับคำร้องนี้'}</p></section>
      </div>
    </div>
  </>;
}
