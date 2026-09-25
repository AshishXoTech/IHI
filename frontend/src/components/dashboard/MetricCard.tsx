'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useFlashOnChange } from './useFlashOnChange';
import { Card } from '@/components/ui';

export type MetricAccent =
  | 'primary'
  | 'secondary'
  | 'good'
  | 'attention'
  | 'critical'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger';

export interface MetricDelta {
  value: number | string;
  trend: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface MetricCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  helper?: string;
  indicator?: ReactNode;
  icon?: ReactNode;
  delta?: MetricDelta;
  sparkline?: number[];
  accent?: MetricAccent;
  children?: ReactNode;
  className?: string;
}

type NormalizedAccent = 'primary' | 'secondary' | 'good' | 'attention' | 'critical' | 'neutral';

function normalizeAccent(accent: MetricAccent): NormalizedAccent {
  if (accent === 'success') return 'good';
  if (accent === 'warning') return 'attention';
  if (accent === 'danger') return 'critical';
  return accent;
}

// Maps accents purely to Gold, Gray, White, Black
const washMap: Record<NormalizedAccent, string> = {
  primary: 'bg-gold',
  secondary: 'bg-gold-light',
  good: 'bg-gold',
  attention: 'bg-gold-light',
  critical: 'bg-white',
  neutral: 'bg-gray-500',
};

const sparklineColorMap: Record<NormalizedAccent, string> = {
  primary: '#C9A227', // gold
  secondary: '#E4C65A', // gold-light
  good: '#C9A227',
  attention: '#E4C65A',
  critical: '#FFFFFF',
  neutral: '#737373',
};

export function MetricCard({
  label,
  value,
  subtitle,
  helper,
  indicator,
  icon,
  delta,
  sparkline,
  accent = 'primary',
  children,
  className,
}: MetricCardProps) {
  const flashing = useFlashOnChange(value);
  const secondaryText = subtitle ?? helper;
  const normalized = normalizeAccent(accent);

  const [pulseKey, setPulseKey] = useState(0);
  const prevFlash = useRef(false);

  useEffect(() => {
    if (flashing && !prevFlash.current) {
      setPulseKey((k) => k + 1);
    }
    prevFlash.current = flashing;
  }, [flashing]);

  return (
    <Card
      padding="none"
      variant="default"
      className={clsx(
        'group relative overflow-hidden p-6',
        'border border-gray-700 bg-gray-900', // Deep black/gray card for dashboard
        'transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transform-none',
        className
      )}
    >
      {/* Subtle ambient wash replacing heavy blurs */}
      <div
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-10 blur-xl',
          washMap[normalized]
        )}
      />

      {/* GPU-accelerated flash on data change (opacity ONLY, no background-color transitions) */}
      {pulseKey > 0 && (
        <motion.div
          key={pulseKey}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={clsx(
            'pointer-events-none absolute inset-0 z-0 rounded-[inherit]',
            washMap[normalized]
          )}
        />
      )}

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <div className="flex flex-shrink-0 items-center gap-2">
            {indicator}
            {icon && !indicator && (
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 bg-black text-gold transition-colors group-hover:text-gold-light">
                {icon}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-mono text-3xl font-bold tabular-nums tracking-tight text-white">
            {value}
          </p>

          {delta && (
            <span
              className={clsx(
                'inline-flex select-none items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold leading-none',
                delta.trend === 'up' &&
                  'border border-gold/40 bg-gold/15 text-gold-light',
                delta.trend === 'down' &&
                  'border border-white/30 bg-white/10 text-white',
                delta.trend === 'neutral' &&
                  'border border-gray-700 bg-black text-gray-400'
              )}
            >
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                {delta.trend === 'up' && (
                  <path d="M2.5 8.5L6 3.5l3.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {delta.trend === 'down' && (
                  <path d="M2.5 3.5L6 8.5l3.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {delta.trend === 'neutral' && (
                  <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
              <span>{typeof delta.value === 'number' ? `${delta.value}%` : delta.value}</span>
            </span>
          )}
        </div>

        {secondaryText && (
          <p className="mt-1.5 truncate text-xs font-normal text-gray-400">
            {secondaryText}
          </p>
        )}

        {sparkline && sparkline.length > 1 && (
          <div className="mt-4 h-10 w-full">
            <SparklineGraph data={sparkline} accent={normalized} />
          </div>
        )}

        {children && <div className="mt-3">{children}</div>}
      </div>
    </Card>
  );
}

interface SparklineGraphProps {
  data: number[];
  accent: NormalizedAccent;
}

function SparklineGraph({ data, accent }: SparklineGraphProps) {
  const gradientId = useId();
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 40;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = sparklineColorMap[accent];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}