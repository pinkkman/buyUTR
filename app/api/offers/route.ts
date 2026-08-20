import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Offer from '@/models/Offer';
import Listing from '@/models/Listing';
import Notification from '@/models/Notification';
import { z } from 'zod';

const offerSchema = z.object({
  listingId: z.string().min(1),
  offeredPrice: z.number().min(0),
  message: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const uid = (session.user as any).id;

  const body = await req.json();
  const parsed = offerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  await dbConnect();
  const listing = await Listing.findById(parsed.data.listingId);
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  if (listing.seller.toString() === uid) {
    return NextResponse.json({ error: 'Cannot offer on your own listing' }, { status: 400 });
  }

  const offer = await Offer.create({
    listing: listing._id,
    buyer: uid,
    seller: listing.seller,
    originalPrice: listing.price,
    offeredPrice: parsed.data.offeredPrice,
    message: parsed.data.message,
  });

  await Notification.create({
    user: listing.seller,
    type: 'NEW_OFFER',
    title: 'New offer received',
    message: `Someone offered ₹${parsed.data.offeredPrice} on "${listing.title}"`,
    link: `/listings/${listing._id}`,
  });

  return NextResponse.json(offer, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const uid = (session.user as any).id;
  await dbConnect();
  const offers = await Offer.find({ $or: [{ buyer: uid }, { seller: uid }] })
    .populate('listing')
    .populate('buyer', 'name')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(offers);
}