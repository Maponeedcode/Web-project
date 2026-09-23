export interface Hospital        {
  hospital_id: string;
  name: string;
  address: string;
  province: string;
  contact_phone: string;
  contact_person: string | null;
  created_at: string;
}

export interface BloodRequest {
  request_id: string;
  hospital_id: string;
  blood_type: 'A' | 'B' | 'AB' | 'O';
  rh_factor: 'Positive' | 'Negative' | '+' | '-';
  units_needed: number;
  urgency_level: 'CRITICAL' | 'HIGH' | 'NORMAL';
  purpose: string;
  target_date: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
  hospitals?: {
    name: string;
    province: string;
  };
  donation_records?: {
    record_id: string;
    volume_ml: number | null;
    status: string;
  }[];
}

export function bangkokToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const value = (part: 'year' | 'month' | 'day') => parts.find(item => item.type === part)?.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function effectiveBloodRequestStatus(
  status: BloodRequest['status'],
  targetDate: string,
  today = bangkokToday(),
): BloodRequest['status'] {
  return status === 'OPEN' && targetDate < today ? 'EXPIRED' : status;
}
