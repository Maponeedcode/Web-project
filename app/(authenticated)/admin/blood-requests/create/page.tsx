import { notFound } from 'next/navigation';
import CreateRequest from '@/components/ui/CreateRequest';
import { getHospitalForUser } from '../data';
import { requireHospitalAdmin } from '@/lib/requireHospitalAdmin';

export default async function Page() {
  const user = await requireHospitalAdmin();
  const hospital = await getHospitalForUser(user);

  if (!hospital) {
    notFound();
  }

  return <CreateRequest hospital={hospital} />;
}