"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  faClockRotateLeft,
  faBell,
  faRightFromBracket,
  faBars,
  faXmark,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MenuItem {
  label: string;
  href: string;
  icon: typeof faHouse;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: faHouse,
  },
  {
    label: "History",
    href: "/history",
    icon: faClockRotateLeft,
  },
  {
    label: "Notifications",
    href: "/requests",
    icon: faBell,
  },
];

interface DonorSidebarProps {
  userName?: string;
  bloodGroup?: string;
  onLogout?: () => void;
}

export default function DonorSidebar({
  userName = "Donor",
  bloodGroup = "O+",
  onLogout,
}: DonorSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ================================================= */}
      {/* MOBILE HAMBURGER */}
      {/* ================================================= */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        className="
          fixed
          left-3
          top-3
          z-[60]
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          text-slate-600
          transition
          hover:bg-slate-100
          md:hidden
        "
      >
        <FontAwesomeIcon
          icon={faBars}
          className="h-5 w-5"
        />
      </button>

      {/* ================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================= */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            z-[70]
            bg-black/30
            md:hidden
          "
        />
      )}

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[80]
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-slate-200
          bg-white
          font-noto-sans-thai
          shadow-xl
          transition-transform
          duration-300
          ease-in-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* ================================================= */}
        {/* SIDEBAR HEADER */}
        {/* ================================================= */}
        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
          "
        >
          {/* Logo */}
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3"
          >
            {/* Logo Image */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
              "
            >
              <img
                src="/logo_bloodConnect.svg"
                alt="BloodConnect"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Logo Text */}
            <div>
              <h1 className="text-base font-bold">
                <span className="text-[#0e3b6c]">
                  Blood
                </span>
                <span className="text-[#ed1b32]">
                  Connect
                </span>
              </h1>

              <p className="text-[6px] font-medium tracking-[0.4px] text-[#65a1f2]">
                CONNECT LIVES SAVE LIVES
              </p>
            </div>
          </Link>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-slate-100
              md:hidden
            "
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-5 w-5"
            />
          </button>
        </div>

        {/* ================================================= */}
        {/* MENU */}
        {/* ================================================= */}
        <nav className="flex-1 px-3 py-5">
          {/* Menu Title */}
          <p
            className="
              mb-3
              px-4
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Menu
          </p>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition-all

                    ${
                      isActive
                        ? "bg-[#eaf3ff] text-[#126fd1]"
                        : "text-slate-500 hover:bg-[#f5f9ff] hover:text-[#126fd1]"
                    }
                  `}
                >
                  {/* Icon */}
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`
                      h-4 w-4

                      ${
                        isActive
                          ? "text-[#126fd1]"
                          : "text-slate-400 group-hover:text-[#126fd1]"
                      }
                    `}
                  />

                  {/* Label */}
                  <span>{item.label}</span>

                  {/* Notification Indicator */}
                  {item.href === "/requests" && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#ed1b32]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ================================================= */}
        {/* DONOR INFO */}
        {/* ================================================= */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#126fd1]
                text-sm
                font-semibold
                text-white
              "
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-400">
                Donor • {bloodGroup}
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* LOGOUT */}
          {/* ================================================= */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-200
                px-3
                py-2.5
                text-sm
                text-slate-500
                transition
                hover:bg-slate-50
              "
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="h-4 w-4"
              />

              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}