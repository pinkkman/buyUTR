import { auth } from '@/lib/auth';
import { logoutAction } from '@/lib/auth/actions';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Listing from '@/models/Listing';
import Link from 'next/link';
import { BadgeCheck, LogOut, LogIn, UserPlus, MapPin, Calendar, ShoppingBag, CheckCircle } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();

  /* ───────── Not logged in → show Login / Signup ───────── */
  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto bg-surface border border-border rounded-2xl p-8 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-accent/15 text-accent flex items-center justify-center">
          <UserPlus size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-fg">Your Profile</h1>
          <p className="text-fg-muted mt-1">Log in or create an account to view your profile.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/login"
            className="inline-flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-secondary transition">
            <LogIn size={18} /> Log in
          </Link>
          <Link href="/register"
            className="inline-flex items-center justify-center gap-2 border border-border text-fg py-3 rounded-xl font-semibold hover:border-accent transition">
            <UserPlus size={18} /> Sign up
          </Link>
        </div>
      </div>
    );
  }

  /* ───────── Logged in → profile + Logout ───────── */
  await dbConnect();
  const uid = (session.user as any).id;
  const user = await User.findById(uid).lean();
  if (!user) return null;

  const [active, sold] = await Promise.all([
    Listing.countDocuments({ seller: uid, status: 'ACTIVE' }),
    Listing.countDocuments({ seller: uid, status: 'SOLD' }),
  ]);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-fg">Profile</h1>

      {/* Profile card */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/15 text-accent flex items-center justify-center text-2xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-lg flex items-center gap-1.5 text-fg">
              {user.name}
              {user.verified && <BadgeCheck size={18} className="text-accent" />}
            </p>
            <p className="text-sm text-fg-muted truncate">{user.email}</p>
          </div>
        </div>

        {user.verified && (
          <p className="text-sm bg-accent/10 text-accent border border-accent/30 rounded-lg px-3 py-2 flex items-center gap-1.5">
            <BadgeCheck size={15} /> OUTR Verified
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info icon={MapPin} label="Hostel" value={user.hostel} />
          <Info icon={Calendar} label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
          <Info icon={ShoppingBag} label="Active" value={String(active)} />
          <Info icon={CheckCircle} label="Sold" value={String(sold)} />
        </div>
      </div>

      {/* Logout button */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-secondary transition"
        >
          <LogOut size={18} /> Log out
        </button>
      </form>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2 bg-surface-elevated rounded-lg px-3 py-2">
      <Icon size={15} className="text-fg-muted shrink-0" />
      <span className="text-fg-muted">{label}:</span>
      <span className="font-medium truncate text-fg">{value || '—'}</span>
    </div>
  );
}
