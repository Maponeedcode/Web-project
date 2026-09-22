"use client";

import type { BloodRequest } from "@/types/database";
import BloodBadge from "@/components/BloodBadge";
import UrgencyBadge from "@/components/UrgencyBadge";

interface RequestFeedCardProps {
  request: BloodRequest;
}

export default function RequestFeedCard({
  request,
}: RequestFeedCardProps) {
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
          <div className="flex justify-between">
            <span className="text-slate-500">
              วัตถุประสงค์:
            </span>

            <span className="font-bold text-[#0e3b6c]">
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
          <div className="flex justify-between text-xs font-medium">
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

      {/* Button */}
      <button
        className="
          w-full
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
        <span>ตอบรับการบริจาคเคสนี้</span>

        <i className="fa-solid fa-arrow-right text-xs" />
      </button>
    </article>
  );
}