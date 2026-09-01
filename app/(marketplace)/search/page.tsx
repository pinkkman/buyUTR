import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import ListingCard from '@/components/marketplace/listing-card';
import SearchFilters from '@/components/marketplace/search-filters';
import { CATEGORIES, CONDITIONS, CAMPUS_LOCATIONS } from '@/lib/constants';
import { SortOrder } from 'mongoose';

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    condition?: string;
    location?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  await dbConnect();

  const query: Record<string, unknown> = { status: 'ACTIVE' };
  if (params.q) query.$text = { $search: params.q };
  if (params.category) query.category = params.category;
  if (params.condition) query.condition = params.condition;
  if (params.location) query.location = params.location;
  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) (query.price as any).$gte = Number(params.minPrice);
    if (params.maxPrice) (query.price as any).$lte = Number(params.maxPrice);
  }

  const sort :Record<string,SortOrder> =
    params.sort === 'price_asc'
      ? { price: 1 }
      : params.sort === 'price_desc'
      ? { price: -1 }
      : { createdAt: -1 };

  const listings = await Listing.find(query).sort(sort).limit(40).lean();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      <SearchFilters
        categories={CATEGORIES}
        conditions={CONDITIONS}
        locations={CAMPUS_LOCATIONS}
        current={params}
      />
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-fg">
          {params.q ? `Results for "${params.q}"` : 'All Listings'}
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map((l) => (
            <ListingCard key={l._id.toString()} listing={l} />
          ))}
        </div>
        {listings.length === 0 && (
          <p className="text-center text-fg-muted py-12">No listings found.</p>
        )}
      </div>
    </div>
  );
}