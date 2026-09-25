'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { GridBackground } from '@/components/dashboard/GridBackground';
import { organizerNavigation } from '@/components/layout/navigation';
import { getAuthSession, type UserProfile } from '@/lib/auth';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

// Mock data for events
const MOCK_EVENTS = [
  {
    id: 'evt_1',
    name: 'Stanford TreeHacks 2025',
    date: 'Feb 14 - 16, 2025',
    status: 'Live' as const,
    metrics: { participants: 1247, teams: 284, submissions: 196 },
    location: 'Stanford, CA',
  },
  {
    id: 'evt_2',
    name: 'Hack MIT 2025',
    date: 'Sep 12 - 14, 2025',
    status: 'Draft' as const,
    metrics: { participants: 0, teams: 0, submissions: 0 },
    location: 'Cambridge, MA',
  },
  {
    id: 'evt_3',
    name: 'MIT Reality Hack',
    date: 'Jan 24 - 26, 2025',
    status: 'Past' as const,
    metrics: { participants: 850, teams: 190, submissions: 175 },
    location: 'Cambridge, MA',
  },
];

export function EventsListClient() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>({
    name: 'Organizer',
    email: 'organizer@platform.com',
  });
  const [filter, setFilter] = useState<'All' | 'Live' | 'Draft' | 'Past'>('All');

  useEffect(() => {
    const session = getAuthSession();
    if (session && session.name) {
      setUser(session);
    }
  }, []);

  const filteredEvents = MOCK_EVENTS.filter((evt) => filter === 'All' || evt.status === filter);

  return (
    <div className="relative min-h-screen">
      <GridBackground />

      <DashboardShell
        role="organizer"
        userName={user.name}
        userEmail={user.email}
        eventName={user.eventName || 'Global Console'}
        navigation={organizerNavigation}
      >
        <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6E5E0] pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6A24A] font-bold">
                Portfolio
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight mt-1">
                Event Management
              </h1>
              <p className="text-xs text-[#706F6B] mt-1 font-sans">
                Manage your active hackathons, draft new events, and review past data.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/events/new')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-[#0A0A0A] hover:bg-[#C6A24A] text-white shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <PlusIcon />
                Create New Event
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {(['All', 'Live', 'Draft', 'Past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${
                  filter === tab
                    ? 'bg-[#0A0A0A] text-white shadow-sm'
                    : 'bg-white border border-[#E6E5E0] text-[#706F6B] hover:border-[#C6A24A]/50 hover:text-[#0A0A0A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Event Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event) => (
              <motion.div key={event.id} variants={staggerItem}>
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#E6E5E0] bg-white p-5 shadow-sm hover:shadow-lg hover:border-[#C6A24A] transition-all duration-300">
                  
                  {/* Status Badge & Menu */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        event.status === 'Live'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : event.status === 'Draft'
                          ? 'bg-[#FAF9F5] border border-[#E6E5E0] text-[#706F6B]'
                          : 'bg-[#F7F3E3] border border-[#C6A24A]/30 text-[#A07F32]'
                      }`}
                    >
                      {event.status === 'Live' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {event.status}
                    </span>
                    
                    <button className="text-[#706F6B] hover:text-[#0A0A0A] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5.5 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </button>
                  </div>

                  {/* Title & Info */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0A0A0A] group-hover:text-[#C6A24A] transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                    <div className="mt-2 flex flex-col gap-1 text-xs font-mono text-[#706F6B]">
                      <div className="flex items-center gap-2">
                        <CalendarIcon /> {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationIcon /> {event.location}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#F0EFEA] pt-4">
                    <div>
                      <p className="text-[9px] font-mono uppercase text-[#706F6B]">Hackers</p>
                      <p className="font-serif text-lg font-bold text-[#0A0A0A]">{event.metrics.participants.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase text-[#706F6B]">Teams</p>
                      <p className="font-serif text-lg font-bold text-[#0A0A0A]">{event.metrics.teams.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase text-[#706F6B]">Projects</p>
                      <p className="font-serif text-lg font-bold text-[#0A0A0A]">{event.metrics.submissions.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="mt-5">
                    <button 
                      onClick={() => router.push('/dashboard')}
                      className="w-full py-2 rounded-lg border border-[#E6E5E0] bg-[#FAF9F5] text-xs font-mono font-bold text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white group-hover:border-[#0A0A0A] transition-all"
                    >
                      {event.status === 'Live' ? 'Enter Command Center →' : 'Manage Event →'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-mono text-sm text-[#706F6B]">No events found in this category.</p>
            </div>
          )}
        </div>
      </DashboardShell>
    </div>
  );
}

// Icons
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);