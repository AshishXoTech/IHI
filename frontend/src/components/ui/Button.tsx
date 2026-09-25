"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variantClasses: Record<Variant, string> = {
  primary: [
    "bg-[var(--accent)] text-white",
    "hover:bg-[var(--accent-hover)]",
    "active:scale-[0.98]",
    "shadow-sm hover:shadow-[0_4px_12px_rgba(110,86,207,0.2)]",
    "[data-register='tower']:hover:shadow-[0_4px_16px_rgba(139,124,246,0.25)]",
    "focus-visible:ring-[var(--accent)]",
  ].join(" "),
  
  secondary: [
    "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-default)]",
    "hover:bg-[var(--surface-bg)] hover:border-[var(--border-strong)]",
    "active:bg-[var(--border-default)] active:scale-[0.98]",
    "focus-visible:ring-[var(--text-secondary)]",
  ].join(" "),
  
  ghost: [
    "bg-transparent text-[var(--text-secondary)]",
    "hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]",
    "active:scale-[0.98]",
    "focus-visible:ring-[var(--accent)]",
  ].join(" "),
  
  destructive: [
    "bg-[var(--destructive)] text-white",
    "hover:bg-[var(--destructive-hover)]",
    "active:scale-[0.98]",
    "shadow-sm hover:shadow-[0_4px_12px_rgba(220,38,38,0.2)]",
    "focus-visible:ring-[var(--destructive)]",
  ].join(" "),

  outline: [
    "bg-transparent text-[var(--accent-text)] border border-[var(--accent)]/30",
    "hover:bg-[var(--accent-subtle)] hover:border-[var(--accent)]",
    "active:scale-[0.98]",
    "focus-visible:ring-[var(--accent)]",
  ].join(" "),
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-xs gap-1.5 rounded-[var(--radius-md)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-lg)]",
};

const spinnerSizes: Record<Size, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      icon,
      iconPosition = "left",
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          // Base
          "inline-flex items-center justify-center font-semibold tracking-tight",
          "select-none vertical-middle",
          "transition-all duration-normal var(--ease-out)",
          "motion-reduce:transition-none motion-reduce:transform-none",
          
          // Focus Ring Custom Logic (§2.9 Accessibility compliance)
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
          
          // Hover translate animations (hardware accelerated, disabled under prefers-reduced-motion)
          "hover:-translate-y-[1px] active:translate-y-0",
          "motion-reduce:hover:translate-y-0",

          // Disabled/Loading Interaction Override
          isDisabled && [
            "opacity-50 pointer-events-none cursor-not-allowed",
            "transform-none hover:translate-y-0 active:scale-100",
            "shadow-none"
          ].join(" "),
          
          // Context Mapping
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {/* Dynamic Loading Spinner */}
        {loading ? (
          <svg
            className={clsx(
              "animate-[ihi-spin_0.8s_linear_infinite]",
              "motion-reduce:animate-none",
              "flex-shrink-0",
              spinnerSizes[size]
            )}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="12"
              className="opacity-25"
            />
            <path
              d="M1.5 8a6.5 6.5 0 0 1 6.5-6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Standard Icon Render
          icon && iconPosition === "left" && (
            <span className="flex items-center justify-center flex-shrink-0 transition-transform duration-normal">
              {icon}
            </span>
          )
        )}

        {/* Inner Label Container */}
        <span className="truncate">{children}</span>

        {/* Dynamic Trailing Icon */}
        {!loading && icon && iconPosition === "right" && (
          <span className="flex items-center justify-center flex-shrink-0 transition-transform duration-normal">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };