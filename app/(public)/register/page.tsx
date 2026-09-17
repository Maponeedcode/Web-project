'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Only number in this feild
      [name]: name === 'phone' ? value.replace(/[^0-9]/g, '') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check phone number length
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 10) {
      setErrorMessage('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)');
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    // Check password must match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบรหัสผ่านอีกครั้ง');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          fullname: formData.fullname,
          phone: cleanPhone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
        setIsLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-[#ea384c] selection:text-white flex flex-col justify-center items-center p-4 sm:p-6">
      
      {/* ปุ่มย้อนกลับหน้าหลัก */}
      <div className="w-full max-w-[480px] mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#0e3b6c] transition"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>กลับสู่หน้าหลัก</span>
        </Link>
      </div>

      {/* Main Card Container */}
      <main className="w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm">
        
        {/* Brand Logo Header */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-3 select-none">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              <Image
                src="/logo_bloodConnect.svg"
                alt="BloodConnect Logo"
                width={44}
                height={44}
                className="w-10 h-10 sm:w-11 sm:h-11 shrink-0"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-[#0e3b6c]">
                Blood<span className="text-[#ea384c]">Connect</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#65a1f2] tracking-wider mt-1 uppercase">
                CONNECT LIVES SAVE LIVES
              </span>
            </div>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0e3b6c] tracking-tight">
            สมัครสมาชิก
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ร่วมเป็นส่วนหนึ่งในการช่วยเหลือและส่งต่อโอกาสรอดชีวิต
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-[#dc2626] font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5">
              ชื่อผู้ใช้ (Username)
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-user text-slate-400 absolute left-4 text-sm"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="ตั้งชื่อผู้ใช้ของคุณ"
                required
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Fullname Field */}
          <div>
            <label htmlFor="fullname" className="block text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5">
              ชื่อ - นามสกุลจริง (Fullname)
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-id-card text-slate-400 absolute left-4 text-sm"></i>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="กรอกชื่อและนามสกุลจริง"
                required
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Phone Field (เพิ่มใหม่) */}
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5">
              เบอร์โทรศัพท์ (Phone Number)
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-phone text-slate-400 absolute left-4 text-sm"></i>
              <input
                type="tel"
                id="phone"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="เช่น 0812345678"
                required
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * ใช้เลข 4 ตัวท้ายเพื่อยืนยันตัวตนเวลารีเซ็ตรหัสผ่าน
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-lock text-slate-400 absolute left-4 text-sm"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="ตั้งรหัสผ่านของคุณ"
                required
                className="w-full pl-11 pr-11 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none text-sm"
                aria-label="ดูรหัสผ่าน"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-[#0e3b6c] mb-1.5">
              ยืนยันรหัสผ่าน (Confirm Password)
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-shield-halved text-slate-400 absolute left-4 text-sm"></i>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                required
                className="w-full pl-11 pr-11 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-[#0e3b6c] placeholder-slate-400 focus:outline-none focus:border-[#65a1f2] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none text-sm"
                aria-label="ดูรหัสผ่าน"
              >
                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>กำลังสร้างบัญชี...</span>
              ) : (
                <>
                  <span>สร้างบัญชีผู้ใช้งาน</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            มีบัญชีอยู่แล้ว?{' '}
            <Link
              href="/login"
              className="font-bold text-[#dc2626] hover:underline inline-flex items-center gap-1 ml-1"
            >
              เข้าสู่ระบบที่นี่
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}