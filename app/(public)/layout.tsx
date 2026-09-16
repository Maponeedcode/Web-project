// () is a route group
// This website has two types of nav bars like Pages for guests (Lading pages)
// and Pages for login users (Dashboard, Profile) 
import GuestNavbar from '@/components/layout/GuestNavbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GuestNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}