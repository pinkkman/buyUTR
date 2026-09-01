'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  id: string;
  status: string;
}

export default function ListingRowActions({ id, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const update = async (method: string, body?: any) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success('Listing updated');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = () => {
    if (confirm('Remove this listing? This can be undone by an admin.')) {
      update('DELETE');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {status === 'ACTIVE' ? (
        <button
          disabled={busy}
          onClick={() => update('PATCH', { status: 'SOLD' })}
          title="Mark as sold"
          className="p-2 rounded-lg text-fg-muted hover:bg-surface-elevated hover:text-green-500 disabled:opacity-50 transition"
        >
          <CheckCircle size={17} />
        </button>
      ) : (
        status !== 'REMOVED' && (
          <button
            disabled={busy}
            onClick={() => update('PATCH', { status: 'ACTIVE' })}
            title="Reactivate"
            className="p-2 rounded-lg text-fg-muted hover:bg-surface-elevated hover:text-accent disabled:opacity-50 transition"
          >
            <RotateCcw size={17} />
          </button>
        )
      )}

      <button
        disabled={busy}
        onClick={remove}
        title="Remove listing"
        className="p-2 rounded-lg text-fg-muted hover:bg-surface-elevated hover:text-accent disabled:opacity-50 transition"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}