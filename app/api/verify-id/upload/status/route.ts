import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const user = await User.findById((session.user as any).id).select(
    'idVerificationStatus idVerificationReason idCardUrl verified'
  ).lean();

  return NextResponse.json(user);
}