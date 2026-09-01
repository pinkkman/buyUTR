'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/lib/auth/actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fg">Welcome back</h1>
          <p className="text-fg-muted mt-1">Log in to buy<span className="text-accent">UTR</span></p>
        </div>
        <form action={formAction} className="space-y-4">
          <input name="email" type="email" required placeholder="Email"
            className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          <input name="password" type="password" required placeholder="Password"
            className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          {state?.error && <p className="text-sm text-accent">{state.error}</p>}
          <button disabled={pending}
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent-secondary transition disabled:opacity-60">
            {pending ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="text-center text-sm text-fg-muted">
          New here?{' '}
          <Link href="/register" className="text-accent font-medium hover:text-accent-secondary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
