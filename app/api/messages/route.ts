import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import Notification from '@/models/Notification';
import { z } from 'zod';

const messageSchema = z.object({
  conversationId: z.string().min(1),
  text: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const uid = (session.user as any).id;

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  await dbConnect();
  const conversation = await Conversation.findById(parsed.data.conversationId);
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!conversation.participants.map((p: any) => p.toString()).includes(uid)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: uid,
    text: parsed.data.text,
  });

  await Conversation.findByIdAndUpdate(conversation._id, {
    lastMessage: parsed.data.text,
    lastMessageAt: new Date(),
  });

  const otherParticipant = conversation.participants.find((p: any) => p.toString() !== uid);
  if (otherParticipant) {
    await Notification.create({
      user: otherParticipant,
      type: 'NEW_MESSAGE',
      title: 'New message',
      message: parsed.data.text.slice(0, 80),
      link: `/dashboard/messages`,
    });
  }

  return NextResponse.json(message, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const uid = (session.user as any).id;

  const conversationId = req.nextUrl.searchParams.get('conversationId');
  if (!conversationId) return NextResponse.json({ error: 'conversationId required' }, { status: 400 });

  await dbConnect();
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!conversation.participants.map((p: any) => p.toString()).includes(uid)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .lean();

  await Message.updateMany({ conversation: conversationId, sender: { $ne: uid } }, { read: true });

  return NextResponse.json(messages);
}