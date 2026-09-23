'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBloodRequestForUser } from '../data';
import { parseBloodRequestForm } from '../form';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export type RequestActionState = { error: string | null };
const editableStatuses = new Set(['OPEN', 'IN_PROGRESS']);

function requestId(formData: FormData) {
  return String(formData.get('request_id') ?? '').trim();
}

async function editableRequest(id: string) {
  const user = await requireHospitalAdmin();
  if (!id) return { user, request: null, error: 'ไม่พบรหัสคำร้อง' };
  const request = await getBloodRequestForUser(user, id);
  if (!request) return { user, request: null, error: 'ไม่พบคำร้อง หรือคุณไม่มีสิทธิ์จัดการคำร้องนี้' };
  if (!editableStatuses.has(request.status)) return { user, request, error: 'คำร้องที่เสร็จสิ้นหรือยกเลิกแล้วไม่สามารถแก้ไขได้' };
  return { user, request, error: null };
}

export async function updateBloodRequest(
  _previousState: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const id = requestId(formData);
  const access = await editableRequest(id);
  if (access.error) return { error: access.error };

  const parsed = parseBloodRequestForm(formData);
  if (!parsed.success) return { error: parsed.error };

  let query = supabaseAdmin
    .from('blood_requests')
    .update(parsed.value)
    .eq('request_id', id)
    .in('status', ['OPEN', 'IN_PROGRESS']);
  if (access.user.hospital_id) query = query.eq('hospital_id', access.user.hospital_id);

  const { data, error } = await query.select('request_id').maybeSingle();
  if (error) {
    console.error('Update blood request failed:', error);
    return { error: 'แก้ไขคำร้องไม่สำเร็จ กรุณาลองอีกครั้ง' };
  }
  if (!data) return { error: 'คำร้องถูกเปลี่ยนสถานะแล้ว กรุณากลับไปตรวจสอบอีกครั้ง' };

  revalidatePath('/admin/blood-requests');
  revalidatePath(`/admin/blood-requests/${id}`);
  redirect(`/admin/blood-requests/${id}`);
}

export async function closeBloodRequest(
  _previousState: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const id = requestId(formData);
  const access = await editableRequest(id);
  if (access.error) return { error: access.error };

  let query = supabaseAdmin
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('request_id', id)
    .in('status', ['OPEN', 'IN_PROGRESS']);
  if (access.user.hospital_id) query = query.eq('hospital_id', access.user.hospital_id);

  const { data, error } = await query.select('request_id').maybeSingle();
  if (error) {
    console.error('Close blood request failed:', error);
    return { error: 'ปิดคำร้องไม่สำเร็จ กรุณาลองอีกครั้ง' };
  }
  if (!data) return { error: 'คำร้องถูกเปลี่ยนสถานะแล้ว กรุณากลับไปตรวจสอบอีกครั้ง' };

  revalidatePath('/admin/blood-requests');
  revalidatePath(`/admin/blood-requests/${id}`);
  redirect(`/admin/blood-requests/${id}`);
}
