'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      <h2 className="text-2xl font-semibold mb-2 text-fg">Something went wrong</h2>
      <p className="text-fg-muted mb-6">Please try again.</p>
      <button
        onClick={() => reset()}
        className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-secondary transition"
      >
        Try again
      </button>
    </div>
  );
}