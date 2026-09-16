export default function HeroSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0e3b6c] tracking-tight leading-[1.25] mb-4 sm:mb-6">
          เชื่อมต่อผู้พร้อมให้ <br className="hidden sm:inline" />
          สู่โอกาสใน<span className="text-[#ea384c]">การช่วยชีวิต</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-normal leading-relaxed mb-8 sm:mb-10 px-2">
          ศูนย์กลางข้อมูลที่ช่วยกระจายความต้องการโลหิตฉุกเฉินจากโรงพยาบาลโดยตรง
          <br className="hidden sm:inline" />ตรวจสอบเคสที่เปิดรับอยู่ และค้นหาจุดรับบริจาคใกล้บ้านได้ทันที
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
          <a
            href="#requests"
            className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2.5"
          >
            <i className="fa-solid fa-droplet text-base"></i>
            <span>ดูเคสต้องการเลือดด่วน</span>
          </a>
          <a
            href="#directory"
            className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-white hover:bg-slate-100 hover:border-[#65a1f2] text-[#0e3b6c] font-bold rounded-2xl border-2 border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-hospital text-base text-[#65a1f2]"></i>
            <span>ค้นหาจุดรับบริจาค</span>
          </a>
        </div>
      </div>
    </section>
  );
}