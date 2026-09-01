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
      <section className="relative overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-20 text-center">
          {/* Campus badge */}
          <div className="inline-flex items-center gap-1.5 bg-surface border border-border rounded-full px-4 py-1.5 text-xs font-medium text-fg-muted mb-6">
            Exclusive to OUTR, Bhubaneswar
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-fg leading-tight">
            Your campus marketplace.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-fg-muted max-w-2xl mx-auto">
            Buy, sell, trade, and rent within OUTR. Connect directly with students
            in your hostels and academic blocks — no middlemen, no shipping.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-accent-secondary transition"
            >
              <Search size={18} />
              Browse Listings
            </Link>
            <Link
              href="/dashboard/listings/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface border border-border text-fg px-7 py-3.5 rounded-lg font-semibold hover:border-accent transition"
            >
              Sell Something
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-fg-muted">
            <div className="text-center">
              <p className="text-2xl font-bold text-fg">{recentListings.length}+</p>
              <p>Live listings</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-fg">16</p>
              <p>Categories</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-fg">100%</p>
              <p>Campus-only</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CATEGORIES ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-fg">Shop by category</h2>
            <p className="text-fg-muted mt-1">Everything a student needs, all on campus.</p>
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-secondary">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* ───────────────────────── RECENTLY LISTED ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-fg">Recently listed</h2>
            <p className="text-fg-muted mt-1">Fresh finds from your campus.</p>
          </div>
          <Link href="/search?sort=newest" className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-secondary">
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
          <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl">
            <p className="text-fg-muted font-medium">No listings yet.</p>
            <p className="text-fg-muted/70 text-sm mt-1">Be the first to sell something on campus!</p>
            <Link href="/dashboard/listings/new" className="inline-block mt-4 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-secondary transition">
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
              <h2 className="text-2xl md:text-3xl font-bold text-fg flex items-center gap-2">
                <TrendingUp size={26} className="text-accent" />
                Popular near you
              </h2>
              <p className="text-fg-muted mt-1">The most viewed items on campus right now.</p>
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
        <div className="bg-surface border border-border rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-fg">How it works</h2>
            <p className="text-fg-muted mt-1">From finding to trading in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, step: '01', title: 'Find', desc: 'Browse listings from verified OUTR students across campus.' },
              { icon: MessageSquare, step: '02', title: 'Chat', desc: 'Message the seller, negotiate, or make an offer directly.' },
              { icon: MapPin, step: '03', title: 'Meet', desc: 'Meet safely at the library, cafeteria, or your hostel.' },
              { icon: Handshake, step: '04', title: 'Trade', desc: 'Inspect the item and exchange — no shipping, no fees.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-surface-elevated rounded-2xl p-6 hover:bg-accent/5 transition">
                <span className="absolute top-4 right-4 text-3xl font-bold text-border">{item.step}</span>
                <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-accent">
                  <item.icon size={22} />
                </div>
                <h3 className="font-semibold text-fg mt-4">{item.title}</h3>
                <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── SAFETY ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-surface border border-accent/30 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-fg">Campus safety first</h2>
            <p className="text-fg-muted mt-1 text-sm">
              OUTR Market is built on trust. Follow these simple rules to keep every trade safe.
            </p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-fg-muted">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Meet in public campus spots.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Inspect items before paying.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Never share OTPs or passwords.</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Report suspicious listings.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
