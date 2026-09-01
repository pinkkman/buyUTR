'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { logoutAction } from '@/lib/auth/actions';

export default function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm"
      >
        {user?.name?.[0]?.toUpperCase() || 'U'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-fg hover:bg-surface-elevated"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="hidden md:block px-4 py-2 text-sm text-fg hover:bg-surface-elevated"
          >
            Profile
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-fg hover:bg-surface-elevated"
            >
              Admin
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-sm text-accent hover:bg-surface-elevated"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}