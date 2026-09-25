'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  organizer: { label: 'Organizer Console', color: 'from-[#C6A24A] to-[#A07F32]' },
  judge: { label: 'Judge Panel', color: 'from-[#2C2C2A] to-[#0A0A0A]' },
  participant: { label: 'Participant Hub', color: 'from-[#C6A24A] to-[#2C2C2A]' },
};

export function DashboardShell({
  role, userName, userEmail, eventName, navigation, children, headerActions
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const config = roleConfig[role];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#0A0A0A] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0A0A0A]/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 z-50 h-screen',
          'bg-[#FFFFFF] border-r border-[#E6E5E0]',
          'flex flex-col transition-all duration-300 ease-out',
          collapsed ? 'w-20' : 'w-72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E6E5E0] flex-shrink-0">
          {!collapsed ? (
            <Logo size="sm" variant="full" />
          ) : (
            <div className="w-full flex justify-center">
              <Logo size="sm" variant="icon" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-[#706F6B] hover:text-[#0A0A0A] hover:bg-[#F9F9F6] border border-transparent hover:border-[#E6E5E0] transition-all"
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transform transition-transform duration-300">
              <path d={collapsed ? 'M6 4l4 4-4 4' : 'M10 4L6 8l4 4'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Console / Event Brand Badge */}
        {!collapsed && (
          <div className="p-4 pb-2">
            <div className="relative overflow-hidden rounded-xl p-4 border border-[#E6E5E0] bg-[#FFFFFF] shadow-sm group">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#C6A24A] via-[#E8D9A8] to-[#C6A24A]" />
              <div className="relative">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#C6A24A] font-bold">{config.label}</p>
                {eventName && (
                  <p className="text-sm text-[#0A0A0A] font-serif font-bold mt-1 truncate group-hover:text-[#C6A24A] transition-colors">{eventName}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Navigation Options */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navigation.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !collapsed && (
                <p className="text-[10px] tracking-wider font-mono font-bold text-[#706F6B] uppercase px-3 pt-4 pb-1">{section.title}</p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium',
                          'transition-all duration-200 ease-out',
                          active
                            ? 'bg-[#F7F3E3] text-[#0A0A0A] border border-[#C6A24A]/30 shadow-sm'
                            : 'text-[#706F6B] hover:text-[#0A0A0A] hover:bg-[#FAF9F5] border border-transparent',
                          collapsed && 'justify-center'
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#C6A24A]" />
                        )}
                        <span className={clsx(
                          'flex-shrink-0 transition-colors duration-200',
                          active ? 'text-[#C6A24A]' : 'text-[#706F6B] group-hover:text-[#0A0A0A]'
                        )}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 font-sans">{item.label}</span>
                            {item.badge && (
                              <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C6A24A]/20 text-[#A07F32]">
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

        {/* User Account / Sign out interface */}
        <div className="p-3 border-t border-[#E6E5E0] bg-[#FFFFFF]">
          <div className="group relative flex flex-col gap-1.5 rounded-xl p-2.5 hover:bg-[#FAF9F5] transition-all border border-transparent hover:border-[#E6E5E0]">
            <div className={clsx("flex items-center gap-3", collapsed && "justify-center")}>
              <div className="relative flex-shrink-0">
                <div className="h-9 w-9 rounded-lg bg-[#0A0A0A] flex items-center justify-center text-[#FFFFFF] text-sm font-serif font-semibold border border-[#C6A24A] shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-serif font-bold text-[#0A0A0A] truncate">{userName}</p>
                  <p className="text-[10px] font-mono text-[#706F6B] truncate">{userEmail}</p>
                </div>
              )}
            </div>

            {/* Logout Action Button */}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-[#E6E5E0] bg-white hover:bg-red-50/50 hover:text-red-600 hover:border-red-200 transition-all text-[11px] font-mono font-bold text-[#706F6B]"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M5.25 12.25H2.625A1.375 1.375 0 011.25 10.875V3.125A1.375 1.375 0 012.625 1.75H5.25M9.625 10.5L12.75 7.375M12.75 7.375L9.625 4.25M12.75 7.375H4.375" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF]/85 backdrop-blur-md border-b border-[#E6E5E0]">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-[#0A0A0A] hover:bg-[#FAF9F5] border border-[#E6E5E0]"
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Sophisticated Command / Search Bar */}
              <div className="hidden md:flex items-center gap-3 h-10 px-4 rounded-lg bg-[#FAF9F5] border border-[#E6E5E0] min-w-[320px] focus-within:border-[#C6A24A] focus-within:bg-[#FFFFFF] transition-all">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#706F6B]">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search hackers, teams or rubrics..."
                  className="flex-1 bg-transparent text-xs text-[#0A0A0A] placeholder:text-[#706F6B] focus:outline-none"
                />
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 h-5 rounded border border-[#E6E5E0] text-[9px] text-[#706F6B] font-mono bg-white">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {headerActions}
              
              {/* Premium Alerts Button */}
              <button className="h-9 w-9 flex items-center justify-center rounded-lg text-[#706F6B] hover:text-[#0A0A0A] bg-white border border-[#E6E5E0] hover:border-[#C6A24A] relative transition-all" aria-label="Notifications">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2a5 5 0 00-5 5v3l-1.5 2.5h13L14 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M7 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#C6A24A]" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0">{children}</main>
      </div>
    </div>
  );
}