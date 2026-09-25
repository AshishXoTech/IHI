export function LogoStrip() {
  const names = ['MIT', 'Stanford', 'Berkeley', 'ETH Zürich', 'IIT Bombay', 'NUS'];
  return (
    <section className="py-16 border-y border-ihi-border-subtle bg-ihi-surface/40">
      <div className="max-w-container mx-auto px-6">
        <p className="text-label text-center text-ihi-text-tertiary mb-8">Trusted by innovation leaders worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {names.map(n => (
            <span key={n} className="text-ihi-text-tertiary font-display font-semibold text-lg tracking-wide opacity-60 hover:opacity-100 transition-opacity">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}