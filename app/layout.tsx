import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import MobileNav from '@/components/layout/mobile-nav';

export const metadata: Metadata = {
  title: 'OUTR Market — Buy. Sell. Trade. Campus.',
  description:
    'The student-to-student marketplace for OUTR, Bhubaneswar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-background text-fg font-sans">
        {children}

        {/* Mobile-only spacer so content never hides behind the nav */}
        <div className="h-20 md:hidden" />

        {/* One nav for EVERY page (hidden on desktop) */}
        <MobileNav />

        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}