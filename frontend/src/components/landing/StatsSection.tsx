const STATS = [
  { value: '10K+', label: 'Hackers empowered' },
  { value: '500+', label: 'Events orchestrated' },
  { value: '99.98%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'Dashboard latency' },
];

export function StatsSection() {
  return (
    <section className="py-24">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="p-8 rounded-2xl bg-gradient-to-br from-ihi-surface to-ihi-bg border border-ihi-border-subtle text-center">
              <p className="text-display-lg font-display font-bold ihi-gradient-text mb-2 tabular-nums">{s.value}</p>
              <p className="text-body-sm text-ihi-text-tertiary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}