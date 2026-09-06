'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { registerAction } from '@/lib/auth/actions';
import IdCardUpload from '@/components/IdCardUpload';

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);
const [idCard,setIdCard]= useState<File | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fg">Create your account</h1>
          <p className="text-fg-muted mt-1">Join the OUTR student marketplace</p>
        </div>
        <form action={formAction} className="space-y-3">
          <input name="name" required placeholder="Full name"
            className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          <input name="email" type="email" required placeholder="College email"
            className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          <input name="password" type="password" required minLength={8} placeholder="Password (min 8 chars)"
            className="w-full border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input name="rollNumber" placeholder="Roll no."
              className="border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
            <input name="branch" placeholder="Branch"
              className="border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="year" placeholder="Year"
              className="border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
            <input name="hostel" placeholder="Hostel"
              className="border border-border bg-background text-fg placeholder:text-fg-muted rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none" />
          </div>
          {state?.error && <p className="text-sm text-accent">{state.error}</p>}
          <button disabled={pending }
 onClick={async () => {
            if (idCard) {
              const form = new FormData();
              form.append('idCard', idCard);
              await fetch('/api/verify-id/upload', { method: 'POST', body: form }).catch(() => {});
            }
          }}
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent-secondary transition disabled:opacity-60">
            {pending ? 'Creating account…' : 'Sign up'}
          </button>
          <div className="border-t pt-4 mt-4">
  <p className="text-sm font-medium mb-2">Optional: Upload OUTR ID to get verified now</p>
  <IdCardUpload onFile={setIdCard} />
  <p className="text-xs text-slate-500 mt-2">You can skip this and verify later from your profile.</p>
</div>
        </form>
        <p className="text-center text-sm text-fg-muted">
          Have an account?{' '}
          <Link href="/login" className="text-accent font-medium hover:text-accent-secondary hover:underline">Log in</Link>
        </p>
        
      </div>
    </div>
  );
}
