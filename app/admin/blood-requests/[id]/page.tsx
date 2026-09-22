import { notFound } from 'next/navigation';
import RequestDetail from '@/components/blood-requests/RequestDetail';
import { getBloodRequestForUser } from '@/lib/bloodRequests';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireHospitalAdmin();
  const request = await getBloodRequestForUser(user, id);
  if (!request) notFound();
  return <RequestDetail request={request} />;
}
