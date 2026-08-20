import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function ListingCard({ listing }: { listing: any }) {
  return (
    <Link href={`/listings/${listing._id}`}
      className="group bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {listing.images?.[0] ? (
          <Image src={listing.images[0]} alt={listing.title} fill
            className="object-cover group-hover:scale-105 transition" sizes="(max-width:768px) 50vw, 25vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-1">{listing.title}</h3>
        <p className="font-bold mt-1">{formatPrice(listing.price)}</p>
        <p className="text-xs text-slate-500 mt-1">{listing.condition} · {listing.location}</p>
      </div>
    </Link>
  );
}