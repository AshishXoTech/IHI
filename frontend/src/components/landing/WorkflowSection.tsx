const STEPS = [
  { n: '01', title: 'Configure', desc: 'Spin up your event with AI-guided setup. Rubrics, tracks, judges — all templated.' },
  { n: '02', title: 'Onboard', desc: 'Participants register, form teams, and get briefed by an AI mentor tailored to your event.' },
  { n: '03', title: 'Run', desc: 'Real-time dashboards keep organizers ahead of every risk. Judges score with confidence.' },
  { n: '04', title: 'Publish', desc: 'Automated readiness gates ensure results are complete, calibrated, and defensible.' },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-32 border-t border-ihi-border-subtle">
      <div className="max-w-container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-label text-ihi-secondary mb-3">Workflow</p>
          <h2 className="text-display-lg font-display font-bold mb-4">
            Four stages.<br /><span className="ihi-gradient-text">Zero friction.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-ihi-surface border border-ihi-border-subtle hover:border-ihi-primary/30 transition-colors">
              <div className="font-mono text-sm text-ihi-secondary mb-4">{s.n}</div>
              <h3 className="text-heading-sm font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-body-md text-ihi-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}