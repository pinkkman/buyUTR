import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import IdVerificationBanner from '@/components/IdVerificationBanner';
import { auth } from '@/lib/auth';

export default async function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {session?.user && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <IdVerificationBanner />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}