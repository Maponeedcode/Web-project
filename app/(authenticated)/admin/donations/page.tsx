"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BloodBadge from "@/components/BloodBadge";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface DonationItem {
  record_id: string;
  donation_date: string;
  status: "ACCEPTED" | "COMPLETED" | "CANCELLED";
  volume_ml: number | null;
  consent_accepted: boolean;
  consent_document_url?: string | null;
  donor: {
    donor_id: string;
    full_name: string;
    blood_type: string;
    rh_factor: string;
    phone: string;
  };
  request: {
    request_id: string;
    purpose: string;
    urgency_level: string;
    units_needed: number;
  };
}

const getConsentFileUrl = (fileNameOrUrl?: string | null) => {
  if (!fileNameOrUrl) return null;

  const trimmed = fileNameOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://fenjrceijhbizaigvqef.supabase.co";

  const cleanPath = trimmed.replace(/^\/+/, "");

  if (cleanPath.startsWith("consent-documents/")) {
    return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
  }

  return `${supabaseUrl}/storage/v1/object/public/consent-documents/${cleanPath}`;
};

export default function AdminDonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [hospitalName, setHospitalName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [volumeMl, setVolumeMl] = useState<number>(450);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setFetchError("");
      const res = await fetch("/api/admin/donations", { credentials: "include" });

      if (res.status === 401 || res.status === 403) {
        router.replace("/login");
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("ระบบปลายทางส่งข้อมูลกลับมาไม่ถูกต้อง (ไม่ใช่ JSON)");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ไม่สามารถโหลดข้อมูลได้");
      setDonations(data.donations || []);
      setHospitalName(data.name || "");
    } catch (err) {
      console.error("Fetch donations error:", err);
      setFetchError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleOpenConfirm = (donation: DonationItem) => {
    setSelectedDonation(donation);
    setVolumeMl(450);
    setActionError("");
    setIsConfirmModalOpen(true);
  };

  const handleOpenConsent = (donation: DonationItem) => {
    setSelectedDonation(donation);
    setIsConsentModalOpen(true);
  };

  const handleConfirmCompletion = async () => {
    if (!selectedDonation || isSubmitting) return;

    setIsSubmitting(true);
    setActionError("");

    try {
      const res = await fetch(`/api/admin/donations/${selectedDonation.record_id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ volume_ml: Number(volumeMl) }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("เซิร์ฟเวอร์ไม่ได้ตอบกลับเป็น JSON");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึก");

      setIsConfirmModalOpen(false);
      setSelectedDonation(null);
      await fetchDonations();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = donations.filter((d) => d.status === "ACCEPTED").length;
  const completedCount = donations.filter((d) => d.status === "COMPLETED").length;

  return (
    <AdminSidebar userName="Admin">
      <div className="w-full space-y-6">
        {/* Header ส่วนบนสุด ดึงชื่อ รพ. จาก DB ตรงๆ */}
        <header className="rounded-3xl border border-[#dee8f3] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              {hospitalName && (
                <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-[#126fd1]">
                  <i className="fa-solid fa-hospital text-sm" />
                  <span>{hospitalName}</span>
                </div>
              )}
              <h1 className="text-2xl font-black tracking-tight text-[#0e3b6c] sm:text-3xl">
                จัดการการตอบรับและบันทึกการบริจาค
              </h1>
              <p className="text-sm text-slate-500">
                ตรวจสอบรายชื่อผู้บริจาค ใบยินยอมผู้ปกครอง และบันทึกปริมาณโลหิตเข้าสู่คลัง
              </p>
            </div>

            {/* การ์ดสถิติ */}
            <div className="flex items-center gap-3">
              <div className="min-w-[120px] rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-center">
                <span className="block text-2xl font-black text-amber-700">{pendingCount}</span>
                <span className="text-xs font-semibold text-amber-900/70">รอเข้ารับการบริจาค</span>
              </div>
              <div className="min-w-[120px] rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-center">
                <span className="block text-2xl font-black text-emerald-700">{completedCount}</span>
                <span className="text-xs font-semibold text-emerald-900/70">บริจาคสำเร็จแล้ว</span>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#dee8f3] bg-white shadow-sm">
            <div className="text-center">
              <div className="inline-block size-8 animate-spin rounded-full border-4 border-[#126fd1] border-t-transparent" />
              <p className="mt-3 text-sm font-semibold text-slate-500">กำลังโหลดรายการ...</p>
            </div>
          </div>
        ) : fetchError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-sm">
            <p className="text-base font-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <p className="mt-1 text-slate-600">{fetchError}</p>
            <button
              type="button"
              onClick={fetchDonations}
              className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : donations.length === 0 ? (
          <div className="rounded-3xl border border-[#dee8f3] bg-white p-16 text-center text-slate-500 shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <i className="fa-solid fa-inbox text-xl" />
            </div>
            <p className="mt-3 text-base font-bold text-slate-700">ไม่พบรายการตอบรับการบริจาค</p>
            <p className="mt-1 text-xs text-slate-400">เมื่อมีผู้บริจาคตอบรับคำขอ รายการจะปรากฏที่นี่</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[#dee8f3] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#dee8f3] bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-6 py-4.5">ผู้บริจาค</th>
                    <th className="whitespace-nowrap px-6 py-4.5 text-center">กรุ๊ปเลือด</th>
                    <th className="px-6 py-4.5">วัตถุประสงค์การขอ</th>
                    <th className="whitespace-nowrap px-6 py-4.5">ใบยินยอม</th>
                    <th className="whitespace-nowrap px-6 py-4.5 text-center">สถานะ</th>
                    <th className="whitespace-nowrap px-6 py-4.5 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee8f3]">
                  {donations.map((item) => {
                    const bloodLabel = `${item.donor.blood_type || ""}${
                      item.donor.rh_factor === "Positive" || item.donor.rh_factor === "+" ? "+" : "-"
                    }`;

                    return (
                      <tr key={item.record_id} className="transition-colors hover:bg-slate-50/70">
                        {/* ผู้บริจาค */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="text-base font-bold text-[#0e3b6c]">{item.donor.full_name}</p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <i className="fa-solid fa-phone text-[10px] text-slate-400" />
                            <span>{item.donor.phone || "ไม่มีเบอร์โทรศัพท์"}</span>
                          </p>
                        </td>

                        {/* กรุ๊ปเลือด */}
                        <td className="whitespace-nowrap px-6 py-5 text-center">
                          <div className="inline-flex justify-center">
                            <BloodBadge
                              bloodType={bloodLabel}
                              className="size-12 rounded-2xl text-sm shadow-sm"
                            />
                          </div>
                        </td>

                        {/* คำขอ */}
                        <td className="min-w-[240px] px-6 py-5">
                          <p className="line-clamp-1 font-semibold text-slate-800">{item.request.purpose}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                item.request.urgency_level === "CRITICAL"
                                  ? "bg-red-100 text-red-700"
                                  : item.request.urgency_level === "URGENT"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              ระดับ: {item.request.urgency_level}
                            </span>
                          </div>
                        </td>

                        {/* ใบยินยอม */}
                        <td className="whitespace-nowrap px-6 py-5">
                          {item.consent_document_url ? (
                            <button
                              type="button"
                              onClick={() => handleOpenConsent(item)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-bold text-[#126fd1] transition hover:bg-blue-100"
                            >
                              <i className="fa-solid fa-file-lines text-xs" />
                              <span>ดูใบยินยอม</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                              <i className="fa-solid fa-check text-[10px] text-emerald-600" />
                              <span>ไม่ต้องใช้ใบยินยอม</span>
                            </span>
                          )}
                        </td>

                        {/* สถานะ */}
                        <td className="whitespace-nowrap px-6 py-5 text-center">
                          {item.status === "COMPLETED" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              บริจาคสำเร็จ ({item.volume_ml ?? 450} มล.)
                            </span>
                          ) : item.status === "ACCEPTED" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                              <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
                              รอเข้ารับการบริจาค
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                              ยกเลิก
                            </span>
                          )}
                        </td>

                        {/* การจัดการ */}
                        <td className="whitespace-nowrap px-6 py-5 text-right">
                          {item.status === "ACCEPTED" ? (
                            <button
                              type="button"
                              onClick={() => handleOpenConfirm(item)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0e3b6c] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow"
                            >
                              <i className="fa-solid fa-check" />
                              <span>บันทึกการบริจาค</span>
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: ดูใบยินยอม */}
      {isConsentModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-file-contract text-lg text-[#126fd1]" />
                <h3 className="text-lg font-bold text-[#0e3b6c]">
                  เอกสารยินยอมจากผู้ปกครอง
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConsentModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p><strong>ผู้บริจาค:</strong> {selectedDonation.donor.full_name}</p>
                <p className="mt-1">
                  <strong>หมู่โลหิต:</strong> {selectedDonation.donor.blood_type}{" "}
                  {selectedDonation.donor.rh_factor}
                </p>
              </div>

              {selectedDonation.consent_document_url ? (
                <div className="pt-2">
                  <a
                    href={getConsentFileUrl(selectedDonation.consent_document_url) || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#126fd1] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0e5bb0]"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                    <span>เปิดดูเอกสารแนบ (คลิกเพื่อดูไฟล์เต็ม)</span>
                  </a>
                </div>
              ) : (
                <p className="py-3 text-center text-xs italic text-slate-400">
                  ผู้บริจาครายนี้ไม่อยู่ในเกณฑ์ที่ต้องแนบเอกสารยินยอม
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsConsentModalOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: ยืนยันการบริจาค */}
      {isConfirmModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-square-check text-lg text-emerald-600" />
              <h3 className="text-lg font-bold text-[#0e3b6c]">
                บันทึกการรับบริจาคโลหิต
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              ผู้บริจาค: <strong className="text-slate-800">{selectedDonation.donor.full_name}</strong>
            </p>

            <div className="mt-5">
              <label htmlFor="volume" className="block text-xs font-bold text-slate-700">
                ปริมาณโลหิตที่เจาะเก็บได้ (มิลลิลิตร)
              </label>
              <div className="relative mt-1.5">
                <input
                  id="volume"
                  type="number"
                  step="50"
                  value={volumeMl}
                  onChange={(e) => setVolumeMl(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#126fd1] focus:ring-2 focus:ring-blue-100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  มล. (ml)
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                * ค่ามาตรฐานทั่วไปคือ 350 หรือ 450 มิลลิลิตร
              </p>
            </div>

            {actionError && (
              <p className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs text-red-600">{actionError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmCompletion}
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {isSubmitting ? "กำลังบันทึก..." : "ยืนยันและบันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}