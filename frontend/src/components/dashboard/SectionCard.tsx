import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface SectionCardProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function SectionCard({
  title,
  description,
  eyebrow,
  actions,
  children,
  className,
  padding = true,
}: SectionCardProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl bg-white border border-[#E6E5E0]',
        'shadow-sm hover:shadow-md transition-all duration-300 ease-out',
        className
      )}
    >
      {/* Editorial top gold border highlight */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A24A]/25 to-transparent" />
      
      <div className="flex items-start justify-between gap-4 p-5 border-b border-[#F0EFEA]">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#C6A24A] mb-1">
              {eyebrow}
            </p>
          )}
          <h3 className="font-serif text-base font-bold text-[#0A0A0A]">
            {title}
          </h3>
          {description && (
            <p className="font-sans text-xs text-[#706F6B] mt-0.5">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>}
      </div>
      <div className={clsx(padding && 'p-5')}>{children}</div>
    </div>
  );
}