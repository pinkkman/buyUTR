'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CONDITIONS, CAMPUS_LOCATIONS } from '@/lib/constants';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export default function ListingForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) return toast.error('Max 5 images');
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    images.forEach((img) => formData.append('images', img));

    try {
      const res = await fetch('/api/listings', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('Listing published!');
      router.push(`/listings/${data.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-surface border border-border rounded-xl p-6 space-y-5">
      <div>
        <p className="font-medium mb-2 text-fg">Photos (max 5)</p>
        <div className="grid grid-cols-5 gap-2">
          {previews.map((p, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
              <img src={p} className="w-full h-full object-cover" alt="" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                <X size={12} />
              </button>
            </div>
          ))}
          {previews.length < 5 && (
            <label className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer text-fg-muted hover:border-accent transition">
              +
              <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <input name="title" required minLength={5} maxLength={100} placeholder="Title"
        className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />

      <textarea name="description" required minLength={20} rows={4} placeholder="Describe your item…"
        className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />

      <div className="grid grid-cols-2 gap-3">
        <input name="price" type="number" min={0} required placeholder="Price (₹)"
          className="border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
        <select name="category" required className="border border-border bg-background text-fg rounded-lg px-3 py-2.5 text-sm">
          <option value="">Category</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select name="condition" required className="border border-border bg-background text-fg rounded-lg px-3 py-2.5 text-sm">
          <option value="">Condition</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="location" required className="border border-border bg-background text-fg rounded-lg px-3 py-2.5 text-sm">
          <option value="">Location</option>
          {CAMPUS_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="flex gap-5 text-sm text-fg-muted">
        <label className="flex items-center gap-2"><input type="checkbox" name="negotiable" value="true" className="accent-accent" /> Negotiable</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="exchangeAvailable" value="true" className="accent-accent" /> Exchange</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="rentalAvailable" value="true" className="accent-accent" /> Rental</label>
      </div>

      <button disabled={loading}
        className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent-secondary transition disabled:opacity-60">
        {loading ? 'Publishing…' : 'Publish Listing'}
      </button>
    </form>
  );
}