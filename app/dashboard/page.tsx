import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import Favorite from '@/models/Favorite';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  const uid = (session!.user as any).id;
  const [active, sold, favs] = await Promise.all([
    Listing.countDocuments({ seller: uid, status: 'ACTIVE' }),
    Listing.countDocuments({ seller: uid, status: 'SOLD' }),
    Favorite.countDocuments({ user: uid }),
  ]);

  const stats = [
    { label: 'Active Listings', value: active, href: '/dashboard/listings' },
    { label: 'Items Sold', value: sold, href: '/dashboard/listings' },
    { label: 'Favorites', value: favs, href: '/dashboard/favorites' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {session!.user.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white border rounded-xl p-6 hover:shadow-md transition">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}