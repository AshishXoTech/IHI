export function FeaturesSection() {
  return (
    <section id="features" className="py-24 border-t-2 border-[var(--organizer-border)] max-w-7xl mx-auto px-6 w-full">
      <div className="mb-16">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] block mb-4">● Platform Features</span>
        <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase max-w-4xl">
          Built for the operator, tuned for the <span className="text-[var(--organizer-gold-deep)]">participant.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-8 shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)]">
          <h3 className="text-3xl font-black font-display uppercase tracking-tight mb-4">GitHub Telemetry</h3>
          <div className="bg-[var(--organizer-ink-primary)] border-2 border-[var(--organizer-ink-primary)] text-green-400 font-mono text-[10px] p-4 shadow-[4px_4px_0px_0px_var(--organizer-gold)]">
            <div className="flex justify-between mb-4 border-b border-gray-700 pb-2"><span>● REPO_SCAN</span><span>FASTAPI</span></div>
            <div className="flex justify-between mb-2"><span>Target: team-alpha/ihi</span><span className="text-emerald-400">PASS</span></div>
            <div className="bg-yellow-900/30 border-l-2 border-[var(--organizer-gold)] p-2 mt-4 text-yellow-300">SUMMARY: Clean original architecture.</div>
          </div>
        </div>

        <div className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-8 shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)]">
          <h3 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Immutable Rubrics</h3>
          <div className="border-2 border-[var(--organizer-ink-primary)] p-4 bg-[var(--organizer-bg)] space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold font-mono uppercase mb-2"><span>Execution</span><span>40% Weight</span></div>
              <div className="h-3 w-full border-2 border-[var(--organizer-ink-primary)] bg-white"><div className="h-full bg-[var(--organizer-gold)] w-[85%] border-r-2 border-[var(--organizer-ink-primary)]" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
