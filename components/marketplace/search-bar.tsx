'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={submit} className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cycles, books, laptops…"
        className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-surface text-fg placeholder:text-fg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
      />
    </form>
  );
}