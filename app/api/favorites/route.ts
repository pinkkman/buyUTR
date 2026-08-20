import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Favorite from '@/models/Favorite';
import Listing from '@/models/Listing';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const uid = (session.user as any).id;

  const { listingId } = await req.json();
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 });

  await dbConnect();
  const listing = await Listing.findById(listingId);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const existing = await Favorite.findOne({ user: uid, listing: listingId });
  if (existing) {
    await Favorite.deleteOne({ _id: existing._id });
    return NextResponse.json({ favorited: false });
  }

  await Favorite.create({ user: uid, listing: listingId });

  if (listing.seller.toString() !== uid) {
    await Notification.create({
      user: listing.seller,
      type: 'FAVORITED',
      title: 'Listing favorited',
      message: `Someone favorited "${listing.title}"`,
      link: `/listings/${listingId}`,
    });
  }

  return NextResponse.json({ favorited: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const favorites = await Favorite.find({ user: (session.user as any).id }).populate('listing').lean();
  return NextResponse.json(favorites);
}