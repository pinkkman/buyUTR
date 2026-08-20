import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import { updateListingSchema } from '@/lib/validations/listing';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await dbConnect();
  const listing = await Listing.findById(id).populate('seller', 'name branch year verified').lean();
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await dbConnect();

  const listing = await Listing.findById(id);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (listing.seller.toString() !== (session.user as any).id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateListingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const updated = await Listing.findByIdAndUpdate(id, parsed.data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await dbConnect();

  const listing = await Listing.findById(id);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (listing.seller.toString() !== (session.user as any).id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await Listing.findByIdAndUpdate(id, { status: 'REMOVED' });
  return NextResponse.json({ success: true });
}