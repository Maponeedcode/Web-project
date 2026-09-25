"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DonorNavbar from "@/components/layout/DonorNavbar";
import DonorSideBar from "@/components/layout/DonorSideBar";
import Footer from "@/components/layout/Footer";
import { calculateAge, evaluateDonorEligibility } from "@/lib/donorEligibility";
import { THAI_PROVINCES } from "@/lib/thaiProvinces";
import { bangkokToday } from "@/types/database";

const COMMON_CONDITIONS = [
  "เบาหวาน",
  "ความดันโลหิตสูง",
  "โรคหัวใจ",
  "โรคไต",
  "ธาลัสซีเมีย",
  "ไวรัสตับอักเสบ",
  "แพ้ยา",
];

const MAX_NOTES_LENGTH = 500;
const MAX_FILE_SIZE_MB = 5;

const INPUT_CLASS =
  "w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition";
const LABEL_CLASS = "flex items-center text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5";

interface DonorProfileDetails {
  blood_type: string | null;
  rh_factor: string | null;
  gender: string | null;
  date_of_birth: string | null;
  weight: number | null;
  height: number | null;
  province: string | null;
  is_ready: boolean | null;
  has_chronic_disease: boolean | null;
  medical_notes: string | null;
  last_donate_date: string | null;
  consent_form_url: string | null;
}

const normalizeRh = (rh?: string | null) => {
  const value = rh?.trim().toUpperCase();
  if (value === "+" || value?.startsWith("POS")) return "+";
  if (value === "-" || value?.startsWith("NEG")) return "-";
  return "";
};

const formatPhoneNumber = (value: string) => {
  const clean = value.replace(/\D/g, "");
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
};

// Asian BMI cut-offs used by the Thai Ministry of Public Health.
const BMI_LEVELS = [
  { max: 18.5, label: "น้ำหนักน้อย", className: "text-amber-600" },
  { max: 23, label: "ปกติ", className: "text-emerald-600" },
  { max: 25, label: "ท้วม", className: "text-amber-600" },
  { max: 30, label: "อ้วน", className: "text-orange-600" },
  { max: Infinity, label: "อ้วนมาก", className: "text-red-600" },
];

const calculateBmi = (weight: string, height: string) => {
  const kg = Number(weight);
  const cm = Number(height);
  if (!kg || !cm || cm < 100 || cm > 250) return null;
  const value = kg / (cm / 100) ** 2;
  return { value, level: BMI_LEVELS.find((level) => value < level.max)! };
};

const splitNotes = (notes: string) =>
  notes
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <h2 className="flex items-center px-4 py-3 bg-blue-50 text-sm font-bold text-[#0e3b6c]">
        <i className={`${icon} text-slate-700 mr-3`}></i>
        {title}
      </h2>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  activeClass,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeClass: string;
  disabled?: boolean;
}) {
  return (
    <label className={`relative inline-flex items-center shrink-0 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`relative w-12 h-7 rounded-full bg-slate-300 ${activeClass} ring-1 ring-inset ring-black/10 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow-md after:ring-1 after:ring-black/5 after:transition-transform peer-checked:after:translate-x-5`}
      ></div>
    </label>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [account, setAccount] = useState<{ fullName: string; userName: string } | null>(null);
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [rh, setRh] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("ชาย");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [hasChronicDisease, setHasChronicDisease] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState("");

  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [consentFileError, setConsentFileError] = useState("");
  const [consentFormPath, setConsentFormPath] = useState("");

  const [isReady, setIsReady] = useState(true);
  const [urgentNotifications, setUrgentNotifications] = useState(true);
  const [lastDonateDate, setLastDonateDate] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const today = bangkokToday();
  const bmi = calculateBmi(weight, height);
  const eligibility = evaluateDonorEligibility({
    weight: weight ? Number(weight) : null,
    date_of_birth: dateOfBirth || null,
    last_donate_date: lastDonateDate || null,
    is_ready: isReady,
  });
  const { isCoolingDown, daysRemaining } = eligibility;
  const canCheckEligibility = Boolean(dateOfBirth && weight);
  const selectedConditions = splitNotes(medicalNotes);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/donor/profile/details", { credentials: "include" });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");

        setPhone(formatPhoneNumber(data.user?.phone ?? ""));
        if (data.user) {
          setAccount({ fullName: data.user.full_name, userName: data.user.user_name });
        }

        const profile = data.profile as DonorProfileDetails | null;
        if (profile) {
          setProvince(profile.province ?? "");
          setBloodType(profile.blood_type ?? "");
          setRh(normalizeRh(profile.rh_factor));
          setDateOfBirth(profile.date_of_birth ?? "");
          setGender(profile.gender === "หญิง" ? "หญิง" : "ชาย");
          setWeight(profile.weight != null ? String(profile.weight) : "");
          setHeight(profile.height != null ? String(profile.height) : "");
          setHasChronicDisease(Boolean(profile.has_chronic_disease));
          setMedicalNotes(profile.medical_notes ?? "");
          setIsReady(profile.is_ready ?? true);
          setLastDonateDate(profile.last_donate_date ?? "");
          setConsentFormPath(profile.consent_form_url ?? "");
        }
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const toggleCondition = (condition: string) => {
    const items = splitNotes(medicalNotes);
    const next = items.includes(condition)
      ? items.filter((item) => item !== condition)
      : [...items, condition];
    setMedicalNotes(next.join(", ").slice(0, MAX_NOTES_LENGTH));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setConsentFileError("");

    const isAllowedType = file && /\.(pdf|jpe?g)$/i.test(file.name);
    const error = !file
      ? ""
      : !isAllowedType
        ? "รองรับเฉพาะไฟล์ PDF หรือ JPG เท่านั้น"
        : file.size > MAX_FILE_SIZE_MB * 1024 * 1024
          ? `ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB} MB`
          : "";

    if (error) {
      setConsentFileError(error);
      setConsentFile(null);
      e.target.value = "";
      return;
    }

    setConsentFile(file);
  };

  const openConsentForm = async () => {
    // Opened before the fetch so popup blockers treat it as a direct click.
    const viewer = window.open("", "_blank");
    try {
      const response = await fetch("/api/donor/profile/consent", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (viewer) viewer.location.href = data.url;
      else window.location.href = data.url;
    } catch (error) {
      viewer?.close();
      setConsentFileError(error instanceof Error && error.message ? error.message : "ไม่สามารถเปิดไฟล์ได้");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (Number(weight) < 45) {
      setErrorMsg("น้ำหนักต้องไม่ต่ำกว่า 45 กิโลกรัม");
      return;
    }

    if (eligibility.requiresParentConsent && !consentFile && !consentFormPath) {
      setErrorMsg("ผู้บริจาคอายุ 17 ปี ต้องแนบหนังสือยินยอมจากผู้ปกครองก่อนบันทึก");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      let uploadedConsentPath: string | null = null;

      if (consentFile) {
        const formData = new FormData();
        formData.append("file", consentFile);
        const uploadResponse = await fetch("/api/donor/profile/consent", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          setErrorMsg(`แนบหนังสือยินยอมไม่สำเร็จ: ${uploadData.error || "กรุณาลองใหม่"}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        uploadedConsentPath = uploadData.path;
      }

      const response = await fetch("/api/donor/profile/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone,
          province,
          bloodType,
          rh,
          dateOfBirth,
          gender,
          weight,
          height,
          hasChronicDisease,
          medicalNotes,
          isReady: isReady && !isCoolingDown,
          lastDonateDate,
          consentFormPath: uploadedConsentPath,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (uploadedConsentPath) {
        setConsentFormPath(uploadedConsentPath);
        setConsentFile(null);
      }

      setSuccessMsg("บันทึกข้อมูลโปรไฟล์สำเร็จ");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DonorNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <DonorSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="min-h-screen pt-[116px] md:ml-64 md:pt-16">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 md:px-8 lg:px-10">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">กำลังโหลดข้อมูลโปรไฟล์...</div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-5">
              {account && (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="relative size-14 shrink-0 rounded-full bg-rose-100 text-[#ea384c] flex items-center justify-center">
                    <i className="fa-regular fa-user text-2xl"></i>
                    <i className="fa-solid fa-heart absolute bottom-1 right-1 text-[11px]"></i>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-[#0e3b6c]">{account.fullName}</p>
                    <p className="truncate text-xs text-slate-400">@{account.userName}</p>
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#0e3b6c]">
                      <i className="fa-regular fa-circle-user"></i>
                      ผู้ใช้งานทั่วไป
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pb-1">
                <span className="size-12 rounded-full bg-blue-50 text-[#0e3b6c] flex items-center justify-center shrink-0">
                  <i className="fa-regular fa-user text-lg"></i>
                </span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#0e3b6c]">ข้อมูลโปรไฟล์</h1>
                  <p className="text-xs sm:text-sm text-slate-500">อัปเดตข้อมูลของคุณเพื่อให้ผู้ดูแลสามารถติดต่อคุณได้</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#dc2626]">
                  <i className="fa-solid fa-circle-exclamation shrink-0 text-sm"></i>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-emerald-700">
                  <i className="fa-solid fa-circle-check shrink-0 text-sm"></i>
                  <span>{successMsg}</span>
                </div>
              )}

              <Section icon="fa-solid fa-phone" title="ข้อมูลติดต่อ">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-phone" className={LABEL_CLASS}>
                      <i className="fa-solid fa-phone text-slate-700 mr-3"></i>เบอร์โทรศัพท์ที่ติดต่อได้ <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      required
                      maxLength={12}
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                      placeholder="เช่น 081-234-5678"
                      aria-describedby="profile-phone-hint"
                      className={INPUT_CLASS}
                    />
                    <p id="profile-phone-hint" className="text-[11px] text-slate-400 mt-1">
                      * เลข 4 ตัวท้ายใช้ยืนยันตัวตนเวลารีเซ็ตรหัสผ่าน หากเปลี่ยนเบอร์ ให้ใช้เบอร์ใหม่ในครั้งถัดไป
                    </p>
                  </div>
                  <div>
                    <label htmlFor="profile-province" className={LABEL_CLASS}>
                      <i className="fa-solid fa-location-crosshairs text-slate-700 mr-3"></i>จังหวัดที่พำนักปัจจุบัน <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select id="profile-province" required value={province} onChange={(e) => setProvince(e.target.value)} className={INPUT_CLASS}>
                      <option value="">เลือกจังหวัด</option>
                      {THAI_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Section>

              <Section icon="fa-solid fa-droplet" title="ข้อมูลสุขภาพพื้นฐาน">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-blood-type" className={LABEL_CLASS}>
                      หมู่โลหิตหลัก (ABO) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select id="profile-blood-type" required value={bloodType} onChange={(e) => setBloodType(e.target.value)} className={INPUT_CLASS}>
                      <option value="">เลือกหมู่โลหิตหลัก</option>
                      {["A", "B", "AB", "O"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="profile-rh" className={LABEL_CLASS}>
                      หมู่โลหิตย่อย (Rh Factor) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select id="profile-rh" required value={rh} onChange={(e) => setRh(e.target.value)} className={INPUT_CLASS}>
                      <option value="">เลือกหมู่โลหิตย่อย</option>
                      <option value="+">Rh+ (Positive)</option>
                      <option value="-">Rh- (Negative)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="profile-dob" className={LABEL_CLASS}>
                      <i className="fa-regular fa-calendar text-slate-700 mr-3"></i>วัน/เดือน/ปีเกิด <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="profile-dob"
                      type="date"
                      required
                      max={today}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <p id="profile-gender-label" className={LABEL_CLASS}>
                      <i className="fa-solid fa-venus-mars text-slate-700 mr-3"></i>เพศกำเนิด <span className="text-red-500 ml-1">*</span>
                    </p>
                    <div role="radiogroup" aria-labelledby="profile-gender-label" className="flex items-center gap-6 h-[46px]">
                      {["ชาย", "หญิง"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={gender === option}
                            onChange={() => setGender(option)}
                            className="size-4 accent-blue-600"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile-weight" className={LABEL_CLASS}>
                      <i className="fa-solid fa-weight-scale text-slate-700 mr-3"></i>น้ำหนัก (กก.) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="profile-weight"
                      type="number"
                      required
                      min={45}
                      max={300}
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="เช่น 60"
                      className={INPUT_CLASS}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">ต้องไม่ต่ำกว่า 45 กิโลกรัม</p>
                  </div>
                  <div>
                    <label htmlFor="profile-height" className={LABEL_CLASS}>
                      <i className="fa-solid fa-ruler-vertical text-slate-700 mr-3"></i>ส่วนสูง (ซม.)
                    </label>
                    <input
                      id="profile-height"
                      type="number"
                      min={100}
                      max={250}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="เช่น 170"
                      className={INPUT_CLASS}
                    />
                    {bmi ? (
                      <p className="text-[11px] text-slate-500 mt-1">
                        ดัชนีมวลกาย (BMI){" "}
                        <span className="font-bold text-[#0e3b6c]">{bmi.value.toFixed(1)}</span>{" "}
                        <span className={`font-semibold ${bmi.level.className}`}>· {bmi.level.label}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">ใช้สำหรับคำนวณค่าดัชนีมวลกาย (BMI)</p>
                    )}
                  </div>
                </div>
              </Section>

              <Section icon="fa-regular fa-file" title="มีโรคประจำตัวหรือประวัติแพ้ยาหรือไม่?">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-[#0e3b6c] mb-3 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={hasChronicDisease}
                    onChange={(e) => setHasChronicDisease(e.target.checked)}
                    className="size-5 rounded accent-blue-600"
                  />
                  มี
                </label>

                {hasChronicDisease && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_CONDITIONS.map((condition) => {
                      const isSelected = selectedConditions.includes(condition);
                      return (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => toggleCondition(condition)}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                          }`}
                        >
                          {condition}
                        </button>
                      );
                    })}
                  </div>
                )}

                <label htmlFor="profile-medical-notes" className="block text-xs sm:text-sm font-medium text-[#0e3b6c] mb-1.5">
                  ระบุโรคประจำตัว / ยาที่ต้องรับประทานต่อเนื่อง
                </label>
                <div className="relative">
                  <textarea
                    id="profile-medical-notes"
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value.slice(0, MAX_NOTES_LENGTH))}
                    maxLength={MAX_NOTES_LENGTH}
                    rows={3}
                    disabled={!hasChronicDisease}
                    placeholder="เช่น เบาหวาน, ความดันโลหิตสูง, แพ้ยา..."
                    className={`${INPUT_CLASS} resize-none pb-7 disabled:cursor-not-allowed disabled:opacity-70`}
                  />
                  <span className="absolute bottom-3 right-4 text-[11px] text-slate-400">
                    {medicalNotes.length}/{MAX_NOTES_LENGTH}
                  </span>
                </div>
              </Section>

              <Section icon="fa-regular fa-file" title="หนังสือยินยอมจากผู้ปกครอง">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <p className="text-xs sm:text-sm text-slate-600">สำหรับผู้ที่มีอายุ 17 ปีบริบูรณ์</p>
                  {eligibility.requiresParentConsent ? (
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
                      จำเป็นต้องแนบสำหรับคุณ
                    </span>
                  ) : dateOfBirth && calculateAge(dateOfBirth) >= 18 ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                      ไม่จำเป็นสำหรับอายุของคุณ
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex items-center justify-center gap-4 px-4 py-6 rounded-2xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-600"></i>
                    <div className="min-w-0">
                      {consentFile ? (
                        <p className="text-sm font-bold text-blue-600 truncate">{consentFile.name}</p>
                      ) : (
                        <p className="text-sm font-bold text-blue-600">
                          อัปโหลดไฟล์ <span className="font-normal text-slate-400">(PDF, JPG)</span>
                        </p>
                      )}
                      <p className="text-xs text-slate-400">ขนาดไฟล์ไม่เกิน {MAX_FILE_SIZE_MB} MB</p>
                    </div>
                    <input type="file" accept=".pdf,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
                  </label>
                  <div className="sm:w-60 flex items-center justify-center p-4 rounded-2xl bg-blue-50">
                    <a
                      href="/documents/parent_consent_form.pdf"
                      download
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-blue-600 bg-white text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <i className="fa-solid fa-download"></i>
                      ดาวน์โหลดแบบฟอร์ม
                    </a>
                  </div>
                </div>
                {consentFileError && <p className="text-xs text-red-600 mt-2">{consentFileError}</p>}
                {consentFile ? (
                  <p className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                    <i className="fa-solid fa-circle-info"></i>
                    ไฟล์จะถูกอัปโหลดเมื่อกด &quot;บันทึกข้อมูล&quot;
                  </p>
                ) : consentFormPath ? (
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-700">
                    <i className="fa-solid fa-circle-check"></i>
                    แนบหนังสือยินยอมแล้ว
                    <button
                      type="button"
                      onClick={openConsentForm}
                      className="font-bold text-blue-600 underline underline-offset-2 hover:text-blue-700"
                    >
                      เปิดดูไฟล์
                    </button>
                  </p>
                ) : null}
              </Section>

              <Section icon="fa-regular fa-bell" title="สถานะความพร้อมบริจาค">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-0 sm:divide-x sm:divide-slate-200">
                  <div className="flex items-start gap-3 sm:pr-5">
                    <Toggle
                      label="พร้อมบริจาค"
                      checked={isReady && !isCoolingDown}
                      onChange={setIsReady}
                      disabled={isCoolingDown}
                      activeClass="peer-checked:bg-emerald-500"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#0e3b6c]">พร้อมบริจาค</p>
                      <p className="text-xs text-slate-400">
                        {isCoolingDown
                          ? `อยู่ในระยะพักฟื้นอีก ${daysRemaining} วัน (เว้น 90 วันหลังบริจาค)`
                          : "หากเปิด จะได้รับแจ้งเตือนคำร้องขอบริจาคจากผู้ประสานงาน"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:pl-5">
                    <Toggle
                      label="เปิดรับการแจ้งเตือนเคสด่วน"
                      checked={urgentNotifications}
                      onChange={setUrgentNotifications}
                      activeClass="peer-checked:bg-blue-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#0e3b6c]">เปิดรับการแจ้งเตือนเคสด่วน</p>
                      <p className="text-xs text-slate-400">หากเปิด จะได้รับการแจ้งเตือนเคสด่วน</p>
                    </div>
                  </div>
                </div>

                {!canCheckEligibility ? (
                  <p className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    <i className="fa-solid fa-circle-info text-slate-400"></i>
                    กรอกวันเกิดและน้ำหนักเพื่อตรวจสอบเกณฑ์การบริจาค
                  </p>
                ) : eligibility.isEligible ? (
                  <p className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    <i className="fa-solid fa-circle-check"></i>
                    ผ่านเกณฑ์ พร้อมบริจาคโลหิต
                  </p>
                ) : (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      ยังไม่สามารถบริจาคได้ในขณะนี้
                    </p>
                    <ul className="mt-1.5 list-disc space-y-0.5 pl-9 text-xs text-amber-700">
                      {eligibility.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>

              <div className="grid sm:grid-cols-2 gap-5 items-stretch">
                <Section icon="fa-regular fa-calendar" title="วันที่บริจาคล่าสุด">
                  <input
                    type="date"
                    aria-label="วันที่บริจาคล่าสุด"
                    max={today}
                    value={lastDonateDate}
                    onChange={(e) => setLastDonateDate(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </Section>
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-blue-50">
                  <i className="fa-solid fa-clock-rotate-left text-xl text-slate-700"></i>
                  <p className="text-xs sm:text-sm text-slate-500">
                    ระบบจะอัปเดตวันที่บริจาคล่าสุดโดยอัตโนมัติ หรือคุณสามารถกรอกเองได้
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="min-w-36 px-8 py-3 rounded-xl text-sm font-bold text-[#0e3b6c] bg-white border-2 border-slate-300 hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-w-44 flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <i className="fa-regular fa-calendar-check"></i>
                      บันทึกข้อมูล
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}
