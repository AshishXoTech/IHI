import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative z-20 border-t-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-secondary)]">
        <p>© {new Date().getFullYear()} IHI Hackathon Engine. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-[var(--organizer-gold-deep)]">Documentation</Link>
          <Link href="#" className="hover:text-[var(--organizer-gold-deep)]">Privacy</Link>
          <Link href="#" className="hover:text-[var(--organizer-gold-deep)]">Terms</Link>
        </div>
      </div>
    </footer>
  );
}