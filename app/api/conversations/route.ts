
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';
import Listing from '@/models/Listing';
import Notification from '@/models/Notification';

/**
 * POST /api/conversations
 * Start (or get existing) a conversation about a listing.
 * Body: { listingId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = (session.user as any).id;

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: 'listingId is required' }, { status: 400 });
    }

    await dbConnect();

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // A seller can't message themselves about their own listing
    if (listing.seller.toString() === uid) {
      return NextResponse.json({ error: 'You cannot message yourself' }, { status: 400 });
    }

    // Reuse an existing conversation for this listing + pair if one exists
    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [uid, listing.seller] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [uid, listing.seller],
        listing: listingId,
      });

      // Notify the seller that someone started a chat
      await Notification.create({
        user: listing.seller,
        type: 'NEW_MESSAGE',
        title: 'New conversation started',
        message: `Someone wants to talk about "${listing.title}"`,
        link: '/dashboard/messages',
      });
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error('POST /api/conversations error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

/**
 * GET /api/conversations
 * List all conversations the current user is part of (most recent first).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = (session.user as any).id;

    await dbConnect();

    const conversations = await Conversation.find({ participants: uid })
      .populate('listing', 'title images price status')
      .populate('participants', 'name avatar verified')
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error('GET /api/conversations error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}