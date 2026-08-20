'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ContactSellerButton({ listingId, sellerId }: { listingId: string; sellerId?: string }) {
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
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push(`/dashboard/messages?c=${data._id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={startChat} disabled={loading}
      className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:opacity-60">
      {loading ? 'Opening chat…' : 'Contact Seller'}
    </button>
  );
}