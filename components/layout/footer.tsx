export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 text-center text-sm text-fg-muted hidden md:block">
      <p>© {new Date().getFullYear()} OUTR Market — Built for OUTR students.</p>
      <p className="text-xs mt-1">Meet in public. Inspect before paying. Never share OTPs.</p>
    </footer>
  );
}