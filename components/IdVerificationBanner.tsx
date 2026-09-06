'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, AlertCircle, Clock, X } from 'lucide-react';
import Link from 'next/link';

export default function IdVerificationBanner() {
  const [data, setData] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/verify-id/status').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data || data.idVerificationStatus === 'verified' || dismissed) return null;

  const config = {
    none: { icon: ShieldCheck, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800',
      msg: 'Verify your OUTR ID to unlock messaging and full access.', btn: 'Verify Now' },
    pending: { icon: Clock, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800',
      msg: 'Your ID is being reviewed. This usually takes a few minutes.', btn: null },
    rejected: { icon: AlertCircle, bg: 'bg-red-50 border-red-200', text: 'text-red-800',
      msg: `ID rejected: ${data.idVerificationReason || 'Please re-submit.'}`, btn: 'Re-submit' },
  }[data.idVerificationStatus];
  
  const Icon = config.icon;

  return (
    <div className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${config.bg} ${config.text}`}>
      <Icon size={20} className="shrink-0" />
      <p className="flex-1 text-sm">{config.msg}</p>
      {config.btn && (
        <Link href="/verify-id" className="text-sm font-semibold underline whitespace-nowrap">
          {config.btn}
        </Link>
      )}
      <button onClick={() => setDismissed(true)} className="opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}