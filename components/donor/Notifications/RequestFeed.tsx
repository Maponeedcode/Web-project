"use client";

import RequestFeedCard from "./RequestFeedCard";
import type { BloodRequest } from "@/types/database";

interface RequestFeedProps {
  requests: BloodRequest[];
}

const urgencyOrder = {
  CRITICAL: 1,
  HIGH: 2,
  NORMAL: 3,
};

export default function RequestFeed({
  requests,
}: RequestFeedProps) {
  // ==========================================
  // Current time
  // ==========================================
  const now = new Date();

  // ==========================================
  // Filter Requests
  // 1. หมดอายุ → ไม่แสดง
  // 2. บริจาคครบแล้ว → ไม่แสดง
  // ==========================================
  const activeRequests = requests.filter((request) => {
    // ==========================================
    // 1. Check target_date
    // ==========================================
    if (request.target_date) {
      const targetDate = new Date(request.target_date);

      if (targetDate < now) {
        return false;
      }
    }

    // ==========================================
    // 2. Calculate donated blood
    // ==========================================
    const donatedVolume =
      request.donation_records?.reduce(
        (total, donation) => {
          // นับเฉพาะ donation ที่สำเร็จ
          if (donation.status === "COMPLETED") {
            return total + (donation.volume_ml ?? 0);
          }

          return total;
        },
        0
      ) ?? 0;

    // ==========================================
    // 3. Convert units_needed → ml
    // 1 unit = 450 ml
    // ==========================================
    const requiredVolume = request.units_needed * 450;

    // ==========================================
    // 4. ถ้าเลือดครบแล้ว → ไม่แสดง
    // ==========================================
    if (donatedVolume >= requiredVolume) {
      return false;
    }

    return true;
  });

  // ==========================================
  // Sort by Urgency
  // CRITICAL → HIGH → NORMAL
  // ==========================================
  const sortedRequests = [...activeRequests].sort(
    (a, b) =>
      urgencyOrder[a.urgency_level] -
      urgencyOrder[b.urgency_level]
  );

  // ==========================================
  // No Request
  // ==========================================
  if (sortedRequests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-700">
          ยังไม่มีคำขอบริจาคเลือด
        </p>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          ขณะนี้ยังไม่มีคำขอเลือดที่ตรงกับข้อมูลของคุณ
        </p>
      </div>
    );
  }

  // ==========================================
  // Request List
  // ==========================================
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