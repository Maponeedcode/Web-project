import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BloodConnect - ศูนย์ประสานงานและประกาศขอรับบริจาคโลหิตฉุกเฉิน',
  description: 'ระบบเครือข่ายส่งต่อข้อมูลโลหิตฉุกเฉินภาคประชาชน',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${notoSansThai.className} bg-slate-50 text-slate-800 antialiased selection:bg-[#ea384c] selection:text-white min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}