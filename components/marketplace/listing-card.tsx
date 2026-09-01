import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function ListingCard({ listing }: { listing: any }) {
  return (
    <Link href={`/listings/${listing._id}`}
      className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent active:scale-[0.98] transition duration-200 ease-out">
      <div className="aspect-square bg-surface-elevated relative overflow-hidden">
        {listing.images?.[0] ? (
          <Image src={listing.images[0]} alt={listing.title} fill
            className="object-cover group-hover:scale-105 transition duration-300 ease-out" sizes="(max-width:768px) 50vw, 25vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-fg-muted text-sm">No image</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-1 text-fg">{listing.title}</h3>
        <p className="font-bold mt-1 text-accent">{formatPrice(listing.price)}</p>
        <p className="text-xs text-fg-muted mt-1">{listing.condition} · {listing.location}</p>
      </div>
    </Link>
  );
}