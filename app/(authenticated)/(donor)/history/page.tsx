"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BloodBadge from "@/components/BloodBadge";
import DonorNavbar from "@/components/layout/DonorNavbar";
import DonorSideBar from "@/components/layout/DonorSideBar";
import Footer from "@/components/layout/Footer";
import type { BloodRequest, DonationRecord } from "@/types/database";

interface HistoryUser {
  user_id: string;
  full_name: string;
}

interface DonorProfile {
  donor_id: string;
  blood_type: "A" | "B" | "AB" | "O";
  rh_factor: "Positive" | "Negative" | "+" | "-";
}

type RequestRelation =
  | (BloodRequest & {
      hospitals?: { name: string; province: string } | { name: string; province: string }[] | null;
    })
  | (BloodRequest & {
      hospitals?: { name: string; province: string } | { name: string; province: string }[] | null;
    })[]
  | null;

type DonationRecordQueryRow = DonationRecord & {
  blood_requests: RequestRelation;
};

interface DonationRecordView extends DonationRecord {
  request?: BloodRequest & { hospitals?: { name: string; province: string } };
}

const normalizeRh = (rh?: string | null) => {
  const value = rh?.trim().toUpperCase();

  if (value === "+" || value?.startsWith("POS")) return "+";
  if (value === "-" || value?.startsWith("NEG")) return "-";

  return "";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isCompleted = (status: string) =>
  ["COMPLETED", "SUCCESS", "FULFILLED"].includes(status.toUpperCase());

const getStatusPresentation = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "SUCCESS":
    case "FULFILLED":
      return {
        label: "สำเร็จ",
        icon: "fa-circle-check",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "ACCEPTED":
    case "PENDING":
      return {
        label: "กำลังดำเนินการ",
        icon: "fa-clock",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case "CANCELLED":
    case "REJECTED":
      return {
        label: "ยกเลิก",
        icon: "fa-circle-xmark",
        className: "border-slate-200 bg-slate-100 text-slate-500",
      };
    default:
      return {
        label: status || "ไม่ระบุ",
        icon: "fa-circle-info",
        className: "border-slate-200 bg-slate-100 text-slate-600",
      };
  }
};

const toDonationRecordView = (record: DonationRecordQueryRow): DonationRecordView => {
  const request = Array.isArray(record.blood_requests)
    ? record.blood_requests[0]
    : record.blood_requests;

  if (!request) return record;

  const hospital = Array.isArray(request.hospitals)
    ? request.hospitals[0]
    : request.hospitals;

  return {
    ...record,
    request: {
      ...request,
      hospitals: hospital ?? undefined,
    },
  };
};

export default function HistoryPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<HistoryUser | null>(null);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [records, setRecords] = useState<DonationRecordView[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch("/api/donor/history", { credentials: "include" });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "ไม่สามารถโหลดประวัติการบริจาคได้");
        }

        setUser(data.user as HistoryUser);
        setProfile((data.profile as DonorProfile | null) ?? null);
        setRecords(
          ((data.records ?? []) as DonationRecordQueryRow[]).map(
            toDonationRecordView,
          ),
        );
      } catch (error) {
        console.error("Unable to load donation history:", error);
        setErrorMessage("ไม่สามารถโหลดประวัติการบริจาคได้ โปรดลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [router]);

  const summary = useMemo(() => {
    const completedRecords = records.filter((record) => isCompleted(record.status));
    const totalVolume = completedRecords.reduce(
      (total, record) => total + (record.volume_ml ?? 0),
      0,
    );
    const successRate = records.length
      ? Math.round((completedRecords.length / records.length) * 100)
      : null;

    return {
      completedCount: completedRecords.length,
      totalVolume,
      livesHelped: Math.round((totalVolume / 450) * 3),
      successRate,
    };
  }, [records]);

  const bloodGroup = profile
    ? `${profile.blood_type}${normalizeRh(profile.rh_factor)}`
    : "-";

  return (
    <div className="min-h-screen bg-slate-50">
      <DonorNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <DonorSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="min-h-screen pt-[116px] md:ml-64 md:pt-16">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8 lg:px-10">
          <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-medium text-slate-500">ผลงานความดีของ {user?.full_name || "คุณ"}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-[#0e3b6c] sm:text-3xl">
                ประวัติการบริจาคโลหิต
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                สรุปการบริจาคและสถานะรายการย้อนหลังทั้งหมด
              </p>
            </div>
            <BloodBadge bloodType={bloodGroup} className="h-14 w-14 rounded-2xl text-lg sm:h-16 sm:w-16 sm:text-xl" />
          </header>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">กำลังโหลดประวัติการบริจาค...</div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{errorMessage}</div>
          ) : (
            <>
              <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard icon="fa-droplet" iconClass="bg-red-50 text-red-600" label="บริจาคสำเร็จ" value={summary.completedCount.toLocaleString("th-TH")} unit="ครั้ง" />
                <SummaryCard icon="fa-flask" iconClass="bg-blue-50 text-blue-600" label="ปริมาณโลหิตสะสม" value={summary.totalVolume.toLocaleString("th-TH")} unit="มล." />
                <SummaryCard icon="fa-users" iconClass="bg-emerald-50 text-emerald-600" label="ชีวิตที่ช่วยได้ (ประมาณ)" value={`~${summary.livesHelped.toLocaleString("th-TH")}`} unit="ชีวิต" />
                <SummaryCard icon="fa-bullseye" iconClass="bg-indigo-50 text-indigo-600" label="อัตราความสำเร็จ" value={summary.successRate === null ? "-" : `${summary.successRate}%`} unit="" />
              </section>

              <section id="donation-records" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#126fd1] shadow-sm">
                    <i className="fa-solid fa-list" />
                  </span>
                  <div>
                    <h2 className="font-extrabold text-[#0e3b6c]">บันทึกกิจกรรมย้อนหลัง</h2>
                    <p className="text-xs text-slate-500">{records.length.toLocaleString("th-TH")} รายการ</p>
                  </div>
                </div>

                {records.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#126fd1]">
                      <i className="fa-solid fa-heart-pulse" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-800">ยังไม่มีประวัติการบริจาค</h3>
                    <p className="mt-1 text-sm text-slate-500">เมื่อมีการบันทึกรายการ ข้อมูลจะแสดงในหน้านี้</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-[800px] w-full text-left text-sm">
                      <thead className="border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-semibold">วันที่บริจาค</th>
                          <th className="px-6 py-4 font-semibold">สถานที่ / โรงพยาบาล</th>
                          <th className="px-6 py-4 font-semibold">ประเภทคำร้อง</th>
                          <th className="px-6 py-4 text-center font-semibold">ปริมาณ (มล.)</th>
                          <th className="px-6 py-4 text-right font-semibold">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record) => {
                          const status = getStatusPresentation(record.status);
                          const hospital = record.request?.hospitals;

                          return (
                            <tr key={record.record_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                              <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">{formatDate(record.donation_date)}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-slate-800">{hospital?.name || "บันทึกด้วยตนเอง"}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{hospital?.province || record.notes || "ไม่ระบุสถานที่"}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${record.request_id ? "bg-blue-50 text-[#126fd1]" : "bg-slate-100 text-slate-600"}`}>
                                  <i className={`fa-solid ${record.request_id ? "fa-bolt" : "fa-pen"}`} />
                                  {record.request_id ? "ตอบรับเคสด่วน" : "บันทึกด้วยตนเอง"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center font-extrabold text-[#0e3b6c]">{record.volume_ml?.toLocaleString("th-TH") || "-"}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}>
                                  <i className={`fa-solid ${status.icon}`} />
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  unit,
}: {
  icon: string;
  iconClass: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          <i className={`fa-solid ${icon}`} />
        </span>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <strong className="text-3xl font-extrabold text-[#0e3b6c]">{value}</strong>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>
    </article>
  );
}
