/**
 * Decorative IHI wordmark — brand colors ONLY allowed here (C1 lock).
 * aria-hidden; pointer-events none; very low opacity.
 */
export function IhiWordmarkBg({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {/* Soft grid like MLH */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(10,10,10,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,10,10,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Oversized I H I */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:gap-4">
        <span
          className="font-display text-[min(42vw,280px)] font-bold leading-none tracking-tighter"
          style={{ color: "rgba(228, 87, 76, 0.09)" }} /* brand-red */
        >
          I
        </span>
        <span
          className="font-display text-[min(42vw,280px)] font-bold leading-none tracking-tighter"
          style={{ color: "rgba(47, 182, 124, 0.09)" }} /* brand-green */
        >
          H
        </span>
        <span
          className="font-display text-[min(42vw,280px)] font-bold leading-none tracking-tighter"
          style={{ color: "rgba(62, 111, 243, 0.09)" }} /* brand-blue */
        >
          I
        </span>
      </div>
    </div>
  );
}