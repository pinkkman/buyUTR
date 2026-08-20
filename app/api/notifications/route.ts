import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const notifications = await Notification.find({ user: (session.user as any).id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();
  return NextResponse.json(notifications);
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  await Notification.updateMany({ user: (session.user as any).id, read: false }, { read: true });
  return NextResponse.json({ success: true });
}