import Link from 'next/link';

export default function HospitalNavbar({ userName }: { userName: string }) {
  const initial = userName.trim().slice(0, 1).toUpperCase() || 'A';

  return (
    <header className="topbar">
      <Link href="/" className="home-link">← หน้าหลัก</Link>
      <div className="top-user">
        <span className="avatar small">{initial}</span>
        <b>{userName}</b>
      </div>
    </header>
  );
}
