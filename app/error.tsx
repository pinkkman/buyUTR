'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-slate-600 mb-6">Please try again.</p>
      <button
        onClick={() => reset()}
        className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium"
      >
        Try again
      </button>
    </div>
  );
}