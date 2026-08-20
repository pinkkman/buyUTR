'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/lib/auth/actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-slate-500 mt-1">Log in to OUTR Market</p>
        </div>
        <form action={formAction} className="space-y-4">
          <input name="email" type="email" required placeholder="Email"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <input name="password" type="password" required placeholder="Password"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button disabled={pending}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:opacity-60">
            {pending ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}