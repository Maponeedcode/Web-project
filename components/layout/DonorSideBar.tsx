"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  faClockRotateLeft,
  faBell,
  faRightFromBracket,
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
  isOpen: boolean;
  onClose: () => void;
}

export default function DonorSideBar({
  isOpen,
  onClose,
}: DonorSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[55]
            bg-slate-900/30
            backdrop-blur-[1px]
            md:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[60]
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          ease-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* =========================
            Logo
        ========================= */}
        <div
          className="
            flex
            h-20
            shrink-0
            items-center
            border-b
            border-slate-100
            px-6
          "
        >
          <Link
            href="/dashboard"
            onClick={onClose}
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* Your Logo */}
            <Image
              src="/logo_bloodConnect.svg"
              alt="BloodConnect Logo"
              width={42}
              height={42}
              priority
              className="
                h-10
                w-10
                shrink-0
                object-contain
              "
            />

            {/* Brand */}
            <div>
              <div
                className="
                  text-[18px]
                  font-bold
                  leading-tight
                  tracking-tight
                "
              >
                <span className="text-[#0E3B6C]">
                  Blood
                </span>

                <span className="text-[#DC2626]">
                  Connect
                </span>
              </div>

              <div
                className="
                  mt-0.5
                  text-[8px]
                  font-semibold
                  tracking-[0.13em]
                  text-[#65a1f2]
                "
              >
                CONNECT LIVES SAVE LIVES
              </div>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              ml-auto
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              md:hidden
            "
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-4 w-4"
            />
          </button>
        </div>

        {/* =========================
            Navigation
        ========================= */}
        <nav className="flex-1 px-4 py-7">
          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-slate-400
            "
          >
            MENU
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-[14px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-[#126fd1]/10
                          text-[#126fd1]
                        `
                        : `
                          text-slate-500
                          hover:bg-slate-50
                          hover:text-[#126fd1]
                        `
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-6
                        w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-[#126fd1]
                      "
                    />
                  )}

                  {/* Icon */}
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`
                      h-[17px]
                      w-[17px]
                      transition

                      ${
                        isActive
                          ? "text-[#126fd1]"
                          : "text-slate-400 group-hover:text-[#126fd1]"
                      }
                    `}
                  />

                  {/* Label */}
                  <span>{item.label}</span>

                  {/* Notification dot */}
                  {item.href === "/requests" && (
                    <span
                      className="
                        ml-auto
                        h-2
                        w-2
                        rounded-full
                        bg-[#ed1b32]
                      "
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =========================
            Logout
        ========================= */}
        <div
          className="
            border-t
            border-slate-100
            px-4
            py-4
          "
        >
          <button
            type="button"
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-[14px]
              font-medium
              text-slate-500
              transition
              hover:bg-red-50
              hover:text-[#ed1b32]
            "
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="h-[17px] w-[17px]"
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}