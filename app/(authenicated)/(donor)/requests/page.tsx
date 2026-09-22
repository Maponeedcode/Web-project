"use client";

import { useEffect, useState } from "react";

import DonorNavbar from "@/components/layout/DonorNavbar";
import DonorSideBar from "@/components/layout/DonorSideBar";
import RequestFeed from "@/components/donor/Notifications/RequestFeed";
import Footer from "@/components/layout/Footer";

import { supabase } from "@/lib/supabase";
import type { BloodRequest, Hospital } from "@/types/database";

interface DonorProfile {
  donor_id: string;
  blood_type: "A" | "B" | "AB" | "O";
  rh_factor: "Positive" | "Negative" | "+" | "-";
  province: string;
  is_ready: boolean;
}

export default function RequestsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      // ==========================================
      // 1. ตรวจสอบ User ที่ Login อยู่
      // ==========================================
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User error:", userError);
        return;
      }

      console.log("Logged in user:", user.id);

      // ==========================================
      // 2. ดึง Donor Profile ของ User คนนี้
      // ==========================================
      const { data: donorProfile, error: profileError } =
        await supabase
          .from("donor_profiles")
          .select(`
            donor_id,
            blood_type,
            rh_factor,
            province,
            is_ready
          `)
          .eq("donor_id", user.id)
          .single();

      if (profileError) {
        console.error(
          "Donor profile error:",
          profileError
        );
        return;
      }

      if (!donorProfile) {
        console.error("Donor profile not found");
        return;
      }

      console.log("Donor Profile:", donorProfile);

      // ==========================================
      // 3. ถ้า Donor ไม่พร้อมบริจาค
      // ==========================================
      if (!donorProfile.is_ready) {
        console.log(
          "Donor is currently not ready to donate."
        );

        setRequests([]);
        return;
      }

      // ==========================================
      // 4. ดึง Hospital ทั้งหมด
      // ==========================================
      const { data: hospitalData, error: hospitalError } =
        await supabase
          .from("hospitals")
          .select(`
            hospital_id,
            name,
            address,
            province,
            contact_phone,
            contact_person,
            created_at
          `);

      if (hospitalError) {
        console.error(
          "Hospital error:",
          hospitalError
        );
        return;
      }

      // ==========================================
      // 5. ดึง Blood Request ทั้งหมด
      // ==========================================
      const { data: requestData, error: requestError } =
        await supabase
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
            donation_records (
              record_id,
              volume_ml,
              status
            )
          `)
          .eq("status", "OPEN")
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
      // 6. Match Request กับ Donor Profile
      // ==========================================
      const matchedRequests: BloodRequest[] =
        (requestData ?? [])
          .filter((request) => {
            // ------------------------------
            // Match Blood Type
            // ------------------------------
            const bloodTypeMatch =
              request.blood_type ===
              donorProfile.blood_type;

            // ------------------------------
            // Match Rh Factor
            // รองรับทั้ง Positive / Negative
            // และ + / -
            // ------------------------------
            const donorRh =
              donorProfile.rh_factor === "Positive" ||
              donorProfile.rh_factor === "+"
                ? "+"
                : "-";

            const requestRh =
              request.rh_factor === "Positive" ||
              request.rh_factor === "+"
                ? "+"
                : "-";

            const rhMatch =
              donorRh === requestRh;

            // ------------------------------
            // หา Hospital ของ Request
            // ------------------------------
            const hospital = (
              hospitalData ?? []
            ).find(
              (h: Hospital) =>
                h.hospital_id === request.hospital_id
            );

            // ------------------------------
            // Match Province
            // ------------------------------
            const provinceMatch =
              hospital?.province ===
              donorProfile.province;

            return (
              bloodTypeMatch &&
              rhMatch &&
              provinceMatch
            );
          })
          .map((request) => {
            // ==================================
            // 7. จับคู่ Hospital กับ Request
            // ==================================
            const hospital = (
              hospitalData ?? []
            ).find(
              (h: Hospital) =>
                h.hospital_id === request.hospital_id
            );

            return {
              ...request,
              hospitals: hospital
                ? {
                    name: hospital.name,
                    province: hospital.province,
                  }
                : undefined,
            };
          });

      // ==========================================
      // 8. Debug
      // ==========================================
      console.log(
        "================================"
      );

      console.log(
        "Donor Blood Type:",
        donorProfile.blood_type
      );

      console.log(
        "Donor Rh:",
        donorProfile.rh_factor
      );

      console.log(
        "Donor Province:",
        donorProfile.province
      );

      console.log(
        "All Hospitals:",
        hospitalData
      );

      console.log(
        "All Blood Requests:",
        requestData
      );

      console.log(
        "Matched Requests:",
        matchedRequests
      );

      console.log(
        "Matched Request Count:",
        matchedRequests.length
      );

      console.log(
        "================================"
      );

      // ==========================================
      // 9. ส่งเฉพาะ Request ที่ Match
      // ==========================================
      setRequests(matchedRequests);
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <DonorNavbar
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar */}
      <DonorSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main */}
      <main
        className="
          min-h-screen
          pt-[116px]
          md:ml-64
          md:pt-16
        "
      >
        <div
          className="
            w-full
            px-4
            py-5
            sm:px-6
            md:px-8
            lg:px-10
          "
        >
          <div className="mx-auto w-full max-w-5xl">

            {/* Header */}
            <div className="mb-5 sm:mb-6">

              <h1
                className="
                  text-xl
                  font-bold
                  text-slate-800
                  sm:text-2xl
                "
              >
                Notifications
              </h1>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  sm:text-sm
                "
              >
                Blood requests that match your donor profile
              </p>

            </div>

            {/* Request Feed */}
            <RequestFeed
              requests={requests}
            />

            {/* Footer */}
            <Footer />

          </div>
        </div>
      </main>
    </div>
  );
}