import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Favorite from '@/models/Favorite';
import ListingCard from '@/components/marketplace/listing-card';

export default async function FavoritesPage() {
  const session = await auth();
  await dbConnect();
  const uid = (session!.user as any).id;

  const favorites = await Favorite.find({ user: uid })
    .populate('listing')
    .sort({ createdAt: -1 })
    .lean();

  const active = favorites.filter((f) => f.listing && f.listing.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Favorites</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {active.map((f) => (
          <ListingCard key={f._id.toString()} listing={f.listing} />
        ))}
      </div>
      {active.length === 0 && <p className="text-slate-500 text-center py-10">No favorites yet.</p>}
    </div>
  );
}