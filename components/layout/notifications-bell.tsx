'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-fg-muted hover:text-fg transition"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-4 min-w-4 px-0.5 rounded-full bg-accent text-white text-[10px] font-bold leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <div
        className={`absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg shadow-black/30 z-50 max-h-96 overflow-y-auto origin-top-right transition-all duration-200 ease-out ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-surface">
          <p className="font-semibold text-sm text-fg">
            Notifications {unread > 0 && <span className="text-accent">({unread})</span>}
          </p>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-accent hover:text-accent-secondary transition">
              Mark all read
            </button>
          )}
        </div>

        {loading && (
          <div className="px-4 py-8 flex justify-center">
            <span className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="px-4 py-10 text-center">
            <Bell size={22} className="mx-auto text-fg-muted mb-2" />
            <p className="text-sm text-fg-muted">You're all caught up</p>
          </div>
        )}

        {!loading &&
          notifications.map((n) => (
            <Link
              key={n._id}
              href={n.link || '#'}
              onClick={() => setOpen(false)}
              className={`relative flex gap-2.5 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-elevated transition ${
                !n.read ? 'bg-accent/5' : ''
              }`}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  !n.read ? 'bg-accent' : 'bg-transparent'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate ${!n.read ? 'font-semibold text-fg' : 'font-medium text-fg-muted'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-fg-muted mt-0.5 line-clamp-2">{n.message}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}