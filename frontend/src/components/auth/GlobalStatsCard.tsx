/**
 * Right-rail stats panel for Signup — black/white/gold only.
 * Numbers use JetBrains Mono (literal measurements).
 */
export function GlobalStatsCard() {
  return (
    <aside
      aria-label="Platform Impact"
      className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h3 className="font-display text-2xl font-bold tracking-tight text-black mb-2">
        Powering ambitious hackathons.
      </h3>
      <p className="font-body text-sm text-gray-500 mb-8">
        Join a global network of creators, builders, and organizers orchestrating the future of technology.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-mono text-3xl font-black text-black tabular-nums">100k+</p>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">Developers</p>
        </div>
        <div>
          <p className="font-mono text-3xl font-black text-black tabular-nums">500+</p>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">Annual Events</p>
        </div>
        
        <div className="col-span-2 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-black text-gold">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 3L3 7l7 4 7-4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M3 13l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-body text-sm font-bold text-black">Deterministic Engine</p>
              <p className="font-body text-xs text-gray-500">Every state transition is verified.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}