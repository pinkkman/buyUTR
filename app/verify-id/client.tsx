'use client';
import { useEffect, useState } from 'react';
import { BadgeCheck, Clock, XCircle, ShieldOff, Loader2 } from 'lucide-react';
import IdCardUpload from '@/components/IdCardUpload';
import { toast } from 'sonner';

const STATUS = {
  none: { icon: ShieldOff, color: 'text-slate-500', label: 'Not submitted' },
  pending: { icon: Clock, color: 'text-amber-600', label: 'Under review' },
  verified: { icon: BadgeCheck, color: 'text-green-600', label: 'Verified' },
  rejected: { icon: XCircle, color: 'text-red-600', label: 'Rejected' },
} as const;

export default function VerifyIdClient() {
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/verify-id/status').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  // Poll while pending
  useEffect(() => {
    if (data?.idVerificationStatus !== 'pending') return;
    const t = setInterval(() => {
      fetch('/api/verify-id/status').then((r) => r.json()).then(setData).catch(() => {});
    }, 4000);
    return () => clearInterval(t);
  }, [data?.idVerificationStatus]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select an image'); return; }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('idCard', file);
      const res = await fetch('/api/verify-id/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      toast.success('ID submitted! We\'ll email you the result.');
      setData({ ...data, idVerificationStatus: 'pending' });
      setFile(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cfg = STATUS[(data?.idVerificationStatus as keyof typeof STATUS) || 'none'];
  const Icon = cfg.icon;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verify your OUTR ID</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload a clear photo of your university ID to unlock full access.
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center ${cfg.color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p className={`text-sm ${cfg.color}`}>{cfg.label}</p>
          </div>
        </div>

        {data?.idVerificationReason && (
          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
            <p className="font-medium text-xs text-slate-500 uppercase mb-1">Reason</p>
            {data.idVerificationReason}
          </div>
        )}

        {data?.idCardUrl && (
          <div className="aspect-[1.6/1] bg-slate-100 rounded-xl overflow-hidden border">
            <img src={data.idCardUrl} alt="Your ID" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {data?.idVerificationStatus !== 'verified' && (
        <form onSubmit={submit} className="bg-white border rounded-2xl p-6 space-y-4">
          <p className="font-semibold">
            {data?.idVerificationStatus === 'none' ? 'Upload your ID card' : 'Re-submit a clearer photo'}
          </p>
          <IdCardUpload onFile={setFile} currentImage={data?.idCardUrl} />
          <button disabled={!file || loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Submitting…' : 'Submit for verification'}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Make sure the entire card is visible, well-lit, and not a photocopy.
          </p>
        </form>
      )}
    </div>
  );
}