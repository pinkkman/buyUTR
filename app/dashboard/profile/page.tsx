import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { BadgeCheck } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();
  await dbConnect();
  const uid = (session!.user as any).id;
  const user = await User.findById(uid).lean();
  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1">
              {user.name}
              {user.verified && <BadgeCheck size={18} className="text-green-600" />}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Branch:</span> {user.branch || '—'}</div>
          <div><span className="text-slate-500">Year:</span> {user.year || '—'}</div>
          <div><span className="text-slate-500">Hostel:</span> {user.hostel || '—'}</div>
          <div><span className="text-slate-500">Roll No:</span> {user.rollNumber || '—'}</div>
        </div>
        {user.verified && (
          <p className="text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2">
            ✓ OUTR Verified
          </p>
        )}
      </div>
    </div>
  );
}