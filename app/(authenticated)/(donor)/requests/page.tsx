
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import DonorNavbar from "@/components/layout/LoginNavbar";
import DonorSideBar from "@/components/layout/DonorSideBar";
import RequestFeed from "@/components/donor/Notifications/RequestFeed";
import Footer from "@/components/layout/Footer";

import { supabase } from "@/lib/supabase";
import type { BloodRequest } from "@/types/database";

interface DonorProfile {
  blood_type: "A" | "B" | "AB" | "O";
  rh_factor: "Positive" | "Negative" | "+" | "-";
  province: string;
  is_ready: boolean;
}

// ==========================================
// Normalize Rh Factor
// ==========================================
const normalizeRh = (
  rh: DonorProfile["rh_factor"] | BloodRequest["rh_factor"]
) => {
  if (rh === "Positive" || rh === "+") {
    return "Positive";
  }

  if (rh === "Negative" || rh === "-") {
    return "Negative";
  }

  return null;
};

export default function DonorRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [requests, setRequests] = useState<BloodRequest[]>(
    []
  );

  const [matchedRequests, setMatchedRequests] =
    useState<BloodRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  // ==========================================
  // Search Keyword
  // ==========================================
  const searchKeyword =
    searchParams.get("search")?.trim().toLowerCase() || "";

  // ==========================================
  // 1-5. ดึงและ Match Request
  // ==========================================
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        // ==========================================
        // 1. Check Session
        // ==========================================
        const authResponse = await fetch(
          "/api/auth/check"
        );

        if (!authResponse.ok) {
          router.push("/login");
          return;
        }

        const authData = await authResponse.json();

        const userId =
          authData?.user?.user_id;

        if (!userId) {
          router.push("/login");
          return;
        }

        // ==========================================
        // 2. Donor Profile
        // ==========================================
        const {
          data: donorProfile,
          error: donorError,
        } = await supabase
          .from("donor_profiles")
          .select(`
            blood_type,
            rh_factor,
            province,
            is_ready
          `)
          .eq("donor_id", userId)
          .maybeSingle();

        if (donorError) {
          console.error(
            "Donor profile error:",
            donorError
          );
          return;
        }

        if (!donorProfile) {
          setMatchedRequests([]);
          setRequests([]);
          return;
        }

        // ==========================================
        // 3. Check Ready
        // ==========================================
        if (!donorProfile.is_ready) {
          setMatchedRequests([]);
          setRequests([]);
          return;
        }

        // ==========================================
        // 4. Blood Requests + Hospital
        // ==========================================
        const {
          data: requestData,
          error: requestError,
        } = await supabase
          .from("blood_requests")
          .select(`
            request_id,
            hospital_id,
            blood_type,
            rh_factor,
            units_needed,
            urgency_level,
            purpose,
            target_date,
            status,
            created_at,

            hospitals!inner (
              hospital_id,
              name,
              province
            ),

            donation_records (
              record_id,
              volume_ml,
              status
            )
          `)
          .eq("status", "OPEN")
          .eq(
            "blood_type",
            donorProfile.blood_type
          )
          .eq(
            "hospitals.province",
            donorProfile.province
          )
          .order("created_at", {
            ascending: false,
          });

        if (requestError) {
          console.error(
            "Blood request error:",
            requestError
          );
          return;
        }

        // ==========================================
        // 5. Match Rh
        // ==========================================
        const donorRh = normalizeRh(
          donorProfile.rh_factor
        );

        const matched = (
          requestData ?? []
        ).filter((request: any) => {
          const requestRh = normalizeRh(
            request.rh_factor
          );

          return (
            donorRh !== null &&
            donorRh === requestRh
          );
        });

        setMatchedRequests(
          matched as unknown as BloodRequest[]
        );

      } catch (err) {
        console.error(
          "Unexpected error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  // ==========================================
  // 6. Filter จาก Search
  // ==========================================
  useEffect(() => {
    if (!searchKeyword) {
      setRequests(matchedRequests);
      return;
    }

    const filtered = matchedRequests.filter(
      (request: any) => {
        const hospitalName =
          request.hospitals?.name?.toLowerCase() || "";

        const province =
          request.hospitals?.province?.toLowerCase() || "";

        return (
          hospitalName.includes(searchKeyword) ||
          province.includes(searchKeyword)
        );
      }
    );

    setRequests(filtered);
  }, [
    searchKeyword,
    matchedRequests,
  ]);

  // ==========================================
  // 7. สร้างข้อมูลให้ SearchBar
  // ==========================================
  const searchOptions = useMemo(() => {
    return matchedRequests
      .map((request: any) => ({
        name:
          request.hospitals?.name || "",
        province:
          request.hospitals?.province || "",
      }))
      .filter(
        (item, index, array) =>
          index ===
          array.findIndex(
            (other) =>
              other.name === item.name &&
              other.province ===
                item.province
          )
      );
  }, [matchedRequests]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          Navbar
      ========================================== */}
      <DonorNavbar
        onMenuClick={() =>
          setIsSidebarOpen(true)
        }
      />

      {/* ==========================================
          Sidebar
      ========================================== */}
      <DonorSideBar
        isOpen={isSidebarOpen}
        onClose={() =>
          setIsSidebarOpen(false)
        }
      />

      {/* ==========================================
          Main
      ========================================== */}
      <main className="min-h-screen pt-[116px] md:ml-64 md:pt-16">
        <div className="w-full px-4 py-5 sm:px-6 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">

            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                การแจ้งเตือน
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                คำขอบริจาคเลือดที่ตรงกับข้อมูลผู้บริจาคของคุณ
              </p>
            </div>

      

            {/* ==========================================
                Requests
            ========================================== */}
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                กำลังโหลดรายการคำขอรับบริจาคโลหิต...
              </div>
            ) : (
              <RequestFeed
                requests={requests}
              />
            )}

            {/* Footer */}
            <Footer />

          </div>
        </div>
      </main>
    </div>
  );
}
