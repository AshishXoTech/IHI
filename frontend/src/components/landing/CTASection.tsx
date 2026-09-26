import Link from "next/link";

export function CTASection() {
  return (
    <footer className="relative border-t-4 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] overflow-hidden">
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(circle, var(--organizer-ink-primary) 2px, transparent 2px)`, backgroundSize: "20px 20px" }} />
           
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center flex flex-col items-center">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest bg-[var(--organizer-ink-primary)] text-[var(--organizer-gold)] px-4 py-2 mb-8 inline-block shadow-[4px_4px_0px_0px_#FFFFFF]">
          ● THE HACKATHON INTELLIGENCE ENGINE
        </span>
        <h2 className="text-5xl sm:text-7xl font-black font-display tracking-tighter uppercase mb-10">
          One living system —<br/> From idea to <span className="text-white drop-shadow-[2px_2px_0px_var(--organizer-ink-primary)]">podium.</span>
        </h2>
        <div className="flex gap-4">
           <Link
              href="/signup"
              className="bg-white text-[var(--organizer-ink-primary)] border-4 border-[var(--organizer-ink-primary)] px-10 py-5 font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_var(--organizer-ink-primary)] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_var(--organizer-ink-primary)] transition-all"
            >
              Create Event
            </Link>
        </div>
      </div>
    </footer>
  );
}