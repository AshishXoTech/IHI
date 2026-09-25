import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Card } from '@/components/ui';

interface SectionCardProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function SectionCard({ title, description, eyebrow, actions, children, className, padding = true }: SectionCardProps) {
  return (
    <Card className={clsx('overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-4 p-6 border-b border-ihi-border-subtle">
        <div className="flex-1 min-w-0">
          {eyebrow && <p className="text-label text-ihi-secondary mb-1">{eyebrow}</p>}
          <h3 className="text-heading-sm font-display font-semibold text-ihi-text-primary">{title}</h3>
          {description && <p className="text-body-sm text-ihi-text-tertiary mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className={clsx(padding && 'p-6')}>{children}</div>
    </Card>
  );
}