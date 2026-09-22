import RequestList from '@/components/blood-requests/RequestList';
import { getBloodRequestsForUser } from '@/lib/bloodRequests';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';

export default async function Page() {
  const user = await requireHospitalAdmin();
  const requests = await getBloodRequestsForUser(user);
  return <RequestList requests={requests} />;
}
