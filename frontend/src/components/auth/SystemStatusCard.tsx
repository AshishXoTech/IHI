/**
 * Right-rail status panel — black/white/gold only.
 * Numbers use JetBrains Mono (literal measurements).
 */
export function SystemStatusCard() {
  return (
    <aside
      aria-label="System status"
      className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            System Online
          </span>
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-gray-400">
          IHI CORE NODE
        </span>
      </div>

      <div className="my-5 h-px w-full bg-gray-200" />

      <dl className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-body text-sm text-gray-500">Identity Verification</dt>
          <dd className="font-display text-sm font-bold text-black">Secured</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-body text-sm text-gray-500">Active Sessions</dt>
          <dd className="font-mono text-sm font-semibold tabular-nums text-black">
            2,408
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-body text-sm text-gray-500">Network Latency</dt>
          <dd className="font-mono text-sm font-semibold tabular-nums text-black">
            14ms
          </dd>
        </div>
      </dl>

      <div className="mt-5 h-px w-full bg-gray-200" />

      <p className="mt-4 font-body text-xs leading-relaxed text-gray-400">
        Sessions are sealed with httpOnly JWT cookies. Judges enter via
        single-use magic links scoped to one event.
      </p>
    </aside>
  );
}