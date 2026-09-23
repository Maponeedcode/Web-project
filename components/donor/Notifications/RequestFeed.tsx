"use client";

import RequestFeedCard from "./RequestFeedCard";
import type { BloodRequest } from "@/types/database";

interface RequestFeedProps {
  requests: BloodRequest[];
}

export default function RequestFeed({
  requests,
}: RequestFeedProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-700">
          ยังไม่มีคำขอบริจาคเลือด
        </p>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          ขณะนี้ยังไม่มีคำขอเลือดจากโรงพยาบาล
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 gap-5">
        {requests.map((request) => (
          <RequestFeedCard
            key={request.request_id}
            request={request}
          />
        ))}
      </div>
    </section>
  );
}