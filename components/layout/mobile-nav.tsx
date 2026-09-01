'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, MessageSquare, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const itemStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    padding: '10px 0',
    textDecoration: 'none',
  };

  const Item = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = isActive(href);
    const color = active ? '#B22222' : '#A3A3A3';
    return (
      <Link href={href} style={{ ...itemStyle, color }}>
        <Icon size={21} strokeWidth={active ? 2.6 : 2} />
        <span style={{ fontSize: 10, fontWeight: 500, lineHeight: 1 }}>{label}</span>
      </Link>
    );
  };

  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        background: '#171717',
        borderTop: '1px solid #2A2A2A',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Full-width row: 5 equal columns, left → right */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end' }}>
        <Item href="/" icon={Home} label="Home" />
        <Item href="/search" icon={Search} label="Search" />

        {/* Center Sell */}
        <div style={{ ...itemStyle, justifyContent: 'flex-end' }}>
          <Link
            href="/listings/new"
            style={{
              marginTop: -26,
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#B22222',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #171717',
              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
            }}
          >
            <Plus size={24} strokeWidth={2.5} />
          </Link>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#A3A3A3', lineHeight: 1 }}>
            Sell
          </span>
        </div>

        <Item href="/dashboard/messages" icon={MessageSquare} label="Chat" />
        <Item href="/dashboard/profile" icon={User} label="Profile" />
      </div>
    </nav>
  );
}