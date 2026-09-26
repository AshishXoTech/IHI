export function ProblemSection() {
  return (
    <section id="problem" className="py-24 border-t-2 border-[var(--organizer-border)] max-w-7xl mx-auto px-6 w-full">
      <div className="mb-16">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] block mb-4">● The Problem</span>
        <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase max-w-3xl">
          Hackathon ops shouldn&apos;t be a <span className="text-[var(--organizer-gold-deep)]">fire drill.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { num: "01", title: "Fragmented Tooling", desc: "Forms, docs, chat, and scoring live in four disconnected surfaces.", tags: ["4 Surfaces", "0 Sync"] },
          { num: "02", title: "Opaque Judging", desc: "Rubrics vary judge-to-judge; correction workflows barely exist.", tags: ["No Parity", "No Audit"] },
          { num: "03", title: "Last-Mile Chaos", desc: "Publishing results requires manual reconciliation under time pressure.", tags: ["Manual", "Irreversible"] },
        ].map((item) => (
          <div key={item.num} className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-8 shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-4 block">{item.num}</span>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4">{item.title}</h3>
              <p className="text-[var(--organizer-ink-secondary)] font-medium mb-8">{item.desc}</p>
            </div>
            <div className="border-t-2 border-[var(--organizer-border)] pt-4 flex justify-between items-center text-[10px] font-bold font-mono uppercase tracking-widest text-red-600">
              <span>● {item.tags[0]}</span>
              <span>{item.tags[1]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
