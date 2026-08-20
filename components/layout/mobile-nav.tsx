'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const items = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/dashboard/listings/new', icon: PlusCircle, label: 'Sell' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Chat' },
    { href: '/dashboard', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around py-2 md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${active ? 'text-blue-600' : 'text-slate-500'}`}>
            <item.icon size={22} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}