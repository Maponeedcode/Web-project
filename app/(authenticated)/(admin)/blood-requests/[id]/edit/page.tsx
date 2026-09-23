import { notFound, redirect } from 'next/navigation';
import EditRequest from '@/components/ui/EditRequest';
import { getBloodRequestForUser, getHospitalForUser } from '../../data';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireHospitalAdmin();
  const [request, hospital] = await Promise.all([
    getBloodRequestForUser(user, id),
    getHospitalForUser(user),
  ]);
  if (!request) notFound();
  if (request.status !== 'OPEN' && request.status !== 'IN_PROGRESS' && request.status !== 'EXPIRED') redirect(`/blood-requests/${id}`);
  return <EditRequest request={request} hospital={hospital} />;
}
