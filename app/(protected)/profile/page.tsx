'use client';

import { useEffect, useState } from 'react';
import type { AuthUser } from '@/lib/auth';
import { THAI_PROVINCES } from '@/lib/thaiProvinces';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

const COMMON_CONDITIONS = [
  'เบาหวาน',
  'ความดันโลหิตสูง',
  'โรคหัวใจ',
  'โรคไต',
  'ธาลัสซีเมีย / โรคเลือด',
  'ไวรัสตับอักเสบ',
  'แพ้ยา / แพ้อาหาร',
];

const MAX_NOTES_LENGTH = 500;
const MAX_FILE_SIZE_MB = 5;

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition';
const LABEL_CLASS = 'flex items-center text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5';

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
  checked,
  onChange,
  activeClass,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeClass: string;
}) {
  return (
    <label className="relative inline-flex items-center shrink-0 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [bloodAbo, setBloodAbo] = useState('');
  const [bloodRh, setBloodRh] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const [hasCondition, setHasCondition] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [conditionNotes, setConditionNotes] = useState('');

  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [consentFileError, setConsentFileError] = useState('');

  const [availableToDonate, setAvailableToDonate] = useState(true);
  const [urgentNotifications, setUrgentNotifications] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setPhone(data.user.phone ?? '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setConsentFileError('');

    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setConsentFileError(`ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB} MB`);
      setConsentFile(null);
      e.target.value = '';
      return;
    }

    setConsentFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (Number(weight) < 45) {
      setErrorMsg('น้ำหนักต้องไม่ต่ำกว่า 45 กิโลกรัม');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          province,
          bloodAbo,
          bloodRh,
          dob,
          gender,
          weight,
          height,
          conditions: hasCondition ? selectedConditions : [],
          conditionNotes: hasCondition ? conditionNotes : '',
          availableToDonate,
          urgentNotifications,
          lastDonationDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      } else {
        setSuccessMsg('บันทึกข้อมูลโปรไฟล์สำเร็จ');
      }
    } catch {
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-slate-400">กำลังโหลดข้อมูล...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6">
      <ProfileSidebar user={user} />

      <form onSubmit={handleSubmit} className="flex-1 min-w-0">
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#dc2626]">
            <i className="fa-solid fa-circle-exclamation shrink-0 text-sm"></i>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-emerald-700">
            <i className="fa-solid fa-circle-check shrink-0 text-sm"></i>
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 pb-1">
            <span className="size-12 rounded-full bg-blue-50 text-[#0e3b6c] flex items-center justify-center shrink-0">
              <i className="fa-regular fa-user text-lg"></i>
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0e3b6c]">ข้อมูลโปรไฟล์</h1>
              <p className="text-xs sm:text-sm text-slate-500">อัปเดตข้อมูลของคุณเพื่อให้ผู้อื่นสามารถติดต่อคุณได้</p>
            </div>
          </div>

          <Section icon="fa-solid fa-phone" title="ข้อมูลติดต่อ">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>
                  <i className="fa-solid fa-phone text-slate-700 mr-3"></i>เบอร์โทรศัพท์ที่ติดต่อได้ <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="เช่น 0812345678"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  <i className="fa-solid fa-location-crosshairs text-slate-700 mr-3"></i>จังหวัดที่พำนักปัจจุบัน <span className="text-red-500 ml-1">*</span>
                </label>
                <select required value={province} onChange={(e) => setProvince(e.target.value)} className={INPUT_CLASS}>
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
                <label className={LABEL_CLASS}>
                  หมู่โลหิตหลัก (ABO) <span className="text-red-500 ml-1">*</span>
                </label>
                <select required value={bloodAbo} onChange={(e) => setBloodAbo(e.target.value)} className={INPUT_CLASS}>
                  <option value="">เลือกหมู่โลหิตหลัก</option>
                  {['A', 'B', 'AB', 'O'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  หมู่โลหิตย่อย (Rh Factor) <span className="text-red-500 ml-1">*</span>
                </label>
                <select required value={bloodRh} onChange={(e) => setBloodRh(e.target.value)} className={INPUT_CLASS}>
                  <option value="">เลือกหมู่โลหิตย่อย</option>
                  <option value="+">Rh+</option>
                  <option value="-">Rh-</option>
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  <i className="fa-regular fa-calendar text-slate-700 mr-3"></i>วัน/เดือน/ปีเกิด <span className="text-red-500 ml-1">*</span>
                </label>
                <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  <i className="fa-solid fa-venus-mars text-slate-700 mr-3"></i>เพศกำเนิด <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center gap-6 h-[46px]">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="size-4 accent-blue-600"
                    />
                    ชาย
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="size-4 accent-blue-600"
                    />
                    หญิง
                  </label>
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  <i className="fa-solid fa-weight-scale text-slate-700 mr-3"></i>น้ำหนัก (กก.) <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={45}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="เช่น 60"
                  className={INPUT_CLASS}
                />
                <p className="text-[11px] text-slate-400 mt-1">ต้องไม่ต่ำกว่า 45 กิโลกรัม</p>
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  <i className="fa-solid fa-ruler-vertical text-slate-700 mr-3"></i>ส่วนสูง (ซม.)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="เช่น 170"
                  className={INPUT_CLASS}
                />
                <p className="text-[11px] text-slate-400 mt-1">ใช้สำหรับคำนวณค่าดัชนีมวลกาย (BMI)</p>
              </div>
            </div>
          </Section>

          <Section icon="fa-regular fa-file" title="มีโรคประจำตัวหรือประวัติแพ้ยาหรือไม่?">
            <label className="flex items-center gap-2.5 text-sm font-semibold text-[#0e3b6c] mb-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={hasCondition}
                onChange={(e) => setHasCondition(e.target.checked)}
                className="size-5 rounded accent-blue-600"
              />
              มี
            </label>

            {hasCondition && (
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_CONDITIONS.map((condition) => {
                  const isSelected = selectedConditions.includes(condition);
                  return (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => toggleCondition(condition)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                      }`}
                    >
                      {condition}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="text-xs sm:text-sm font-medium text-[#0e3b6c] mb-1.5">ระบุโรคประจำตัว / ยาที่ต้องรับประทานต่อเนื่อง</p>
            <div className="relative">
              <textarea
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value.slice(0, MAX_NOTES_LENGTH))}
                maxLength={MAX_NOTES_LENGTH}
                rows={3}
                disabled={!hasCondition}
                placeholder="เช่น เบาหวาน, ความดันโลหิตสูง, แพ้ยา..."
                className={`${INPUT_CLASS} resize-none pb-7 disabled:cursor-not-allowed disabled:opacity-70`}
              />
              <span className="absolute bottom-3 right-4 text-[11px] text-slate-400">
                {conditionNotes.length}/{MAX_NOTES_LENGTH}
              </span>
            </div>
          </Section>

          <Section icon="fa-regular fa-file" title="หนังสือยินยอมจากผู้ปกครอง">
            <p className="text-xs sm:text-sm text-slate-600 mb-3">สำหรับผู้ที่มีอายุ 17 ปีบริบูรณ์</p>
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
          </Section>

          <Section icon="fa-regular fa-bell" title="สถานะความพร้อมบริจาค">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-0 sm:divide-x sm:divide-slate-200">
              <div className="flex items-start gap-3 sm:pr-5">
                <Toggle checked={availableToDonate} onChange={setAvailableToDonate} activeClass="peer-checked:bg-emerald-500" />
                <div>
                  <p className="text-sm font-bold text-[#0e3b6c]">พร้อมบริจาค</p>
                  <p className="text-xs text-slate-400">หากเปิด จะได้รับแจ้งเตือนคำร้องขอบริจาคจากผู้ประสานงาน</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:pl-5">
                <Toggle checked={urgentNotifications} onChange={setUrgentNotifications} activeClass="peer-checked:bg-blue-600" />
                <div>
                  <p className="text-sm font-bold text-[#0e3b6c]">เปิดรับการแจ้งเตือนเคสด่วน</p>
                  <p className="text-xs text-slate-400">หากเปิด จะได้รับการแจ้งเตือนเคสด่วน</p>
                </div>
              </div>
            </div>
          </Section>

          <div className="grid sm:grid-cols-2 gap-5 items-stretch">
            <Section icon="fa-regular fa-calendar" title="วันที่บริจาคล่าสุด">
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
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
              onClick={() => window.location.reload()}
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
        </div>
      </form>
    </div>
  );
}
