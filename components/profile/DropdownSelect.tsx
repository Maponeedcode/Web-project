"use client";

import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  listLabel: string;
  buttonClassName: string;
  searchable?: boolean;
}

// A custom listbox so the list always opens below the field; native <select>
// popups are placed by the browser and often open upward for long lists.
export default function DropdownSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  listLabel,
  buttonClassName,
  searchable = false,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const visibleOptions = searchable
    ? options.filter((option) => option.label.includes(query.trim()))
    : options;
  const selected = options.find((option) => option.value === value);
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const openList = () => {
    setQuery("");
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (option: DropdownOption) => {
    onChange(option.value);
    close();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openList();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visibleOptions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (visibleOptions[activeIndex]) choose(visibleOptions[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && !searchable && visibleOptions[activeIndex] ? optionId(activeIndex) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={searchable ? undefined : handleKeyDown}
        className={`${buttonClassName} flex items-center justify-between text-left`}
      >
        <span className={selected ? "" : "text-slate-400"}>{selected?.label ?? placeholder}</span>
        <i className={`fa-solid fa-chevron-down text-xs text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}></i>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {searchable && (
            <div className="border-b border-slate-100 p-2">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={`ค้นหา${listLabel}...`}
                aria-label={`ค้นหา${listLabel}`}
                aria-controls={listId}
                aria-activedescendant={visibleOptions[activeIndex] ? optionId(activeIndex) : undefined}
                className="w-full rounded-xl bg-slate-50 px-3 py-2 text-sm text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#65a1f2]"
              />
            </div>
          )}

          <ul ref={listRef} id={listId} role="listbox" aria-label={listLabel} className="max-h-64 overflow-y-auto py-1">
            {visibleOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400">ไม่พบ{listLabel}ที่ค้นหา</li>
            ) : (
              visibleOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={optionId(index)}
                  data-index={index}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm ${
                    index === activeIndex ? "bg-blue-50 text-[#0e3b6c]" : "text-slate-700"
                  } ${option.value === value ? "font-bold" : ""}`}
                >
                  {option.label}
                  {option.value === value && <i className="fa-solid fa-check text-xs text-blue-600"></i>}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
