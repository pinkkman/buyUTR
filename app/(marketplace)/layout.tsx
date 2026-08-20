import Navbar from '@/components/layout/navbar';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}