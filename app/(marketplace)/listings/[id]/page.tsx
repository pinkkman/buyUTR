import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, MapPin, Eye, Flag, ChevronLeft, Clock } from 'lucide-react';
import ContactSellerButton from '@/components/marketplace/contact-seller-button';
import FavoriteButton from '@/components/marketplace/favorite-button';

interface Props { params: Promise<{ id: string }> }

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  await dbConnect();

  const listing = await Listing.findById(id)
    .populate('seller', 'name branch year verified avatar')
    .lean();

  if (!listing || listing.status === 'REMOVED') notFound();
  await Listing.updateOne({ _id: id }, { $inc: { views: 1 } });
  const seller = listing.seller as any;

  return (
    <div className="max-w-6xl mx-auto pb-28 md:pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-0 py-2">
        <Link href="/search" className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <ChevronLeft size={18} /> Browse
        </Link>
        <button className="flex items-center gap-1 text-sm text-slate-500"><Flag size={14} /> Report</button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 px-0 md:px-4">
        {/* Left */}
        <div className="space-y-5">
          {/* Gallery */}
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {listing.images?.length ? (
              listing.images.map((img: string, i: number) => (
                <div key={i} className="relative w-full aspect-square md:aspect-video shrink-0 snap-center bg-slate-100 md:rounded-xl overflow-hidden">
                  <Image src={img} alt={listing.title} fill className="object-cover" priority={i === 0} />
                </div>
              ))
            ) : (
              <div className="w-full aspect-square md:aspect-video bg-slate-100 flex items-center justify-center text-slate-400">No image</div>
            )}
          </div>

          {/* Title/price */}
          <div className="px-4 md:px-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full">{listing.condition}</span>
              {listing.negotiable && <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Negotiable</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-snug">{listing.title}</h1>
            <p className="text-2xl md:text-3xl font-bold mt-1">{formatPrice(listing.price)}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-3">
              <span className="flex items-center gap-1"><MapPin size={15} /> {listing.location}</span>
              <span className="flex items-center gap-1"><Eye size={15} /> {listing.views}</span>
              <span className="flex items-center gap-1"><Clock size={15} /> {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Seller */}
          <div className="mx-4 md:mx-0 bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0">
              {seller?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold flex items-center gap-1">
                {seller?.name} {seller?.verified && <BadgeCheck size={16} className="text-green-600" />}
              </p>
              <p className="text-xs text-slate-500">{seller?.branch} · {seller?.year}</p>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 md:px-0">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="whitespace-pre-wrap text-slate-700 text-[15px] leading-relaxed">{listing.description}</p>
          </div>

          {/* Safety */}
          <div className="mx-4 md:mx-0 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
            <p className="font-semibold">Safety tips</p>
            <p>• Meet in a public campus spot.</p>
            <p>• Inspect before paying.</p>
            <p>• Never share OTPs.</p>
          </div>
        </div>

        {/* Right (desktop only) */}
        <div className="hidden lg:block">
          <div className="bg-white border rounded-xl p-6 sticky top-24 space-y-3">
            <p className="font-semibold">Interested in this item?</p>
            <ContactSellerButton listingId={listing._id.toString()} />
            <FavoriteButton listingId={listing._id.toString()} />
          </div>
        </div>
      </div>

      {/* ✅ Mobile sticky action bar — ALWAYS visible */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t px-4 py-3 flex gap-3 lg:hidden">
        <div className="flex-1"><FavoriteButton listingId={listing._id.toString()} /></div>
        <div className="flex-[2]"><ContactSellerButton listingId={listing._id.toString()} /></div>
      </div>
    </div>
  );
}