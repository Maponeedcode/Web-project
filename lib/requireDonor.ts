import { redirect } from 'next/navigation';
import { getCurrentUser } from './auth';

export async function requireDonor() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'donor') {
    redirect('/admin/dashboard');
  }

  return user;
}