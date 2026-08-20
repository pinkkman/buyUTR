import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';
import ChatWindow from '@/components/messaging/chat-window';

export default async function MessagesPage() {
  const session = await auth();
  await dbConnect();
  const uid = (session!.user as any).id;

  const conversations = await Conversation.find({ participants: uid })
    .populate('listing', 'title images price')
    .populate('participants', 'name')
    .sort({ lastMessageAt: -1 })
    .lean();

  return <ChatWindow conversations={conversations as any} currentUserId={uid} />;
}