export function SolutionSection() {
  return (
    <section id="solution" className="py-24 border-t-2 border-[var(--organizer-border)] max-w-7xl mx-auto px-6 w-full">
      <div className="mb-16">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] block mb-4">● The Solution</span>
        <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase max-w-4xl">
          One deterministic pipeline, <span className="text-[var(--organizer-gold-deep)]">end to end.</span>
        </h2>
      </div>
      <div className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-2 sm:p-8 shadow-[8px_8px_0px_0px_var(--organizer-gold)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[var(--organizer-border)] pb-4 mb-8">
          <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-primary)]">● IHI_PIPELINE // EVENT_STATE_MACHINE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { step: "01", title: "Registration", sub: "Eligibility Gate", status: "PASS", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
            { step: "02", title: "Team Form", sub: "Skill Matcher", status: "PASS", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
            { step: "03", title: "Submission", sub: "Atomic Count", status: "VERIFIED", color: "text-[var(--organizer-gold-deep)] bg-[var(--organizer-gold-light)] border-[var(--organizer-gold)] scale-105 shadow-[4px_4px_0px_0px_var(--organizer-ink-primary)] z-10" },
            { step: "04", title: "AI Briefing", sub: "Repo Scanner", status: "WAITING", color: "text-[var(--organizer-ink-muted)] bg-gray-50 border-[var(--organizer-border)] opacity-70" },
            { step: "05", title: "Judging", sub: "Rubric Parity", status: "LOCKED", color: "text-[var(--organizer-ink-muted)] bg-gray-50 border-[var(--organizer-border)] opacity-70" },
            { step: "06", title: "Publish", sub: "Readiness", status: "LOCKED", color: "text-[var(--organizer-ink-muted)] bg-gray-50 border-[var(--organizer-border)] opacity-70" },
          ].map((stage) => (
            <div key={stage.step} className={`border-2 p-4 flex flex-col justify-between h-32 transition-transform ${stage.color}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest">{stage.step}</span>
                <span className="text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-1 border border-current bg-white">{stage.status}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight text-[var(--organizer-ink-primary)]">{stage.title}</h4>
                <p className="text-[10px] font-mono mt-1 text-[var(--organizer-ink-muted)]">{stage.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
