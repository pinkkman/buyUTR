import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default async function MyListingsPage() {
  const session = await auth();
  await dbConnect();
  const uid = (session!.user as any).id;

  const listings = await Listing.find({ seller: uid }).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">My Listings</h1>
        <Link href="/dashboard/listings/new" className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-secondary transition">
          New Listing
        </Link>
      </div>
      <div className="space-y-3">
        {listings.map((l) => (
          <Link key={l._id.toString()} href={`/listings/${l._id}`}
            className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4 hover:border-accent transition">
            <div className="w-16 h-16 bg-surface-elevated rounded-lg overflow-hidden shrink-0">
              {l.images[0] && <img src={l.images[0]} className="w-full h-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-fg">{l.title}</p>
              <p className="text-sm text-fg-muted">{formatPrice(l.price)} · {l.views} views</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-surface-elevated text-fg-muted">{l.status}</span>
          </Link>
        ))}
        {listings.length === 0 && <p className="text-fg-muted text-center py-10">No listings yet.</p>}
      </div>
    </div>
  );
}