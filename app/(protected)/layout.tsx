// () is a route group
// This layout wraps pages that require a logged-in user (Dashboard, Profile, ...)
import { requireAuth } from '@/lib/auth';
import UserNavbar from '@/components/layout/UserNavbar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <>
      <UserNavbar user={user} />
      <main className="flex-1 bg-slate-50">{children}</main>
    </>
  );
}
