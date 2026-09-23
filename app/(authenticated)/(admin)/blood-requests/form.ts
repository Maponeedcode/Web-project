import 'server-only';

import type { BloodRequest } from '@/types/database';

export type BloodRequestInput = Pick<
  BloodRequest,
  'blood_type' | 'rh_factor' | 'units_needed' | 'urgency_level' | 'purpose' | 'target_date'
>;

export type ParseResult =
  | { success: true; value: BloodRequestInput }
  | { success: false; error: string };

const allowedUrgencies = new Set<BloodRequest['urgency_level']>(['CRITICAL', 'HIGH', 'NORMAL']);
const bloodPattern = /^(AB|A|B|O)([+-])$/;

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim();
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00+07:00`).getTime());
}

export function parseBloodRequestForm(formData: FormData): ParseResult {
  const blood = text(formData, 'blood');
  const match = blood.match(bloodPattern);
  const units = Number(text(formData, 'units'));
  const urgency = text(formData, 'urgency') as BloodRequest['urgency_level'];
  const targetDate = text(formData, 'target_date');
  const purpose = text(formData, 'purpose');

  if (!match) return { success: false, error: 'กรุณาเลือกกรุ๊ปเลือดและ Rh ให้ถูกต้อง' };
  if (!Number.isInteger(units) || units < 1 || units > 1000) return { success: false, error: 'จำนวนโลหิตต้องเป็นเลขจำนวนเต็ม 1–1,000 ยูนิต' };
  if (!allowedUrgencies.has(urgency)) return { success: false, error: 'ระดับความเร่งด่วนไม่ถูกต้อง' };
  if (!isValidDate(targetDate)) return { success: false, error: 'วันที่ต้องการเลือดไม่ถูกต้อง' };
  if (new Date(`${targetDate}T23:59:59+07:00`).getTime() < Date.now()) return { success: false, error: 'วันที่ต้องการเลือดต้องเป็นวันนี้หรือวันถัดไป' };
  if (purpose.length < 5 || purpose.length > 2000) return { success: false, error: 'รายละเอียดเคสต้องมีความยาว 5–2,000 ตัวอักษร' };

  return {
    success: true,
    value: {
      blood_type: match[1] as BloodRequest['blood_type'],
      rh_factor: match[2] === '+' ? 'Positive' : 'Negative',
      units_needed: units,
      urgency_level: urgency,
      purpose,
      target_date: targetDate,
    },
  };
}
