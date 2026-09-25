"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  hint?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  icon?: ReactNode;
  endAdornment?: ReactNode;
}

const sizeClasses = {
  sm: "h-8 text-xs rounded-[var(--radius-sm)]",
  md: "h-10 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 text-base rounded-[var(--radius-md)]",
};

const iconPaddingLeft = {
  sm: "pl-8 pr-3",
  md: "pl-10 pr-3.5",
  lg: "pl-11 pr-4",
};

const iconPaddingRight = {
  sm: "pr-8 pl-3",
  md: "pr-10 pl-3.5",
  lg: "pr-11 pl-4",
};

const iconPaddingBoth = {
  sm: "pl-8 pr-8",
  md: "pl-10 pr-10",
  lg: "pl-11 pr-11",
};

const standardPadding = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-4",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      hint,
      error,
      inputSize = "md",
      icon,
      endAdornment,
      className = "",
      id: externalId,
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = externalId ?? autoId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const supportingText = helperText ?? hint;
    const hasError = Boolean(error);

    const describedBy =
      [
        ariaDescribedBy,
        supportingText && !hasError ? helperId : "",
        hasError ? errorId : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const getPaddingClass = () => {
      if (icon && endAdornment) return iconPaddingBoth[inputSize];
      if (icon) return iconPaddingLeft[inputSize];
      if (endAdornment) return iconPaddingRight[inputSize];
      return standardPadding[inputSize];
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {/* Semantic Field Label */}
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-[var(--text-secondary)] tracking-tight select-none"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper for Relative Icon Positioning */}
        <div className="relative flex items-center w-full">
          {icon && (
            <span
              className={clsx(
                "absolute left-3 flex items-center justify-center pointer-events-none text-[var(--text-muted)] transition-colors",
                inputSize === "sm" ? "h-3.5 w-3.5 left-2.5" : "h-4 w-4 left-3",
                hasError && "text-[var(--destructive)]"
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={describedBy}
            className={clsx(
              // Layout & Typography
              "w-full bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "border font-normal leading-none",
              
              // Interaction & Hardware Accelerated Transitions
              "transition-all duration-normal var(--ease-out)",
              "motion-reduce:transition-none",

              // Focus States (§2.9 Accessibility standard 2px focus ring)
              "outline-none",
              "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface)]",
              
              // Dynamic States
              hasError
                ? [
                    "border-[var(--destructive)]",
                    "focus-visible:ring-[var(--destructive)] focus-visible:border-[var(--destructive)]",
                  ].join(" ")
                : [
                    "border-[var(--border-default)]",
                    "hover:border-[var(--border-strong)]",
                    "focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)]",
                  ].join(" "),

              // Disabled State
              disabled && [
                "opacity-40 cursor-not-allowed pointer-events-none",
                "bg-[var(--surface-bg)] hover:border-[var(--border-default)]",
              ].join(" "),

              // Metric Padding & Sizing
              sizeClasses[inputSize],
              getPaddingClass(),
              className
            )}
            {...rest}
          />

          {endAdornment && (
            <span
              className={clsx(
                "absolute right-3 flex items-center justify-center text-[var(--text-muted)]",
                inputSize === "sm" ? "right-2.5" : "right-3"
              )}
            >
              {endAdornment}
            </span>
          )}
        </div>

        {/* Error Feedback Message */}
        {hasError && (
          <p
            id={errorId}
            className="text-xs font-medium text-[var(--destructive)] flex items-center gap-1.5 mt-0.5 animate-fade-in-up"
            role="alert"
          >
            <svg
              className="h-3.5 w-3.5 flex-shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5v4.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {/* Supporting Hint Text */}
        {!hasError && supportingText && (
          <p
            id={helperId}
            className="text-xs text-[var(--text-muted)] font-normal leading-relaxed mt-0.5"
          >
            {supportingText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";