"use client";

import { useState } from "react";
import { BloodRequest } from "@/types/database";
import LoginPromptModal from "@/components/ui/LoginPromptModal";
import BloodBadge from "@/components/BloodBadge";
import UrgencyBadge from "@/components/UrgencyBadge";

export default function RequestBrowser({
  requests,
}: {
  requests: BloodRequest[];
}) {
  const [activeBloodFilter, setActiveBloodFilter] = useState("ALL");
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState("");
  const [currentVisibleCount, setCurrentVisibleCount] = useState(3);
  const [modalState, setModalState] = useState({
    isOpen: false,
    hospital: "",
    bloodGroup: "",
  });

  const filtered = requests.filter((req) => {
    const isNegative = req.rh_factor === "Negative" || req.rh_factor === "-"; // Strict
    const sign = isNegative ? "-" : "+";
    const fullType = `${req.blood_type}${sign}`;

    let matchBlood = false;
    if (activeBloodFilter === "ALL") {
      matchBlood = true;
    } else if (activeBloodFilter === "Rh-") {
      matchBlood = isNegative;
    } else {
      matchBlood = fullType === activeBloodFilter;
    }

    const hospitalName = req.hospitals?.name || "";
    const province = req.hospitals?.province || "";
    const matchHospital =
      hospitalName.toLowerCase().includes(hospitalSearchQuery.toLowerCase()) ||
      province.toLowerCase().includes(hospitalSearchQuery.toLowerCase());

    return matchBlood && matchHospital;
  });

  const visibleList = filtered.slice(0, currentVisibleCount);

  return (
    <section
      id="requests"
      className="py-12 sm:py-16 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ea384c] mb-1.5">
              <i className="fa-solid fa-heart-pulse text-sm"></i>
              <span>Emergency Requests</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e3b6c]">
              ประกาศขอรับบริจาคโลหิตฉุกเฉิน
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              คำร้องขอรับบริจาคโลหิตทั้งหมดที่กำลังเปิดรับความช่วยเหลือ
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-sm w-fit">
            <span className="size-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>เปิดรับบริจาค {filtered.length} เคส</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {["ALL", "O+", "A+", "B+", "AB+", "Rh-"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveBloodFilter(filter);
                  setCurrentVisibleCount(3);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeBloodFilter === filter
                    ? "bg-[#0e3b6c] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-[#65a1f2]"
                }`}
              >
                {filter === "ALL"
                  ? "ทั้งหมด"
                  : filter === "Rh-"
                    ? "หมู่เลือดหายาก (Rh-) ทั้งหมด"
                    : filter}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <i className="fa-solid fa-magnifying-glass text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs"></i>
            <input
              type="text"
              value={hospitalSearchQuery}
              onChange={(e) => {
                setHospitalSearchQuery(e.target.value);
                setCurrentVisibleCount(3);
              }}
              placeholder="ค้นหาตามชื่อโรงพยาบาล..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition"
            />
            {hospitalSearchQuery && (
              <button
                onClick={() => setHospitalSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                aria-label="ล้างคำค้นหา"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {visibleList.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200">
            <i className="fa-solid fa-droplet-slash text-3xl text-slate-300 mb-2"></i>
            <p className="text-sm font-semibold text-slate-500">
              ไม่มีเคสขอรับบริจาคสำหรับหมวดหมู่นี้ในขณะนี้
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleList.map((req) => {
              const isNegative =
                req.rh_factor === "Negative" || req.rh_factor === "-";
              const sign = isNegative ? "-" : "+";

              const pledgedUnits = (req.donation_records || []).filter(
                (rec) =>
                  rec.status === "ACCEPTED" || rec.status === "COMPLETED",
              ).length;

              const remainingUnits = req.units_needed - pledgedUnits;
              const percent = Math.min(
                100,
                Math.round((pledgedUnits / req.units_needed) * 100),
              );

              return (
                <article
                  key={req.request_id}
                  className="bg-slate-50 rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm hover:border-[#ea384c] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <UrgencyBadge urgency={req.urgency_level} />
                    </div>

                    <div className="flex items-start gap-4 mb-5">
                      <BloodBadge
                        bloodType={`${req.blood_type}${req.rh_factor === "Negative" ? "-" : "+"}`}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-2xl sm:text-3xl bg-[#0e3b6c] text-white border-0 shadow-md"
                      />
                      <div>
                        <h3 className="text-base font-bold text-[#0e3b6c] leading-snug">
                          {req.hospitals?.name || "โรงพยาบาล"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <i className="fa-solid fa-location-dot text-xs text-[#dc2626]"></i>{" "}
                          {req.hospitals?.province || "ไม่ระบุจังหวัด"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-5 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">วัตถุประสงค์:</span>
                        <span className="font-bold text-[#0e3b6c]">
                          {req.purpose}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ความต้องการ:</span>
                        <span className="font-bold text-[#ea384c]">
                          {req.units_needed} ยูนิต
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-6">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">
                          ตอบรับแล้ว {pledgedUnits}/{req.units_needed} ยูนิต
                        </span>
                        <span
                          className={
                            remainingUnits > 0
                              ? "text-[#dc2626] font-bold"
                              : "text-emerald-600 font-bold"
                          }
                        >
                          {remainingUnits > 0
                            ? `ขาดอีก ${remainingUnits} ยูนิต`
                            : "ครบจำนวนแล้ว"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#65a1f2] rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setModalState({
                        isOpen: true,
                        hospital: req.hospitals?.name || "",
                        bloodGroup: `${req.blood_type}${sign}`,
                      })
                    }
                    className="w-full py-3.5 bg-[#0e3b6c] hover:bg-[#ea384c] text-white text-sm font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2"
                  >
                    <span>ตอบรับการบริจาคเคสนี้</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {visibleList.length < filtered.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setCurrentVisibleCount((prev) => prev + 3)}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-[#0e3b6c] hover:border-[#65a1f2] border-2 border-slate-300 font-bold text-sm rounded-2xl shadow-sm transition inline-flex items-center gap-2"
            >
              <span>โหลดเพิ่มเติม</span>
              <i className="fa-solid fa-chevron-down text-xs text-[#65a1f2]"></i>
            </button>
          </div>
        )}
      </div>

      <LoginPromptModal
        isOpen={modalState.isOpen}
        hospitalName={modalState.hospital}
        bloodType={modalState.bloodGroup}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </section>
  );
}
