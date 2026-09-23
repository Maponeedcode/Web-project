"use client";

import { useSearchParams } from "next/navigation";

import RequestFeedCard from "./RequestFeedCard";
import type { BloodRequest } from "@/types/database";

interface RequestFeedProps {
  requests: BloodRequest[];
}

export default function RequestFeed({
  requests,
}: RequestFeedProps) {
  const searchParams = useSearchParams();

  // =========================================
  // รับคำค้นจาก URL
  // =========================================
  const search =
    searchParams.get("search")?.trim().toLowerCase() || "";

  // =========================================
  // วันที่ปัจจุบัน
  // ใช้เวลาในเครื่องของผู้ใช้
  // =========================================
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // =========================================
  // 1. กรอง Request ที่หมดอายุ
  // =========================================
  const activeRequests = requests.filter((request) => {
    // ถ้าไม่มี target_date ไม่แสดง
    if (!request.target_date) {
      return false;
    }

    // =========================================
    // ตรวจสอบ Status จาก DB
    // =========================================
    if (
      request.status === "FULFILLED" ||
      request.status === "CANCELLED"
    ) {
      return false;
    }

    // =========================================
    // ตรวจสอบ target_date จาก DB
    // =========================================
    const targetDate = new Date(request.target_date);

    targetDate.setHours(0, 0, 0, 0);

    // ถ้า target_date น้อยกว่าวันปัจจุบัน = หมดอายุ
    if (targetDate < today) {
      return false;
    }

    return true;
  });

  // =========================================
  // 2. ค้นหาเฉพาะชื่อโรงพยาบาล และจังหวัด
  // =========================================
  const filteredRequests = activeRequests.filter(
    (request) => {
      if (!search) return true;

      const hospitalName =
        request.hospitals?.name?.toLowerCase() || "";

      const province =
        request.hospitals?.province?.toLowerCase() || "";

      return (
        hospitalName.includes(search) ||
        province.includes(search)
      );
    }
  );

  // =========================================
  // 3. เรียงตามความเร่งด่วน
  // =========================================
  const urgencyOrder: Record<string, number> = {
    CRITICAL: 1,
    HIGH: 2,
    NORMAL: 3,
  };

  const sortedRequests = [...filteredRequests].sort(
    (a, b) =>
      (urgencyOrder[a.urgency_level] ?? 99) -
      (urgencyOrder[b.urgency_level] ?? 99)
  );

  // =========================================
  // 4. ไม่มี Request หลังจากกรองทั้งหมด
  // =========================================
  if (sortedRequests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-700">
          ไม่พบรายการขอรับบริจาค
        </p>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          ไม่มีรายการที่ยังไม่หมดอายุหรือไม่ตรงกับคำค้นหา
        </p>
      </div>
    );
  }

  // =========================================
  // 5. แสดง Request
  // =========================================
  return (
    <section>
      <div className="grid grid-cols-1 gap-5">
        {sortedRequests.map((request) => (
          <RequestFeedCard
            key={request.request_id}
            request={request}
          />
        ))}
      </div>
    </section>
  );
}