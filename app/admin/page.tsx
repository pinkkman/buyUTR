import dbConnect from '@/lib/db';
import User from '@/models/User';
import Listing from '@/models/Listing';
import Report from '@/models/Report';

export default async function AdminPage() {
  await dbConnect();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, verifiedUsers, totalListings, activeListings, soldListings, pendingReports, usersToday, listingsToday] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ verified: true }),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'ACTIVE' }),
      Listing.countDocuments({ status: 'SOLD' }),
      Report.countDocuments({ status: 'PENDING' }),
      User.countDocuments({ createdAt: { $gte: today } }),
      Listing.countDocuments({ createdAt: { $gte: today } }),
    ]);

  const stats = [
    { label: 'Total Users', value: totalUsers, sub: `+${usersToday} today` },
    { label: 'Verified Users', value: verifiedUsers, sub: '' },
    { label: 'Total Listings', value: totalListings, sub: `+${listingsToday} today` },
    { label: 'Active Listings', value: activeListings, sub: '' },
    { label: 'Sold Listings', value: soldListings, sub: '' },
    { label: 'Pending Reports', value: pendingReports, sub: '' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-fg">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl p-6">
            <p className="text-sm text-fg-muted">{s.label}</p>
            <p className="text-3xl font-bold mt-1 text-fg">{s.value}</p>
            {s.sub && <p className="text-xs text-green-500 mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}