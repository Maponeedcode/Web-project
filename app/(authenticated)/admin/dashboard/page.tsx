import RequestList from '@/components/ui/RequestList';
import { getBloodRequestsForUser } from '../blood-requests/data';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';

export default async function Page() {
  const user = await requireHospitalAdmin();
  const requests = await getBloodRequestsForUser(user);
  return <RequestList requests={requests} />;
}
