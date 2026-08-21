'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, ArrowDown, ArrowLeft, Home, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  conversations: any[];
  currentUserId: string;
  initialActive?: string;
}

export default function ChatWindow({ conversations, currentUserId, initialActive }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(
    initialActive || conversations[0]?._id || null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Mobile: show list or chat
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(
    initialActive ? 'chat' : 'list'
  );
  

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const prevCountRef = useRef(0);

  const activeConversation = conversations.find((c) => c._id === active);
  const other = activeConversation?.participants?.find(
    (p: any) => p._id !== currentUserId
  );

  // Open a conversation (works on both mobile + desktop)
  const openChat = (id: string) => {
    setActive(id);
    setMobileView('chat');
  };

  // Load + poll
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const load = () => {
      fetch(`/api/messages?conversationId=${active}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled && Array.isArray(d)) setMessages(d);
        })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [active]);

  // Smart auto-scroll
  useEffect(() => {
    const grew = messages.length > prevCountRef.current;
    prevCountRef.current = messages.length;
    if (!grew) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      return;
    }
    const last = messages[messages.length - 1];
    if (nearBottomRef.current || last?.sender === currentUserId) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentUserId]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    nearBottomRef.current = dist < 80;
    setShowScrollBtn(dist > 120);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: active, text }),
      });
      if (!res.ok) throw new Error('Failed to send');
      const msg = await res.json();
      setText('');
      setMessages((p) => [...p, msg]);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* ───── Top bar with back/home ───── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Home size={20} />
          </button>
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        {/* Mobile: toggle between list and chat */}
        <button
          onClick={() => setMobileView(mobileView === 'list' ? 'chat' : 'list')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 md:hidden"
        >
          <MessageSquare size={20} />
        </button>
      </div>

      {/* ───── Chat container ───── */}
      <div className="bg-white border rounded-xl overflow-hidden h-[calc(100vh-220px)] md:h-[600px] md:grid md:grid-cols-[280px_1fr]">
        {/* ───── Sidebar / Conversation List ───── */}
        <div
          className={`border-r overflow-y-auto bg-white ${
            mobileView === 'list' ? 'block' : 'hidden'
          } md:block`}
        >
          <div className="px-4 py-3 border-b bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Conversations ({conversations.length})
            </p>
          </div>

          {conversations.map((c) => {
            const person = c.participants?.find((p: any) => p._id !== currentUserId);
            return (
              <button
                key={c._id}
                onClick={() => openChat(c._id)}
                className={`w-full text-left px-4 py-3 border-b flex items-center gap-3 hover:bg-slate-50 transition ${
                  active === c._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  {person?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{person?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {c.lastMessage || c.listing?.title || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}

          {conversations.length === 0 && (
            <div className="text-center py-12 px-4">
              <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Start one by contacting a seller on any listing.
              </p>
            </div>
          )}
        </div>

        {/* ───── Chat Area ───── */}
        <div
          className={`flex flex-col ${
            mobileView === 'chat' ? 'flex' : 'hidden'
          } md:flex`}
        >
          {active && activeConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
                {/* Back arrow (mobile only) */}
                <button
                  onClick={() => setMobileView('list')}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {other?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{other?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {activeConversation?.listing?.title || ''}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="relative flex-1 overflow-hidden">
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="h-full overflow-y-auto px-4 py-3 space-y-2.5 bg-slate-50"
                >
                  {messages.map((m) => {
                    const mine = m.sender === currentUserId;
                    return (
                      <div
                        key={m._id}
                        className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] flex flex-col ${
                            mine ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`px-3.5 py-2 rounded-2xl text-sm ${
                              mine
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white border border-slate-200 rounded-bl-sm'
                            }`}
                          >
                            {m.text}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                            {mine ? 'You' : other?.name} · {time(m.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {showScrollBtn && (
                  <button
                    onClick={() =>
                      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900 text-white text-xs font-medium pl-3 pr-2.5 py-2 rounded-full shadow-lg hover:bg-slate-800"
                  >
                    Latest <ArrowDown size={14} />
                  </button>
                )}
              </div>

              {/* Input */}
              <form onSubmit={send} className="p-3 border-t flex gap-2 bg-white">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-full">
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageSquare size={48} className="text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium">No chat selected</p>
              <p className="text-sm text-slate-400 mt-1">
                Pick a conversation from the left, or start one from a listing page.
              </p>
              <button
                onClick={() => setMobileView('list')}
                className="mt-4 text-sm text-blue-600 font-medium md:hidden"
              >
                View conversations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}