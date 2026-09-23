"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DonorNavbar from "@/components/layout/DonorNavbar";
import DonorSideBar from "@/components/layout/DonorSideBar";
import RequestFeed from "@/components/donor/Notifications/RequestFeed";
import Footer from "@/components/layout/Footer";

import type { BloodRequest } from "@/types/database";

export default function RequestsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/donor/requests", {
          credentials: "include",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "ไม่สามารถโหลดรายการคำขอได้");
        }

        setRequests((data.requests ?? []) as BloodRequest[]);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <DonorNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <DonorSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main */}
      <main className="min-h-screen pt-[116px] md:ml-64 md:pt-16">
        <div className="w-full px-4 py-5 sm:px-6 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">
            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Notifications
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Blood requests that match your donor profile
              </p>
            </div>

            {/* Request Feed */}
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                กำลังโหลดรายการคำขอรับบริจาคโลหิต...
              </div>
            ) : (
              <RequestFeed requests={requests} />
            )}

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
