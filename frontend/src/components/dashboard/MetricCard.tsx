'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

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

// Inline performance hook for data changes
function useLocalFlashOnChange(value: any) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 300);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return flash;
}

type NormalizedAccent = 'primary' | 'secondary' | 'good' | 'attention' | 'critical' | 'neutral';

function normalizeAccent(accent: MetricAccent): NormalizedAccent {
  if (accent === 'success') return 'good';
  if (accent === 'warning') return 'attention';
  if (accent === 'danger') return 'critical';
  return accent;
}

// Map accents to premium white/black/gold spectrum
const washMap: Record<NormalizedAccent, string> = {
  primary: 'bg-[#C6A24A]',
  secondary: 'bg-[#FAF9F5]',
  good: 'bg-[#C6A24A]',
  attention: 'bg-[#FAF9F5]',
  critical: 'bg-red-500',
  neutral: 'bg-gray-400',
};

const sparklineColorMap: Record<NormalizedAccent, string> = {
  primary: '#C6A24A', // Burnished gold
  secondary: '#A07F32', // Deep gold
  good: '#C6A24A',
  attention: '#E8D9A8', // Warm champagne gold
  critical: '#0A0A0A', // Dark obsidian
  neutral: '#706F6B', // Muted slate
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
  const flashing = useLocalFlashOnChange(value);
  const secondaryText = subtitle ?? helper;
  const normalized = normalizeAccent(accent);
  const cardRef = useRef<HTMLDivElement>(null);

  // High-performance spring setup for 3D tilt effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (event.clientX - rect.left) / width - 0.5;
    const mouseY = (event.clientY - rect.top) / height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
      }}
      className={clsx(
        'group relative overflow-hidden rounded-xl bg-white p-5 cursor-pointer',
        'border border-[#E6E5E0] shadow-sm',
        'transition-all duration-300 ease-out hover:border-[#C6A24A] hover:shadow-lg',
        className
      )}
    >
      {/* Decorative premium gold top outline edge */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#C6A24A]/40 to-transparent" />

      {/* GPU-Accelerated Golden Wash Glow on Data Updates */}
      {flashing && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={clsx(
            'pointer-events-none absolute inset-0 z-0 rounded-[inherit]',
            washMap[normalized]
          )}
        />
      )}

      {/* Interactive mouse ambient light tracking */}
      <div
        style={{ transform: 'translateZ(20px)' }}
        className="relative z-10 flex h-full flex-col justify-between"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#706F6B]">
            {label}
          </p>

          <div className="flex flex-shrink-0 items-center gap-2">
            {indicator}
            {icon && !indicator && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E5E0] bg-[#FAF9F5] text-[#C6A24A] transition-colors group-hover:text-[#A07F32]">
                {icon}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="font-serif text-3xl font-black tracking-tight text-[#0A0A0A] tabular-nums">
            {value}
          </h3>

          {delta && (
            <span
              className={clsx(
                'inline-flex select-none items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                delta.trend === 'up' && 'bg-[#F7F3E3] border border-[#C6A24A]/30 text-[#A07F32]',
                delta.trend === 'down' && 'bg-red-50 border border-red-100 text-red-700',
                delta.trend === 'neutral' && 'bg-[#F0EFEA] border border-[#E6E5E0] text-[#706F6B]'
              )}
            >
              <svg className="h-2.5 w-2.5 flex-shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                {delta.trend === 'up' && (
                  <path d="M2.5 8.5L6 3.5l3.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {delta.trend === 'down' && (
                  <path d="M2.5 3.5L6 8.5l3.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {delta.trend === 'neutral' && (
                  <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
              <span>{typeof delta.value === 'number' ? `${delta.value}%` : delta.value}</span>
            </span>
          )}
        </div>

          {secondaryText && (
            <p className="mt-1.5 truncate font-sans text-xs text-[#706F6B]">
              {secondaryText}
            </p>
          )}

        {sparkline && sparkline.length > 1 && (
          <div className="mt-4 h-9 w-full">
            <SparklineGraph data={sparkline} accent={normalized} />
          </div>
        )}

        {children && <div className="mt-3">{children}</div>}
      </div>
    </motion.div>
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
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}