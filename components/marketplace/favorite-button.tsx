'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggle} disabled={loading}
      className={`w-full border py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
        favorited ? 'text-red-600 border-red-200' : ''
      }`}>
      <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
      {favorited ? 'Saved' : 'Save'}
    </button>
  );
}