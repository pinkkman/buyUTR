import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {CATEGORIES.map((c) => (
        <Link key={c.id} href={`/search?category=${c.id}`}
          className="bg-white border rounded-xl p-4 text-center hover:border-blue-400 hover:shadow-sm transition">
          <p className="text-sm font-medium">{c.name}</p>
        </Link>
      ))}
    </div>
  );
}