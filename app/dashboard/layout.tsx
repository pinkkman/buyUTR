import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
} from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/listings', icon: ShoppingBag, label: 'My Listings' },
    { href: '/dashboard/favorites', icon: Heart, label: 'Favorites' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 min-h-screen">
      <aside className="hidden md:block">
        <nav className="space-y-1 sticky top-24">
          {links.map((l, i) => (
            <div key={l.href}>
              {/* Subtle divider between Home and dashboard links */}
              {i === 1 && <div className="my-2 border-t border-border" />}
              <Link
                href={l.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-fg-muted hover:bg-surface hover:text-fg transition"
              >
                <l.icon size={18} />
                {l.label}
              </Link>
            </div>
          ))}
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  );
}
