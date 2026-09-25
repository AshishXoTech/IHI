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

// Map rings dynamically to luxury branding gradients
const colorMap: Record<NormalizedRingAccent, { from: string; to: string }> = {
  primary: { from: '#C6A24A', to: '#A07F32' },
  secondary: { from: '#C6A24A', to: '#FAF9F5' },
  good: { from: '#C6A24A', to: '#A07F32' },
  attention: { from: '#A07F32', to: '#E8D9A8' },
  critical: { from: '#EF4444', to: '#991B1B' },
  neutral: { from: '#706F6B', to: '#E6E5E0' },
};

export function ProgressRing({
  value,
  max = 100,
  size = 140,
  strokeWidth = 8,
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
  const gradientConfig = colorMap[normalized];

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
            <stop offset="0%" stopColor={gradientConfig.from} />
            <stop offset="100%" stopColor={gradientConfig.to} />
          </linearGradient>
        </defs>

        {/* Muted underlying circular track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F0EFEA"
          strokeWidth={strokeWidth}
        />

        {/* Active Animated circular ring path */}
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
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Embedded central data values */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {label && (
          <span className="font-serif text-3xl font-black text-[#0A0A0A] tracking-tighter">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#706F6B] mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}