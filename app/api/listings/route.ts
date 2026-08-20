import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import { uploadImage } from '@/lib/cloudinary';
import { createListingSchema } from '@/lib/validations/listing';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const formData = await req.formData();

  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    condition: formData.get('condition'),
    location: formData.get('location'),
    negotiable: formData.get('negotiable') === 'true',
    exchangeAvailable: formData.get('exchangeAvailable') === 'true',
    rentalAvailable: formData.get('rentalAvailable') === 'true',
  };

  const parsed = createListingSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const files = formData.getAll('images') as File[];
  if (files.length > 5) {
    return NextResponse.json({ error: 'Maximum 5 images allowed' }, { status: 400 });
  }

  const images: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, file.type);
    images.push(url);
  }

  const listing = await Listing.create({
    ...parsed.data,
    images,
    seller: (session.user as any).id,
  });

  return NextResponse.json({ id: listing._id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const query: Record<string, unknown> = { status: 'ACTIVE' };
  const q = searchParams.get('q');
  if (q) query.$text = { $search: q };
  const category = searchParams.get('category');
  if (category) query.category = category;

  const listings = await Listing.find(query).sort({ createdAt: -1 }).limit(40).lean();
  return NextResponse.json(listings);
}