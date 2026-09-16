'use client';

import { useState } from 'react';
import { HospitalRow } from '@/types/database';

export default function HospitalDirectory({ hospitals }: { hospitals: HospitalRow[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="directory" className="py-12 sm:py-16 bg-slate-100 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#65a1f2]">Hospital Directory</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e3b6c] mt-1 mb-2">
            ค้นหาจุดรับบริจาคและธนาคารเลือด
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ค้นหาตามชื่อโรงพยาบาล เพื่อดูที่อยู่ละเอียดและโทรติดต่อคลังเลือดได้ทันที
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <i className="fa-solid fa-magnifying-glass text-slate-400 absolute left-4 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="พิมพ์ชื่อโรงพยาบาล เช่น จุฬาลงกรณ์, มหาราช, ขอนแก่น..."
              className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-white border-2 border-slate-300 rounded-2xl text-sm sm:text-base font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] shadow-sm transition"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-8 text-center bg-white rounded-2xl border border-slate-300">
            <p className="text-sm font-semibold text-slate-500">ไม่พบโรงพยาบาลที่ค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filtered.map((h) => (
              <article
                key={h.hospital_id}
                className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm hover:border-[#65a1f2] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-[#0e3b6c] leading-snug">{h.name}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-red-50 text-[#dc2626] rounded-full border border-red-200 shrink-0">
                      {h.province}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 flex items-start gap-1.5 leading-relaxed">
                    <i className="fa-solid fa-location-dot text-slate-400 mt-0.5 shrink-0 text-xs"></i>
                    <span>{h.address}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <i className="fa-solid fa-user-doctor text-slate-400 text-xs"></i>{' '}
                    {h.contact_person || 'เจ้าหน้าที่คลังเลือด'}
                  </span>
                  <a
                    href={`tel:${h.contact_phone.replace(/[^0-9]/g, '')}`}
                    className="font-bold text-[#dc2626] hover:underline flex items-center gap-1"
                  >
                    <i className="fa-solid fa-phone text-xs"></i> {h.contact_phone}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}