'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseBloodRequestForm } from '../form';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export type CreateRequestState = { error: string | null };

export async function createBloodRequest(
  _previousState: CreateRequestState,
  formData: FormData,
): Promise<CreateRequestState> {
  const user = await requireHospitalAdmin();
  if (!user.hospital_id) return { error: 'บัญชีนี้ยังไม่ได้ผูกกับโรงพยาบาล' };

  const parsed = parseBloodRequestForm(formData);
  if (!parsed.success) return { error: parsed.error };

  const requestId = randomUUID();
  const { error } = await supabaseAdmin.from('blood_requests').insert({
    request_id: requestId,
    hospital_id: user.hospital_id,
    ...parsed.value,
    status: 'OPEN',
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Create blood request failed:', error);
    return { error: 'สร้างคำร้องไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง' };
  }

  revalidatePath('/blood-requests');
  redirect(`/blood-requests/${requestId}`);
}
