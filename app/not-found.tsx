import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-slate-600 mb-8">This listing may have been sold or removed.</p>
      <Link href="/" className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium">
        Back to Marketplace
      </Link>
    </div>
  );
}