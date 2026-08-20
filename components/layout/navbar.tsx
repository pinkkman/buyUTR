import Link from 'next/link';
import { auth } from '@/lib/auth';
import { PlusCircle } from 'lucide-react';
import SearchBar from '../marketplace/search-bar';
import UserMenu from './user-menu';
import NotificationsBell from './notifications-bell';

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" className="text-xl font-bold shrink-0">buyUTR</Link>
        <div className="hidden md:block flex-1 max-w-xl">
          <SearchBar />
        </div>
        <nav className="flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard/listings/new"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg">
                <PlusCircle size={16} /> Sell
              </Link>
              <NotificationsBell />
              <UserMenu user={session.user} />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600">Log in</Link>
              <Link href="/register" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}