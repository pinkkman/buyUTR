'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/notifications').then((r) => r.json()).then(setNotifications).catch(() => {});
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-slate-600 hover:text-slate-900">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <p className="font-semibold text-sm">Notifications</p>
            <button onClick={markAllRead} className="text-xs text-blue-600">Mark all read</button>
          </div>
          {notifications.length === 0 && (
            <p className="text-sm text-slate-500 px-4 py-6 text-center">No notifications</p>
          )}
          {notifications.map((n) => (
            <Link key={n._id} href={n.link || '#'} onClick={() => setOpen(false)}
              className="block px-4 py-3 border-b last:border-0 hover:bg-slate-50">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}