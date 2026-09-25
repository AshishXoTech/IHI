'use client';

import { useEffect, useState, useId } from 'react';
import { clsx } from 'clsx';

export type ProgressRingAccent =
  | 'primary'
  | 'secondary'
  | 'good'
  | 'attention'
  | 'critical'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger';

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  accent?: ProgressRingAccent;
  className?: string;
}

type NormalizedRingAccent = 'primary' | 'secondary' | 'good' | 'attention' | 'critical' | 'neutral';

function normalizeAccent(accent: ProgressRingAccent): NormalizedRingAccent {
  if (accent === 'success') return 'good';
  if (accent === 'warning') return 'attention';
  if (accent === 'danger') return 'critical';
  return accent;
}

const colorMap: Record<NormalizedRingAccent, string> = {
  primary: 'var(--accent)',
  secondary: '#22d3ee',
  good: 'var(--signal-good)',
  attention: 'var(--signal-attention)',
  critical: 'var(--signal-critical)',
  neutral: 'var(--text-muted)',
};

/**
 * Animated Radial Progress Indicator supporting both Phase 2 Design System tokens
 * and legacy semantic aliases with zero layout thrash.
 */
export function ProgressRing({
  value,
  max = 100,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  accent = 'primary',
  className,
}: ProgressRingProps) {
  const gradientId = useId();
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const normalized = normalizeAccent(accent);
  const rawPercent = Math.min(100, Math.max(0, (value / max) * 100));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;
  const mainColor = colorMap[normalized];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(rawPercent);
    }, 50);
    return () => clearTimeout(timer);
  }, [rawPercent]);

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center flex-shrink-0 select-none', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={mainColor} />
            <stop
              offset="100%"
              stopColor={normalized === 'primary' ? '#22d3ee' : mainColor}
            />
          </linearGradient>
        </defs>

        {/* Outer/Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Arc Line */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Center Label Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {label && (
          <span className="text-heading-sm font-display font-bold text-[var(--text-primary)] tabular-nums font-mono">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-label text-[var(--text-muted)] mt-0.5 font-medium">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}