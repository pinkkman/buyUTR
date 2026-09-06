import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { uploadImage } from '@/lib/cloudinary';
import { addVerificationJob } from '@/lib/queue/verificationQueues';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = (session.user as any).id;
  const form = await req.formData();
  const file = form.get('idCard') as File | null;
  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Please upload a valid image' }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 8MB' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageUrl = await uploadImage(buffer, file.type);

  await dbConnect();
  await User.findByIdAndUpdate(uid, {
    idCardUrl: imageUrl,
    idVerificationStatus: 'pending',
    idVerificationReason: undefined,
  });

  await addVerificationJob(uid, imageUrl);

  return NextResponse.json({ status: 'pending', imageUrl });
}