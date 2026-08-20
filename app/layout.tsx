import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'OUTR Market — Buy. Sell. Trade. Campus.',
  description:
    'The student-to-student marketplace for OUTR, Bhubaneswar. Buy, sell, trade, and rent within campus.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}