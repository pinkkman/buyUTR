import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import ListingRowActions from '@/components/dashboard/listing-row-actions';
import { Plus, Eye } from 'lucide-react';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  SOLD: 'bg-blue-100 text-blue-700',
  RESERVED: 'bg-amber-100 text-amber-700',
  EXPIRED: 'bg-slate-100 text-slate-600',
  REMOVED: 'bg-red-100 text-red-700',
};

export default async function MyListingsPage({ searchParams }: Props) {
  const session = await auth();
  await dbConnect();
  const uid = (session!.user as any).id;

  const { status } = await searchParams;
  const filter = status && status !== 'ALL' ? { seller: uid, status } : { seller: uid };

  const [listings, counts] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).lean(),
    Listing.aggregate([
      { $match: { seller: new (await import('mongoose')).default.Types.ObjectId(uid) } },
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]),
  ]);

  const countBy = (s: string) =>
    counts.find((c: any) => c._id === s)?.total || 0;
  const total = listings.reduce((acc: number, l: any) => acc + (l.views || 0), 0);

  const tabs = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'SOLD', label: 'Sold' },
    { key: 'RESERVED', label: 'Reserved' },
    { key: 'REMOVED', label: 'Removed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-sm text-slate-500">Manage everything you're selling.</p>
        </div>
        <Link
          href="dashboard/listings/new"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
        >
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Active" value={countBy('ACTIVE')} />
        <Stat label="Sold" value={countBy('SOLD')} />
        <Stat label="Reserved" value={countBy('RESERVED')} />
        <Stat label="Total Views" value={total} />
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === 'ALL' ? '/dashboard/listings' : `/dashboard/listings?status=${t.key}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              (status || 'ALL') === t.key
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {listings.map((l: any) => (
          <div
            key={l._id.toString()}
            className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <Link href={`/listings/${l._id}`} className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
              {l.images?.[0] ? (
                <img src={l.images[0]} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/dashboard/listings/${l._id}`} className="font-medium truncate hover:underline block">
                {l.title}
              </Link>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-800">{formatPrice(l.price)}</span>
                <span className="inline-flex items-center gap-1"><Eye size={14} /> {l.views}</span>
              </div>
            </div>

            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[l.status]}`}>
              {l.status}
            </span>

            <ListingRowActions id={l._id.toString()} status={l.status} />
          </div>
        ))}

        {listings.length === 0 && (
          <div className="text-center py-14 bg-white border border-dashed rounded-xl">
            <p className="text-slate-500 font-medium">No listings here.</p>
            <Link href="/dashboard/listings/new" className="inline-block mt-3 text-sm text-blue-600 hover:underline">
              Create your first listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold mt-0.5">{value}</p>
    </div>
  );
}