import Link from 'next/link';
import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import CategoryGrid from '@/components/marketplace/category-grid';
import ListingCard from '@/components/marketplace/listing-card';
import {
  ShieldCheck,
  MessageSquare,
  MapPin,
  Handshake,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default async function HomePage() {
  await dbConnect();

  // Fetch recently listed + most viewed in parallel
  const [recentListings, popularListings] = await Promise.all([
    Listing.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(8).lean(),
    Listing.find({ status: 'ACTIVE' }).sort({ views: -1 }).limit(4).lean(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-20 text-center">
          {/* Campus badge */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-blue-100 rounded-full px-4 py-1.5 text-xs font-medium text-blue-700 shadow-sm mb-6">
            
            Exclusive to OUTR, Bhubaneswar
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Your campus marketplace.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Buy, sell, trade, and rent within OUTR. Connect directly with students
            in your hostels and academic blocks — no middlemen, no shipping.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
            >
              <Search size={18} />
              Browse Listings
            </Link>
            <Link
              href="/dashboard/listings/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-7 py-3.5 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition"
            >
              Sell Something
              <ArrowRight size={18} />
            </Link>
          </div>
/
          {/* Quick stats */}
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{recentListings.length}+</p>
              <p>Live listings</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">16</p>
              <p>Categories</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p>Campus-only</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CATEGORIES ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop by category</h2>
            <p className="text-slate-500 mt-1">Everything a student needs, all on campus.</p>
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* ───────────────────────── RECENTLY LISTED ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Recently listed</h2>
            <p className="text-slate-500 mt-1">Fresh finds from your campus.</p>
          </div>
          <Link href="/search?sort=newest" className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            See all <ArrowRight size={16} />
          </Link>
        </div>

        {recentListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentListings.map((l) => (
              <ListingCard key={l._id.toString()} listing={l} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed rounded-2xl">
            <p className="text-slate-500 font-medium">No listings yet.</p>
            <p className="text-slate-400 text-sm mt-1">Be the first to sell something on campus!</p>
            <Link href="/dashboard/listings/new" className="inline-block mt-4 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              Post a listing
            </Link>
          </div>
        )}
      </section>

      {/* ───────────────────────── POPULAR NEAR YOU ───────────────────────── */}
      {popularListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={26} className="text-blue-600" />
                Popular near you
              </h2>
              <p className="text-slate-500 mt-1">The most viewed items on campus right now.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularListings.map((l) => (
              <ListingCard key={l._id.toString()} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">How it works</h2>
            <p className="text-slate-500 mt-1">From finding to trading in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, step: '01', title: 'Find', desc: 'Browse listings from verified OUTR students across campus.' },
              { icon: MessageSquare, step: '02', title: 'Chat', desc: 'Message the seller, negotiate, or make an offer directly.' },
              { icon: MapPin, step: '03', title: 'Meet', desc: 'Meet safely at the library, cafeteria, or your hostel.' },
              { icon: Handshake, step: '04', title: 'Trade', desc: 'Inspect the item and exchange — no shipping, no fees.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-slate-50 rounded-2xl p-6 hover:bg-blue-50/50 transition">
                <span className="absolute top-4 right-4 text-3xl font-bold text-slate-200">{item.step}</span>
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                  <item.icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-900 mt-4">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── SAFETY ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-900">Campus safety first</h2>
            <p className="text-amber-800/80 mt-1 text-sm">
              OUTR Market is built on trust. Follow these simple rules to keep every trade safe.
            </p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-amber-800">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Meet in public campus spots.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Inspect items before paying.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Never share OTPs or passwords.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Report suspicious listings.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}