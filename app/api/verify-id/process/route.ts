import { NextResponse } from 'next/server';
import { startWorker } from '@/lib/queue/worker';

// Call this endpoint (manually or via cron) to drain the queue on serverless
export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.NEXTAUTH_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  startWorker();
  // Give worker 25s to process (Vercel hobby limit is 10s, Pro is 60s)
  await new Promise((r) => setTimeout(r, 25000));
  return NextResponse.json({ ok: true });
}