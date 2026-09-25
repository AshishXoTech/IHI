import { forwardRef, type HTMLAttributes } from "react";
import { clsx } from "clsx";

// Usage Examples:
// <StatusBadge status="good" label="Approved" />
// <StatusBadge status="attention" label="Pending Review" pulse />
// <StatusBadge status="critical" label="Action Required" size="sm" />

type SignalStatus = "good" | "attention" | "critical" | "neutral" | "primary" | "info";
type LegacyStatusAlias = "success" | "warning" | "danger";
type Status = SignalStatus | LegacyStatusAlias;
type Size = "sm" | "md";

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  label: string;
  dot?: boolean;
  pulse?: boolean;
  size?: Size;
  className?: string;
}

// Normalizes status aliases to ensure complete backwards and forwards compatibility
function normalizeStatus(status: Status): SignalStatus {
  switch (status) {
    case "success":
      return "good";
    case "warning":
      return "attention";
    case "danger":
      return "critical";
    default:
      return status;
  }
}

const statusStyles: Record<
  SignalStatus,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  good: {
    bg: "bg-[var(--signal-good-bg)]",
    text: "text-[var(--signal-good)]",
    border: "border-[var(--signal-good)]/20",
    dot: "bg-[var(--signal-good)]",
  },
  attention: {
    bg: "bg-[var(--signal-attention-bg)]",
    text: "text-[var(--signal-attention)]",
    border: "border-[var(--signal-attention)]/20",
    dot: "bg-[var(--signal-attention)]",
  },
  critical: {
    bg: "bg-[var(--signal-critical-bg)]",
    text: "text-[var(--signal-critical)]",
    border: "border-[var(--signal-critical)]/20",
    dot: "bg-[var(--signal-critical)]",
  },
  primary: {
    bg: "bg-[var(--accent-subtle)]",
    text: "text-[var(--accent-text)]",
    border: "border-[var(--accent)]/25",
    dot: "bg-[var(--accent)]",
  },
  info: {
    bg: "bg-blue-500/10 [data-register='tower']:bg-blue-400/10",
    text: "text-blue-600 [data-register='tower']:text-blue-400",
    border: "border-blue-500/20 [data-register='tower']:border-blue-400/20",
    dot: "bg-blue-500 [data-register='tower']:bg-blue-400",
  },
  neutral: {
    bg: "bg-[var(--surface-bg)]",
    text: "text-[var(--text-secondary)]",
    border: "border-[var(--border-default)]",
    dot: "bg-[var(--text-muted)]",
  },
};

const sizeStyles: Record<Size, { container: string; dot: string; text: string }> = {
  sm: {
    container: "px-2 py-0.5 gap-1.5",
    dot: "h-1.5 w-1.5",
    text: "text-[11px] leading-tight",
  },
  md: {
    container: "px-2.5 py-1 gap-2",
    dot: "h-2 w-2",
    text: "text-xs leading-none",
  },
};

const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      status = "neutral",
      label,
      dot = true,
      pulse = false,
      size = "md",
      className,
      ...rest
    },
    ref
  ) => {
    const normalized = normalizeStatus(status);
    const s = statusStyles[normalized] || statusStyles.neutral;
    const sz = sizeStyles[size];

    return (
      <span
        ref={ref}
        role="status"
        className={clsx(
          // Architectural Base
          "inline-flex items-center select-none font-medium rounded-full border",
          "transition-colors duration-normal var(--ease-out)",
          
          // Geometry & Metrics
          sz.container,
          sz.text,
          
          // Visual Registers Mapping
          s.bg,
          s.text,
          s.border,
          className
        )}
        {...rest}
      >
        {dot && (
          <span className={clsx("relative flex items-center justify-center flex-shrink-0", sz.dot)} aria-hidden="true">
            {pulse && (
              <span
                className={clsx(
                  "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                  "motion-reduce:hidden",
                  s.dot
                )}
              />
            )}
            <span className={clsx("relative inline-flex rounded-full h-full w-full", s.dot)} />
          </span>
        )}
        <span className="tracking-tight font-medium truncate">{label}</span>
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
export type { StatusBadgeProps, Status, SignalStatus };