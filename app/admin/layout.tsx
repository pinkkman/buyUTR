import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) redirect('/');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-fg">
          buy<span className="text-accent">UTR</span> Admin
        </h1>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}