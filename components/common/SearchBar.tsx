"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  faMagnifyingGlass,
  faHospital,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchOption {
  name: string;
  province: string;
}

interface SearchBarProps {
  placeholder?: string;
  options?: SearchOption[];
}

export default function SearchBar({
  placeholder = "ค้นหาโรงพยาบาลหรือจังหวัด...",
  options = [],
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  // ==========================================
  // อ่านค่าจาก URL
  // ==========================================
  useEffect(() => {
    const keyword = searchParams.get("search") || "";
    setSearch(keyword);
  }, [searchParams]);

  // ==========================================
  // ค้นหาโรงพยาบาล / จังหวัด
  // ==========================================
  const results = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return options
      .filter((item) => {
        const hospitalName =
          item.name?.toLowerCase() || "";

        const province =
          item.province?.toLowerCase() || "";

        return (
          hospitalName.includes(keyword) ||
          province.includes(keyword)
        );
      })
      .filter(
        (item, index, array) =>
          index ===
          array.findIndex(
            (other) =>
              other.name === item.name &&
              other.province === item.province
          )
      )
      .slice(0, 8);
  }, [search, options]);

  // ==========================================
  // Search เมื่อพิมพ์
  // ==========================================
  useEffect(() => {
    const keyword = search.trim();
    const currentKeyword =
      searchParams.get("search") || "";

    if (keyword === currentKeyword) {
      return;
    }

    const timer = setTimeout(() => {
      if (!keyword) {
        router.replace(pathname);
        return;
      }

      const params = new URLSearchParams(
        searchParams.toString()
      );

      params.set("search", keyword);

      router.replace(
        `${pathname}?${params.toString()}`
      );
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    search,
    pathname,
    router,
    searchParams,
  ]);

  // ==========================================
  // ปิด Dropdown เมื่อคลิกข้างนอก
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // เลือกผลการค้นหา
  // ==========================================
  const handleSelect = (
    item: SearchOption
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("search", item.name);

    setSearch(item.name);
    setShowResults(false);

    router.replace(
      `${pathname}?${params.toString()}`
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      {/* ==========================================
          Search Input
      ========================================== */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="
            absolute
            left-4
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
            if (search.trim()) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder}
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-2.5
            pl-11
            pr-4
            text-sm
            text-slate-700
            outline-none
            transition

            placeholder:text-slate-400

            focus:border-[#126fd1]
            focus:bg-white
            focus:ring-2
            focus:ring-[#126fd1]/10
          "
        />
      </div>

      {/* ==========================================
          Search Results
      ========================================== */}
      {showResults &&
        search.trim() &&
        results.length > 0 && (
          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-2
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-lg
            "
          >
            {results.map((item, index) => (
              <button
                key={`${item.name}-${item.province}-${index}`}
                type="button"
                onClick={() =>
                  handleSelect(item)
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  border-b
                  border-slate-100
                  px-4
                  py-3
                  text-left
                  transition
                  last:border-b-0
                  hover:bg-slate-50
                "
              >
                {/* Hospital Icon */}
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-[#126fd1]
                  "
                >
                  <FontAwesomeIcon
                    icon={faHospital}
                    className="h-4 w-4"
                  />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {item.name}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="h-3 w-3"
                    />

                    {item.province}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

      {/* ==========================================
          ไม่พบข้อมูล
      ========================================== */}
      {showResults &&
        search.trim() &&
        results.length === 0 &&
        options.length > 0 && (
          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-2
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              text-center
              shadow-lg
            "
          >
            <p className="text-sm text-slate-500">
              ไม่พบโรงพยาบาลหรือจังหวัด
            </p>
          </div>
        )}
    </div>
  );
}