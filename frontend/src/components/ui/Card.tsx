import { type HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

// Usage: <Card padding="md" variant="interactive">content</Card>
// Variants: default | elevated | interactive | dense | flat

type Padding = "none" | "sm" | "md" | "lg";
type Radius = "none" | "sm" | "md" | "lg" | "xl";
type Variant = "default" | "elevated" | "interactive" | "dense" | "flat";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
  border?: boolean;
  radius?: Radius;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: [
    "bg-[var(--surface)] border border-[var(--border-default)]",
    "shadow-[var(--shadow-card)]",
  ].join(" "),
  
  elevated: [
    "bg-[var(--surface-raised)] border border-[var(--border-default)]",
    "shadow-[var(--shadow-overlay)]",
  ].join(" "),
  
  interactive: [
    "bg-[var(--surface)] border border-[var(--border-default)]",
    "shadow-[var(--shadow-card)] cursor-pointer",
    "transition-[transform,border-color,box-shadow] duration-normal var(--ease-out)",
    "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-overlay)]",
    "hover:-translate-y-1 active:translate-y-0",
    "motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none",
  ].join(" "),
  
  dense: [
    "bg-[var(--surface)] border border-[var(--border-default)]",
    "shadow-sm",
  ].join(" "),

  flat: [
    "bg-[var(--surface-bg)] border border-[var(--border-default)]",
    "shadow-none",
  ].join(" "),
};

// Padding scales map strictly to exact 8px multiples (§2.3 spacing grid rules)
const paddingClasses: Record<Padding, string> = {
  none: "p-0",
  sm: "p-4",   // 16px
  md: "p-6",   // 24px
  lg: "p-8",   // 32px
};

const radiusClasses: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-[var(--radius-sm)]", // 6px
  md: "rounded-[var(--radius-md)]", // 8px
  lg: "rounded-[var(--radius-lg)]", // 12px
  xl: "rounded-[var(--radius-xl)]", // 16px
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = "md",
      border = true,
      radius = "lg",
      variant = "default",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          // Base architectural contract
          "relative overflow-hidden",
          "transition-colors duration-normal var(--ease-out)",
          "ihi-noise-layer", // Instantiates subtle organic noise layer on high-grade surfaces
          
          // Contextual mapping
          variantClasses[variant],
          !border && "border-none",
          radiusClasses[radius],
          paddingClasses[padding],
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ==========================================================================
   OPTIONAL COMPOSITION SUB-COMPONENTS
   ========================================================================== */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  description?: string;
  actions?: React.ReactNode;
}

export const CardHeader = ({ className, children, description, actions, ...props }: CardHeaderProps) => (
  <div className={clsx("flex items-start justify-between gap-4 mb-4", className)} {...props}>
    <div className="flex-1 min-w-0">
      {children && <h3 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">{children}</h3>}
      {description && <p className="text-body-sm text-[var(--text-secondary)] mt-1">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);

export const CardBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("text-body-md text-[var(--text-secondary)]", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("mt-6 pt-4 border-t border-[var(--border-default)] flex items-center justify-end gap-2", className)} {...props} />
);

export { Card };
export type { CardProps, Padding as CardPadding, Radius as CardRadius, Variant as CardVariant };