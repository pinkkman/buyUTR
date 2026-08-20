'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerAction } from '@/lib/auth/actions';

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-slate-500 mt-1">Join the OUTR student marketplace</p>
        </div>
        <form action={formAction} className="space-y-3">
          <input name="name" required placeholder="Full name"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <input name="email" type="email" required placeholder="College email"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <input name="password" type="password" required minLength={8} placeholder="Password (min 8 chars)"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input name="rollNumber" placeholder="Roll no."
              className="border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="branch" placeholder="Branch"
              className="border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="year" placeholder="Year"
              className="border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="hostel" placeholder="Hostel"
              className="border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button disabled={pending}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:opacity-60">
            {pending ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Have an account?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}