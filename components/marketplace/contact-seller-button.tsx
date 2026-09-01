'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactSellerButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startChat = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();

      if (res.status === 401) {
        toast.error('Log in to message sellers');
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to start chat');

      router.push(`/dashboard/messages?c=${data._id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startChat}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-secondary transition disabled:opacity-60"
    >
      <MessageCircle size={18} />
      {loading ? 'Opening chat…' : 'Contact Seller'}
    </button>
  );
}