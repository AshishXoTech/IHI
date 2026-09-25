import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={clsx('mb-8', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 mb-4 text-body-sm text-ihi-text-tertiary" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-ihi-text-muted">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-ihi-text-primary transition-colors">{crumb.label}</a>
              ) : (
                <span className="text-ihi-text-secondary">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="text-label text-ihi-secondary mb-2">{eyebrow}</p>
          )}
          <h1 className="text-heading-md font-display font-semibold text-ihi-text-primary">
            {title}
          </h1>
          {description && (
            <p className="text-body-md text-ihi-text-secondary mt-2 max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}