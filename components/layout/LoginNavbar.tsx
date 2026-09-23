"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  faBell,
  faBars,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SearchBar from "@/components/common/SearchBar";

interface DonorNavbarProps {
  onMenuClick?: () => void;
}

interface User {
  user_id: string;
  user_name: string;
  full_name: string;
  role: string;
}

export default function DonorNavbar({
  onMenuClick,
}: DonorNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ==================================================
  // Check Login User
  // ==================================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        console.log("LOGIN USER:", data.user);

        setUser(data.user ?? null);
      } catch (error) {
        console.error(
          "Failed to fetch user:",
          error
        );

        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // ==================================================
  // Logout
  // ==================================================
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Logout failed");
        return;
      }

      setUser(null);
      setIsProfileOpen(false);

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white">

      {/* ==================================================
          Desktop Navbar
      ================================================== */}
      <div className="hidden h-16 items-center gap-5 px-6 md:flex">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo_bloodConnect.svg"
            alt="BloodConnect"
            width={105}
            height={28}
            className="h-auto w-[105px]"
            priority
          />
        </Link>

        {/* ==================================================
            Search
        ================================================== */}
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-xl">
            <SearchBar
              placeholder="ค้นหาโรงพยาบาลหรือจังหวัด..."
            />
          </div>
        </div>

        {/* ==================================================
            Notification
        ================================================== */}
        <Link
          href="/requests"
          className="
            relative
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-600
            transition
            hover:bg-slate-100
          "
          aria-label="การแจ้งเตือน"
          title="การแจ้งเตือน"
        >
          <FontAwesomeIcon
            icon={faBell}
            className="h-5 w-5"
          />

          {pathname !== "/requests" && (
            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-[#ed1b32]
              "
            />
          )}
        </Link>

        {/* ==================================================
            Profile
        ================================================== */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() =>
              setIsProfileOpen(
                (prev) => !prev
              )
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#0E3B6C]
              text-white
              transition
              hover:bg-[#0756aa]
            "
            aria-label="โปรไฟล์"
            title={
              user?.full_name ||
              "โปรไฟล์"
            }
          >
            <FontAwesomeIcon
              icon={faUser}
              className="h-4 w-4"
            />
          </button>

          {/* ==================================================
              Desktop Profile Dropdown
          ================================================== */}
          {isProfileOpen && (
            <div
              className="
                absolute
                right-0
                top-12
                z-[60]
                w-72
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-lg
              "
            >

              {/* User Info */}
              <div
                className="
                  border-b
                  border-slate-100
                  px-4
                  py-4
                "
              >
                <div className="flex items-center gap-3">

                  {/* Avatar */}
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#0E3B6C]
                      text-white
                    "
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="h-5 w-5"
                    />
                  </div>

                  {/* User Name */}
                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-slate-800
                      "
                    >
                      {user?.full_name ||
                        "ผู้ใช้งาน"}
                    </p>

                    <p
                      className="
                        truncate
                        text-xs
                        text-slate-500
                      "
                    >
                      @{user?.user_name || "-"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Profile */}
              <div
                className="
                  border-b
                  border-slate-100
                  p-2
                "
              >
                <Link
                  href="/profile"
                  onClick={() =>
                    setIsProfileOpen(false)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-[#126fd1]
                    transition
                    hover:bg-blue-50
                  "
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-4 w-4"
                  />

                  ดูข้อมูลโปรไฟล์
                </Link>
              </div>

              {/* Logout */}
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="h-4 w-4"
                  />

                  {isLoggingOut
                    ? "กำลังออกจากระบบ..."
                    : "ออกจากระบบ"}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          Mobile Navbar
      ================================================== */}
      <div className="md:hidden">

        {/* ==================================================
            Top Row
        ================================================== */}
        <div
          className="
            flex
            h-16
            items-center
            gap-2
            px-4
          "
        >

          {/* Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
            "
            aria-label="เปิดเมนู"
            title="เปิดเมนู"
          >
            <FontAwesomeIcon
              icon={faBars}
              className="h-5 w-5"
            />
          </button>

          {/* Mobile Brand */}
          <Link
            href="/dashboard"
            className="
              flex
              min-w-0
              flex-1
              items-center
            "
          >
            <span
              className="
                text-base
                font-bold
                tracking-tight
              "
            >
              <span className="text-[#0E3B6C]">
                Blood
              </span>

              <span className="text-[#DC2626]">
                Connect
              </span>
            </span>
          </Link>

          {/* ==================================================
              Mobile Notification
          ================================================== */}
          <Link
            href="/requests"
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
            "
            aria-label="การแจ้งเตือน"
            title="การแจ้งเตือน"
          >
            <FontAwesomeIcon
              icon={faBell}
              className="h-5 w-5"
            />

            {pathname !== "/requests" && (
              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-2
                  w-2
                  rounded-full
                  bg-[#ed1b32]
                "
              />
            )}
          </Link>

          {/* ==================================================
              Mobile Profile
          ================================================== */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen(
                  (prev) => !prev
                )
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#0E3B6C]
                text-white
                transition
                hover:bg-[#0756aa]
              "
              aria-label="โปรไฟล์"
              title={
                user?.full_name ||
                "โปรไฟล์"
              }
            >
              <FontAwesomeIcon
                icon={faUser}
                className="h-4 w-4"
              />
            </button>

            {/* ==================================================
                Mobile Profile Dropdown
            ================================================== */}
            {isProfileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-[60]
                  w-72
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-lg
                "
              >

                {/* User Info */}
                <div
                  className="
                    border-b
                    border-slate-100
                    px-4
                    py-4
                  "
                >
                  <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#0E3B6C]
                        text-white
                      "
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="h-5 w-5"
                      />
                    </div>

                    {/* User Name */}
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-slate-800
                        "
                      >
                        {user?.full_name ||
                          "ผู้ใช้งาน"}
                      </p>

                      <p
                        className="
                          truncate
                          text-xs
                          text-slate-500
                        "
                      >
                        @{user?.user_name ||
                          "-"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Profile */}
                <div
                  className="
                    border-b
                    border-slate-100
                    p-2
                  "
                >
                  <Link
                    href="/profile"
                    onClick={() =>
                      setIsProfileOpen(
                        false
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-[#126fd1]
                      transition
                      hover:bg-blue-50
                    "
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="h-4 w-4"
                    />

                    ดูข้อมูลโปรไฟล์
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="h-4 w-4"
                    />

                    {isLoggingOut
                      ? "กำลังออกจากระบบ..."
                      : "ออกจากระบบ"}
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            Mobile Search
        ================================================== */}
        <div className="px-4 pb-3">
          <SearchBar
            placeholder="ค้นหาโรงพยาบาลหรือจังหวัด..."
          />
        </div>
      </div>
    </header>
  );
}