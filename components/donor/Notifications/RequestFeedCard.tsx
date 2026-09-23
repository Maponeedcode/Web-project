"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { BloodRequest } from "@/types/database";
import BloodBadge from "@/components/BloodBadge";
import UrgencyBadge from "@/components/UrgencyBadge";

interface RequestFeedCardProps {
  request: BloodRequest;
}

export default function RequestFeedCard({
  request,
}: RequestFeedCardProps) {
  const router = useRouter();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const isNegative =
    request.rh_factor === "Negative" ||
    request.rh_factor === "-";

  const sign = isNegative ? "-" : "+";
  const bloodGroup = `${request.blood_type}${sign}`;

  const pledgedUnits = (
    request.donation_records || []
  ).filter(
    (record) =>
      record.status === "ACCEPTED" ||
      record.status === "COMPLETED"
  ).length;

  const remainingUnits =
    request.units_needed - pledgedUnits;

  const percent =
    request.units_needed > 0
      ? Math.min(
          100,
          Math.round(
            (pledgedUnits / request.units_needed) * 100
          )
        )
      : 0;

  const targetDate = request.target_date
    ? new Date(request.target_date).toLocaleDateString(
        "th-TH",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "ไม่ระบุ";

  return (
    <>
      {/* ================= CARD ================= */}
      <article
        className="
          bg-slate-50
          rounded-3xl
          p-5
          sm:p-6
          border-2
          border-slate-200
          shadow-sm
          hover:border-[#ea384c]
          transition
          flex
          flex-col
          justify-between
        "
      >
        <div>
          {/* Urgency */}
          <div className="flex items-center justify-between mb-4">
            <UrgencyBadge
              urgency={request.urgency_level}
            />
          </div>

          {/* Blood + Hospital */}
          <div className="flex items-start gap-4 mb-5">
            <BloodBadge
              bloodType={bloodGroup}
              className="
                w-14
                h-14
                sm:w-16
                sm:h-16
                rounded-2xl
                text-2xl
                sm:text-3xl
                bg-[#0e3b6c]
                text-white
                border-0
                shadow-md
              "
            />

            <div>
              <h3
                className="
                  text-base
                  font-bold
                  text-[#0e3b6c]
                  leading-snug
                "
              >
                {request.hospitals?.name ||
                  "โรงพยาบาล"}
              </h3>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                  flex
                  items-center
                  gap-1.5
                "
              >
                <i className="fa-solid fa-location-dot text-xs text-[#dc2626]" />

                {request.hospitals?.province ||
                  "ไม่ระบุจังหวัด"}
              </p>
            </div>
          </div>

          {/* Information */}
          <div
            className="
              bg-white
              rounded-2xl
              p-4
              border
              border-slate-200
              mb-5
              space-y-2
              text-xs
            "
          >
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                วัตถุประสงค์:
              </span>

              <span className="font-bold text-[#0e3b6c] text-right">
                {request.purpose || "ไม่ระบุ"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                ความต้องการ:
              </span>

              <span className="font-bold text-[#ea384c]">
                {request.units_needed} ยูนิต
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                ต้องการภายใน:
              </span>

              <span className="font-bold text-[#0e3b6c]">
                {targetDate}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5 mb-6">
            <div className="flex justify-between text-xs font-medium gap-3">
              <span className="text-slate-500">
                ตอบรับแล้ว {pledgedUnits}/
                {request.units_needed} ยูนิต
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
                className="
                  h-full
                  bg-[#65a1f2]
                  rounded-full
                "
                style={{
                  width: `${percent}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex gap-3">
          {/* View Detail */}
          <button
            type="button"
            onClick={() => setIsDetailOpen(true)}
            className="
              flex-1
              py-3.5
              bg-white
              border
              border-[#0e3b6c]
              text-[#0e3b6c]
              hover:bg-[#0e3b6c]
              hover:text-white
              text-sm
              font-bold
              rounded-xl
              transition
              duration-150
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <i className="fa-solid fa-circle-info text-xs" />

            <span>ดูรายละเอียด</span>
          </button>

          {/* Donate */}
          <button
            type="button"
            onClick={() => setIsDonateOpen(true)}
            className="
              flex-1
              py-3.5
              bg-[#0e3b6c]
              hover:bg-[#ea384c]
              text-white
              text-sm
              font-bold
              rounded-xl
              transition
              duration-150
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <span>ตอบรับเคสนี้</span>

            <i className="fa-solid fa-arrow-right text-xs" />
          </button>
        </div>
      </article>

      {/* ================================================== */}
      {/* DETAIL MODAL */}
      {/* ================================================== */}
      {isDetailOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-900/50
            backdrop-blur-sm
            p-4
          "
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            className="
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              rounded-3xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#0e3b6c]">
                  รายละเอียดคำขอบริจาค
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  ข้อมูลคำขอจากโรงพยาบาล
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-500
                  hover:bg-slate-200
                  transition
                "
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Hospital */}
            <div className="flex items-center gap-4 mb-6">
              <BloodBadge
                bloodType={bloodGroup}
                className="
                  w-16
                  h-16
                  shrink-0
                  rounded-2xl
                  text-2xl
                  bg-[#0e3b6c]
                  text-white
                  border-0
                  shadow-md
                "
              />

              <div>
                <h3 className="font-bold text-[#0e3b6c]">
                  {request.hospitals?.name ||
                    "โรงพยาบาล"}
                </h3>

                <p className="text-sm text-slate-500">
                  {request.hospitals?.province ||
                    "ไม่ระบุจังหวัด"}
                </p>
              </div>
            </div>

            {/* Detail Information */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4 border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  ระดับความเร่งด่วน
                </span>

                <UrgencyBadge
                  urgency={request.urgency_level}
                />
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  กรุ๊ปเลือด
                </span>

                <span className="font-bold text-[#0e3b6c]">
                  {bloodGroup}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  จำนวนที่ต้องการ
                </span>

                <span className="font-bold text-[#ea384c]">
                  {request.units_needed} ยูนิต
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  ตอบรับแล้ว
                </span>

                <span className="font-bold text-[#0e3b6c]">
                  {pledgedUnits} ยูนิต
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  ยังขาด
                </span>

                <span className="font-bold text-[#dc2626]">
                  {Math.max(remainingUnits, 0)} ยูนิต
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  วัตถุประสงค์
                </span>

                <span className="font-bold text-[#0e3b6c] text-right">
                  {request.purpose || "ไม่ระบุ"}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  ต้องการภายใน
                </span>

                <span className="font-bold text-[#0e3b6c]">
                  {targetDate}
                </span>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              className="
                mt-6
                w-full
                rounded-xl
                bg-[#0e3b6c]
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#ea384c]
              "
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* DONATE CONFIRMATION MODAL */}
      {/* ================================================== */}
      {isDonateOpen && (
        <div
          className="
            fixed
            inset-0
            z-[110]
            flex
            items-center
            justify-center
            bg-slate-900/50
            backdrop-blur-sm
            p-4
          "
          onClick={() => setIsDonateOpen(false)}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                  text-[#ea384c]
                "
              >
                <i className="fa-solid fa-hand-holding-droplet text-2xl" />
              </div>

              <h2 className="text-lg font-bold text-[#0e3b6c]">
                ยืนยันการตอบรับเคส
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                คุณต้องการตอบรับการบริจาคเลือดให้กับ
              </p>

              <p className="mt-1 font-bold text-[#0e3b6c]">
                {request.hospitals?.name ||
                  "โรงพยาบาล"}
              </p>
            </div>

            {/* Case Information */}
            <div
              className="
                mt-5
                rounded-2xl
                bg-slate-50
                p-4
              "
            >
              <div className="flex items-center justify-center gap-3">
                <BloodBadge
                  bloodType={bloodGroup}
                  className="
                    w-12
                    h-12
                    shrink-0
                    rounded-xl
                    text-xl
                    bg-[#0e3b6c]
                    text-white
                    border-0
                    shadow-sm
                  "
                />

                <div className="text-left">
                  <p className="font-bold text-[#0e3b6c]">
                    กรุ๊ปเลือด {bloodGroup}
                  </p>

                  <p className="text-xs text-slate-500">
                    ต้องการ {request.units_needed} ยูนิต
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={() => setIsDonateOpen(false)}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  py-3
                  text-sm
                  font-bold
                  text-slate-600
                  hover:bg-slate-50
                  transition
                "
              >
                ยกเลิก
              </button>

              {/* Confirm */}
              <button
                type="button"
                onClick={() => {
                  setIsDonateOpen(false);
                  router.push("/dashboard");
                }}
                className="
                  flex-1
                  rounded-xl
                  bg-[#0e3b6c]
                  py-3
                  text-sm
                  font-bold
                  text-white
                  hover:bg-[#ea384c]
                  transition
                "
              >
                ยืนยันการบริจาค
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}