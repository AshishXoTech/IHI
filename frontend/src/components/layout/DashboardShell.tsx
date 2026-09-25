'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Logo } from './Logo';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface DashboardShellProps {
  role: 'organizer' | 'judge' | 'participant';
  userName: string;
  userEmail: string;
  eventName?: string;
  navigation: NavSection[];
  children: ReactNode;
  headerActions?: ReactNode;
}

const roleConfig = {
  organizer: { label: 'Organizer Console', color: 'from-ihi-primary to-ihi-tertiary' },
  judge: { label: 'Judge Panel', color: 'from-ihi-secondary to-ihi-primary' },
  participant: { label: 'Participant Hub', color: 'from-ihi-tertiary to-ihi-secondary' },
};

export function DashboardShell({
  role, userName, userEmail, eventName, navigation, children, headerActions
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-ihi-bg flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 z-50 h-screen',
          'bg-ihi-surface border-r border-ihi-border-subtle',
          'flex flex-col transition-all duration-300 ease-out',
          collapsed ? 'w-20' : 'w-72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-ihi-border-subtle flex-shrink-0">
          {!collapsed ? (
            <Logo size="sm" />
          ) : (
            <div className="w-full flex justify-center">
              <Logo size="sm" variant="icon" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-ihi-text-tertiary hover:text-ihi-text-primary hover:bg-ihi-overlay transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d={collapsed ? 'M6 4l4 4-4 4' : 'M10 4L6 8l4 4'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="p-5 pb-3">
            <div className={clsx(
              'relative overflow-hidden rounded-xl p-3 border border-ihi-border-subtle',
              'bg-gradient-to-br from-ihi-elevated to-ihi-surface'
            )}>
              <div className={clsx('absolute inset-0 opacity-10 bg-gradient-to-br', config.color)} />
              <div className="relative">
                <p className="text-label text-ihi-text-tertiary">{config.label}</p>
                {eventName && (
                  <p className="text-body-sm text-ihi-text-primary font-medium mt-1 truncate">{eventName}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {navigation.map((section, idx) => (
            <div key={idx}>
              {section.title && !collapsed && (
                <p className="text-label text-ihi-text-muted px-3 mb-2">{section.title}</p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium',
                          'transition-all duration-200 ease-out',
                          active
                            ? 'bg-gradient-to-r from-ihi-primary/15 to-ihi-primary/5 text-ihi-text-primary'
                            : 'text-ihi-text-tertiary hover:text-ihi-text-primary hover:bg-ihi-overlay',
                          collapsed && 'justify-center'
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-gradient-to-b from-ihi-primary to-ihi-secondary" />
                        )}
                        <span className={clsx(
                          'flex-shrink-0 transition-colors',
                          active ? 'text-ihi-primary' : 'text-ihi-text-muted group-hover:text-ihi-text-secondary'
                        )}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ihi-primary/20 text-ihi-primary">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-ihi-border-subtle">
          <div className={clsx(
            'flex items-center gap-3 rounded-xl p-2.5 hover:bg-ihi-overlay transition-colors cursor-pointer',
            collapsed && 'justify-center'
          )}>
            <div className="relative flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-ihi-primary to-ihi-secondary flex items-center justify-center text-white text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ihi-success ring-2 ring-ihi-surface" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-ihi-text-primary truncate">{userName}</p>
                <p className="text-xs text-ihi-text-tertiary truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-ihi-bg/80 backdrop-blur-xl border-b border-ihi-border-subtle">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-ihi-text-secondary hover:bg-ihi-overlay"
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-3 h-10 px-4 rounded-xl bg-ihi-surface border border-ihi-border-subtle min-w-[320px] focus-within:border-ihi-primary/50 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-ihi-text-tertiary">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search or jump to…"
                  className="flex-1 bg-transparent text-body-sm text-ihi-text-primary placeholder:text-ihi-text-tertiary focus:outline-none"
                />
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 h-5 rounded border border-ihi-border text-[10px] text-ihi-text-tertiary font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {headerActions}
              <button className="h-10 w-10 flex items-center justify-center rounded-lg text-ihi-text-secondary hover:text-ihi-text-primary hover:bg-ihi-overlay relative transition-colors" aria-label="Notifications">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2a5 5 0 00-5 5v3l-1.5 2.5h13L14 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M7 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-ihi-secondary ring-2 ring-ihi-bg" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0">{children}</main>
      </div>
    </div>
  );
}