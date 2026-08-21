import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';
import ChatWindow from '@/components/messaging/chat-window';

interface Props { searchParams: Promise<{ c?: string }> }

export default async function MessagesPage({ searchParams }: Props) {
  const session = await auth();
  await dbConnect();
  const uid = (session!.user as any).id;
  const { c } = await searchParams;

  const conversations = await Conversation.find({ participants: uid })
    .populate('listing', 'title images price')
    .populate('participants', 'name avatar')
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean();

  const safe = JSON.parse(JSON.stringify(conversations));
  return <ChatWindow conversations={safe} currentUserId={uid} initialActive={c} />;
}