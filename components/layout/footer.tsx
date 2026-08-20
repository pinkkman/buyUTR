export default function Footer() {
  return (
    <footer className="border-t bg-white py-6 text-center text-sm text-slate-500 hidden md:block">
      <p>© {new Date().getFullYear()} OUTR Market — Built for OUTR students.</p>
      <p className="text-xs mt-1">Meet in public. Inspect before paying. Never share OTPs.</p>
    </footer>
  );
}