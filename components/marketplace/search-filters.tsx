'use client';

import { useRouter } from 'next/navigation';

interface Props {
  categories: { id: string; name: string }[];
  conditions: readonly string[];
  locations: readonly string[];
  current: Record<string, string | undefined>;
}

export default function SearchFilters({ categories, conditions, locations, current }: Props) {
  const router = useRouter();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries(current).forEach(([k, v]) => {
      if (v && k !== key) params.set(k, v);
    });
    if (value) params.set(key, value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="hidden md:block space-y-5">
      <h2 className="font-bold text-fg">Filters</h2>
      <div>
        <label className="text-sm font-medium block mb-1 text-fg-muted">Category</label>
        <select value={current.category || ''} onChange={(e) => update('category', e.target.value)}
          className="w-full border border-border bg-surface text-fg rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">All</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1 text-fg-muted">Condition</label>
        <select value={current.condition || ''} onChange={(e) => update('condition', e.target.value)}
          className="w-full border border-border bg-surface text-fg rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">Any</option>
          {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1 text-fg-muted">Location</label>
        <select value={current.location || ''} onChange={(e) => update('location', e.target.value)}
          className="w-full border border-border bg-surface text-fg rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">Anywhere</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1 text-fg-muted">Sort</label>
        <select value={current.sort || ''} onChange={(e) => update('sort', e.target.value)}
          className="w-full border border-border bg-surface text-fg rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>
    </aside>
  );
}