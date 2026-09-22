import type { BloodRequest } from '@/types/database';

export type RequestView = {
  id: string; hospitalId: string; hospital: string; province: string; blood: string; units: number;
  urgency: BloodRequest['urgency_level']; status: BloodRequest['status']; date: string;
  createdAt: string; address: string; contact: string; phone: string; purpose: string;
  responseCount: number;
};
export const statusLabels = { OPEN: 'เปิดรับบริจาค', IN_PROGRESS: 'กำลังดำเนินการ', FULFILLED: 'เสร็จสิ้น', CANCELLED: 'ยกเลิก' };
export const urgencyLabels = { CRITICAL: 'ด่วนมาก', HIGH: 'เร่งด่วน', NORMAL: 'ปกติ' };
export function formatDate(value: string) { return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)); }
export function formatDateTime(value: string) { return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
export function shortRequestId(value: string) { return value.slice(0, 8).toUpperCase(); }
export function statusColor(status: RequestView['status']) { return ({ OPEN: 'blue', IN_PROGRESS: 'orange', FULFILLED: 'green', CANCELLED: 'gray' })[status]; }
export function urgencyColor(urgency: RequestView['urgency']) { return ({ CRITICAL: 'red', HIGH: 'orange', NORMAL: 'gray' })[urgency]; }
