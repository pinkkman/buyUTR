'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, ArrowDown, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  conversations: any[];
  currentUserId: string;
  initialActive?: string;
}

export default function ChatWindow({ conversations, currentUserId, initialActive }: Props) {
  const [active, setActive] = useState<string | null>(initialActive || conversations[0]?._id || null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(initialActive ? 'chat' : 'list');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const prevCountRef = useRef(0);

  const activeConversation = conversations.find((c) => c._id === active);
  const other = activeConversation?.participants?.find((p: any) => p._id !== currentUserId);

  const openChat = (id: string) => { setActive(id); setMobileView('chat'); };

  // Load + poll
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const load = () => {
      fetch(`/api/messages?conversationId=${active}`)
        .then((r) => r.json())
        .then((d) => { if (!cancelled && Array.isArray(d)) setMessages(d); })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 3000);
    return () => { cancelled = true; clearInterval(t); };
  }, [active]);

  // Smooth auto-scroll
  useEffect(() => {
    const grew = messages.length > prevCountRef.current;
    prevCountRef.current = messages.length;
    if (!grew) { bottomRef.current?.scrollIntoView({ behavior: 'auto' }); return; }
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
    setShowScrollBtn(dist > 150);
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
      if (!res.ok) throw new Error('Failed');
      const msg = await res.json();
      setText('');
      setMessages((p) => [...p, msg]);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
    } catch (err: any) { toast.error(err.message); }
  };

  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const Checks = ({ read }: { read: boolean }) => (
    <span className={`ew-checks ${read ? 'ew-checks--read' : ''}`}>✓✓</span>
  );

  return (
    <div className="ew-chat-shell">
      {/* ───── Conversation list ───── */}
      <div className={`ew-list ${mobileView === 'list' ? 'ew-list--visible' : ''}`}>
        <div className="ew-list-header">
          <p>Messages</p>
        </div>
        <div className="ew-list-scroll">
          {conversations.map((c) => {
            const person = c.participants?.find((p: any) => p._id !== currentUserId);
            return (
              <button key={c._id} onClick={() => openChat(c._id)}
                className={`ew-list-item ${active === c._id ? 'ew-list-item--active' : ''}`}>
                <div className="ew-avatar">
                  {person?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="ew-list-item-text">
                  <p className="ew-list-item-name">{person?.name || 'User'}</p>
                  <p className="ew-list-item-sub">{c.lastMessage || c.listing?.title}</p>
                </div>
              </button>
            );
          })}
          {conversations.length === 0 && (
            <div className="ew-empty">
              <MessageSquare size={36} />
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ───── Chat (full-screen on mobile) ───── */}
      <div className={`ew-chat ${mobileView === 'chat' ? 'ew-chat--visible-mobile' : ''}`}>
        {/* Header */}
        <div className="ew-chat-header">
          <button onClick={() => setMobileView('list')} className="ew-back-btn">
            <ArrowLeft size={20} />
          </button>
          <div className="ew-avatar ew-avatar--sm">
            {other?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="ew-chat-header-text">
            <p className="ew-chat-header-name">{other?.name || 'User'}</p>
            <p className="ew-chat-header-sub">{activeConversation?.listing?.title || ''}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="ew-messages-outer">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="ew-messages-scroll"
          >
            {messages.map((m) => {
              const mine = m.sender === currentUserId;
              return (
                <div key={m._id} className={`ew-msg-row ${mine ? 'ew-msg-row--mine' : ''}`}>
                  <div className={`ew-bubble ${mine ? 'ew-bubble--mine' : ''}`}>
                    <p className="ew-bubble-text">{m.text}</p>
                    <span className="ew-bubble-meta">
                      {time(m.createdAt)}
                      {mine && <Checks read={m.read} />}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {showScrollBtn && (
            <button onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="ew-scroll-btn">
              <ArrowDown size={18} />
            </button>
          )}
        </div>

        {/* Input */}
        <form onSubmit={send} className="ew-input-bar">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="ew-input"
          />
          <button className="ew-send-btn">
            <Send size={18} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .ew-chat-shell {
          --ew-bg: #171717;
          --ew-bg-2: #1f1f1f;
          --ew-bg-3: #262626;
          --ew-accent: #b22222;
          --ew-accent-2: #8f1717;
          --ew-text: #fafafa;
          --ew-gray: #a3a3a3;
          --ew-border: #2a2a2a;
          --ew-chat-bg: #0d0d0d;
          --ew-mine-bubble: #2b1414;
          font-family: inherit;
          display: grid;
          background: var(--ew-bg);
          border: 1px solid var(--ew-border);
          border-radius: 14px;
          overflow: hidden;
          height: 100%;
          min-height: 0;
        }
        @media (min-width: 768px) {
          .ew-chat-shell {
            grid-template-columns: 320px 1fr;
            height: 640px;
          }
        }

        /* List */
        .ew-list {
          display: none;
          flex-direction: column;
          min-height: 0;
          background: var(--ew-bg);
          border-right: 1px solid var(--ew-border);
        }
        .ew-list--visible { display: flex; }
        @media (min-width: 768px) {
          .ew-list { display: flex; }
        }
        .ew-list-header {
          padding: 14px 16px;
          background: var(--ew-bg-2);
          border-bottom: 1px solid var(--ew-border);
          position: sticky;
          top: 0;
        }
        .ew-list-header p {
          font-weight: 700;
          font-size: 16px;
          color: var(--ew-text);
          margin: 0;
        }
        .ew-list-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }
        .ew-list-item {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid var(--ew-border);
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ew-list-item:hover { background: var(--ew-bg-2); }
        .ew-list-item--active {
          background: rgba(178, 34, 34, 0.12);
        }
        .ew-list-item-text { min-width: 0; flex: 1; }
        .ew-list-item-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--ew-text);
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ew-list-item-sub {
          font-size: 12px;
          color: var(--ew-gray);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ew-empty {
          text-align: center;
          padding: 56px 16px;
          color: var(--ew-gray);
        }
        .ew-empty p { font-size: 14px; margin-top: 8px; }

        .ew-avatar {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(178, 34, 34, 0.16);
          color: #b22222;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }
        .ew-avatar--sm { width: 36px; height: 36px; font-size: 14px; }

        /* Chat column */
        .ew-chat {
          display: none;
          flex-direction: column;
          min-height: 0;
        }
        .ew-chat--visible-mobile {
          display: flex;
          position: fixed;
          inset: 0;
          z-index: 60;
        }
        @media (min-width: 768px) {
          .ew-chat {
            display: flex;
            position: static;
            z-index: auto;
          }
        }

        .ew-chat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--ew-bg);
          border-bottom: 1px solid var(--ew-border);
        }
        .ew-back-btn {
          padding: 6px;
          border-radius: 999px;
          background: transparent;
          color: var(--ew-text);
          display: flex;
        }
        .ew-back-btn:hover { background: var(--ew-bg-3); }
        @media (min-width: 768px) {
          .ew-back-btn { display: none; }
        }
        .ew-chat-header-text { min-width: 0; }
        .ew-chat-header-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--ew-text);
          margin: 0;
          line-height: 1.2;
        }
        .ew-chat-header-sub {
          font-size: 12px;
          color: var(--ew-gray);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Messages — the fix: every ancestor of the scroll area needs min-height: 0,
           otherwise flex items refuse to shrink and the scrollbar never kicks in. */
        .ew-messages-outer {
          position: relative;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          background: var(--ew-chat-bg);
        }
        .ew-messages-scroll {
          height: 100%;
          min-height: 0;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
        }
        .ew-msg-row { display: flex; justify-content: flex-start; }
        .ew-msg-row--mine { justify-content: flex-end; }
        .ew-bubble {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 8px;
          border-bottom-left-radius: 2px;
          background: var(--ew-bg-2);
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .ew-bubble--mine {
          background: var(--ew-mine-bubble);
          border-radius: 8px;
          border-bottom-right-radius: 2px;
          border-bottom-left-radius: 8px;
        }
        .ew-bubble-text {
          font-size: 15px;
          color: var(--ew-text);
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .ew-bubble-meta {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 2px;
          font-size: 10px;
          color: var(--ew-gray);
          margin-top: 3px;
        }
        .ew-checks { margin-left: 4px; color: #6b6b6b; font-size: 12px; }
        .ew-checks--read { color: #b22222; }

        .ew-scroll-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 10;
          background: var(--ew-bg-2);
          color: var(--ew-gray);
          border: none;
          padding: 10px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        }
        .ew-scroll-btn:hover { background: var(--ew-bg-2); }

        /* Input */
        .ew-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          padding-bottom: calc(8px + env(safe-area-inset-bottom));
          background: var(--ew-bg);
          border-top: 1px solid var(--ew-border);
        }
        .ew-input {
          flex: 1;
          background: var(--ew-bg-3);
          border: none;
          color: var(--ew-text);
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 15px;
          outline: none;
        }
        .ew-input::placeholder { color: var(--ew-gray); }
        .ew-send-btn {
          background: var(--ew-accent);
          color: #ffffff;
          padding: 12px;
          border-radius: 999px;
          display: flex;
          transition: transform 0.1s ease;
        }
        .ew-send-btn:hover { background: var(--ew-accent-2); }
        .ew-send-btn:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}
