'use client';
import { useRef, useState } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props { onFile: (file: File) => void; currentImage?: string }

export default function IdCardUpload({ onFile, currentImage }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const handleFile = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast.error('Must be an image'); return; }
    if (f.size > 8 * 1024 * 1024) { toast.error('Max 8MB'); return; }
    setPreview(URL.createObjectURL(f));
    onFile(f);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative aspect-[1.6/1] bg-slate-100 rounded-xl overflow-hidden border">
          <img src={preview} alt="ID preview" className="w-full h-full object-cover" />
          <button onClick={() => { setPreview(null); }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="aspect-[1.6/1] border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400 text-sm">
          Upload a clear photo of your OUTR ID card
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 border rounded-lg py-2 text-sm font-medium hover:bg-slate-50">
          <Upload size={16} /> Choose file
        </button>
        <button type="button" onClick={() => camRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 border rounded-lg py-2 text-sm font-medium hover:bg-slate-50">
          <Camera size={16} /> Take photo
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden
        onChange={(e) => handleFile(e.target.files?.[0])} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" hidden
        onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}