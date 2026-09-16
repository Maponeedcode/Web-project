import Link from 'next/link';

export default function DonorGuide() {
  return (
    <>
      <section id="education" className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ea384c]">Donor Guide</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e3b6c] mt-1 mb-2">
              คู่มือการเตรียมตัวบริจาคโลหิต
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              3 ขั้นตอนง่ายๆ เพื่อความปลอดภัยสูงสุดของคุณและผู้รับโลหิต
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 text-lg">
                  <i className="fa-solid fa-moon"></i>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">ขั้นตอนที่ 1</span>
                <h3 className="text-lg font-bold text-[#0e3b6c] mt-1 mb-4">ก่อนวันบริจาค</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>นอนหลับพักผ่อน</strong> ให้เต็มที่อย่างน้อย 6 ชั่วโมง</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>ดื่มน้ำสะอาด 3-4 แก้ว</strong> ล่วงหน้า ช่วยให้เลือดไหลเวียนดี</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>งดอาหารมันจัดและของทอด</strong> 6 ชั่วโมง ป้องกันเลือดลอย</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>งดเครื่องดื่มแอลกอฮอล์</strong> อย่างน้อย 24 ชั่วโมง</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-[#dc2626] font-semibold">
                * นำบัตรประจำตัวประชาชนตัวจริงมาด้วยทุกครั้ง
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center mb-5 text-lg">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#dc2626]">ขั้นตอนที่ 2</span>
                <h3 className="text-lg font-bold text-[#0e3b6c] mt-1 mb-4">ขณะรับการเจาะบริจาค</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>สวมเสื้อแขนกว้าง</strong> ที่ไม่รัดตึงบริเวณต้นแขน</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>ทำใจให้ผ่อนคลาย</strong> หายใจเข้าออกลึกๆ ไม่เกร็งตัว</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>บีบลูกยางตามจังหวะ</strong> ที่เจ้าหน้าที่แนะนำ</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>แจ้งทันที</strong> หากมีอาการหน้ามืด มึนงง หรือเจ็บผิดปกติ</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-[#dc2626] font-semibold">
                * ใช้เวลาเจาะเก็บโลหิตประมาณ 10-15 นาที
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 text-lg">
                  <i className="fa-solid fa-shield-heart"></i>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">ขั้นตอนที่ 3</span>
                <h3 className="text-lg font-bold text-[#0e3b6c] mt-1 mb-4">หลังการบริจาค</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>นั่งพัก 10-15 นาที</strong> พร้อมดื่มน้ำหวานและของว่างทันที</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>งดยกของหนัก</strong> ด้วยแขนข้างที่เจาะตลอด 24 ชั่วโมง</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>ดื่มน้ำเปล่าเพิ่มขึ้น</strong> ตลอดทั้งวัน</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>
                    <span><strong>พักฟื้น 90 วัน</strong> เพื่อความพร้อมของร่างกายในรอบต่อไป</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-[#dc2626] font-semibold">
                * การบริจาค 1 ครั้ง ช่วยเหลือได้สูงสุด 3 ชีวิต
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-auto bg-[#0e3b6c] text-white py-12 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            พร้อมเป็นส่วนหนึ่งในการช่วยชีวิตแล้วหรือยัง?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto mb-8 px-2">
            ลงทะเบียนผู้บริจาค เพื่อรับการแจ้งเตือนเฉพาะเคสฉุกเฉินที่ตรงกับกรุ๊ปเลือดของคุณ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-sm rounded-2xl shadow-lg transition text-center"
            >
              สมัครสมาชิกผู้บริจาค
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition border border-white/20 text-center"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}