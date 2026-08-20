'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  conversations: any[];
  currentUserId: string;
}

export default function ChatWindow({ conversations, currentUserId }: Props) {
  const [active, setActive] = useState<string | null>(conversations[0]?._id || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // The conversation currently open + the OTHER person in it
  const activeConversation = conversations.find((c) => c._id === active);
  const other = activeConversation?.participants?.find(
    (p: any) => p._id !== currentUserId
  );

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const load = () => {
      fetch(`/api/messages?conversationId=${active}`)
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled && Array.isArray(data)) setMessages(data);
        })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: active, text }),
      });
      if (!res.ok) throw new Error('Failed to send');
      const msg = await res.json();
      setText('');
      setMessages((prev) => [...prev, msg]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white border rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] h-[600px]">
      {/* ───────── Sidebar ───────── */}
      <div className="border-r overflow-y-auto hidden md:block">
        {conversations.map((c) => {
          const person = c.participants.find((p: any) => p._id !== currentUserId);
          return (
            <button
              key={c._id}
              onClick={() => setActive(c._id)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-slate-50 ${
                active === c._id ? 'bg-blue-50' : ''
              }`}
            >
              <p className="font-medium text-sm truncate">{person?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{c.listing?.title}</p>
              {c.lastMessage && (
                <p className="text-xs text-slate-400 truncate mt-1">{c.lastMessage}</p>
              )}
            </button>
          );
        })}
        {conversations.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No conversations yet</p>
        )}
      </div>

      {/* ───────── Chat area ───────── */}
      <div className="flex flex-col">
        {/* Header: who you're talking to */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {other?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm">{other?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">
              {activeConversation?.listing?.title || ''}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m) => {
            const mine = m.sender === currentUserId;
            return (
              <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                  {/* Sender label */}
                  <span className="text-[11px] text-slate-400 mb-0.5 px-1">
                    {mine ? 'You' : other?.name || 'Them'}
                  </span>

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      mine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className="p-3 border-t flex gap-2 bg-white">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled={loading}
            className="bg-slate-900 text-white px-4 py-2 rounded-full disabled:opacity-60"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}