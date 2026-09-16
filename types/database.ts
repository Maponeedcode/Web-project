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
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED' | 'CANCELLED';
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