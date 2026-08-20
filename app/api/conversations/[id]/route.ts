import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';

interface Ctx {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/conversations/[id]
 * Get a single conversation (only if you're a participant).
 */
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = (session.user as any).id;
    const { id } = await params;

    await dbConnect();

    const conversation = await Conversation.findById(id)
      .populate('listing', 'title images price status')
      .populate('participants', 'name avatar verified')
      .lean();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // 🔒 Authorization: only participants can view a conversation
    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === uid
    );
    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error('GET /api/conversations/[id] error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}