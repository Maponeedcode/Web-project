import CreateRequest from '@/components/blood-requests/CreateRequest';
import { getHospitalForUser } from '@/lib/bloodRequests';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';

export default async function Page() {
  const user = await requireHospitalAdmin();
  const hospital = await getHospitalForUser(user);
  return <CreateRequest hospital={hospital} />;
}
