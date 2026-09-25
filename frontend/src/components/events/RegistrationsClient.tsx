'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { GridBackground } from '@/components/dashboard/GridBackground';
import { organizerNavigation } from '@/components/layout/navigation';
import { getAuthSession, type UserProfile } from '@/lib/auth';

// 1. Mock Data for the Data Table
type RegistrationStatus = 'Pending' | 'Approved' | 'Waitlisted' | 'Rejected';

interface Hacker {
  id: string;
  name: string;
  email: string;
  university: string;
  skills: string[];
  status: RegistrationStatus;
  appliedDate: string;
}

const MOCK_REGISTRATIONS: Hacker[] = [
  { id: 'REG-001', name: 'Elena Rostova', email: 'elena.r@mit.edu', university: 'MIT', skills: ['AI/ML', 'Python', 'React'], status: 'Pending', appliedDate: '2 hours ago' },
  { id: 'REG-002', name: 'Marcus Chen', email: 'm.chen@stanford.edu', university: 'Stanford University', skills: ['Frontend', 'UI/UX', 'Figma'], status: 'Approved', appliedDate: '5 hours ago' },
  { id: 'REG-003', name: 'Sarah Jenkins', email: 'sjenkins@berkeley.edu', university: 'UC Berkeley', skills: ['Smart Contracts', 'Solidity'], status: 'Waitlisted', appliedDate: '1 day ago' },
  { id: 'REG-004', name: 'David Kim', email: 'davidk@cmu.edu', university: 'Carnegie Mellon', skills: ['Backend', 'Node.js', 'PostgreSQL'], status: 'Approved', appliedDate: '1 day ago' },
  { id: 'REG-005', name: 'Aisha Patel', email: 'apxtel@nyu.edu', university: 'NYU', skills: ['Data Science', 'PyTorch'], status: 'Pending', appliedDate: '2 days ago' },
  { id: 'REG-006', name: 'James Wilson', email: 'jwilson@ucla.edu', university: 'UCLA', skills: ['Hardware', 'C++'], status: 'Rejected', appliedDate: '3 days ago' },
];

export function RegistrationsClient({ eventId }: { eventId: string }) {
  const [user, setUser] = useState<UserProfile>({ name: 'Organizer', email: 'organizer@platform.com' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RegistrationStatus>('All');
  const [registrations, setRegistrations] = useState<Hacker[]>(MOCK_REGISTRATIONS);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const session = getAuthSession();
    if (session && session.name) setUser(session);
  }, []);

  // Filter Logic
  const filteredData = registrations.filter((hacker) => {
    const matchesSearch = hacker.name.toLowerCase().includes(searchQuery.toLowerCase()) || hacker.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || hacker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action Logic
  const handleUpdateStatus = (id: string, newStatus: RegistrationStatus) => {
    setRegistrations(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('CSV Exported Successfully (Simulation)');
    }, 1000);
  };

  const getStatusStyles = (status: RegistrationStatus) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Pending': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Waitlisted': return 'bg-[#FAF9F5] border-[#E6E5E0] text-[#706F6B]';
      case 'Rejected': return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F9F9F6]">
      <GridBackground />

      <DashboardShell
        role="organizer"
        userName={user.name}
        userEmail={user.email}
        eventName={user.eventName || 'Stanford TreeHacks 2025'}
        navigation={organizerNavigation}
      >
        <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6E5E0] pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6A24A] font-bold">
                Event ID: {eventId}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight mt-1">
                Registrations
              </h1>
              <p className="text-xs text-[#706F6B] mt-1 font-sans">
                Review applicants, filter by status, and manage the event pipeline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3.5 py-1.5 rounded-lg border border-[#E6E5E0] bg-white hover:bg-[#FAF9F5] text-xs font-mono font-bold text-[#0A0A0A] transition-all">
                Public Page ↗
              </button>
              <button 
                onClick={handleExportCSV}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-lg border border-[#E6E5E0] bg-[#0A0A0A] hover:bg-[#C6A24A] text-white text-xs font-mono font-bold transition-all shadow-sm disabled:opacity-70"
              >
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>

          {/* Controls: Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E6E5E0] shadow-sm">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706F6B]" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E6E5E0] bg-[#FAF9F5] text-xs text-[#0A0A0A] placeholder:text-[#706F6B] focus:outline-none focus:border-[#C6A24A] transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
              {(['All', 'Pending', 'Approved', 'Waitlisted', 'Rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    statusFilter === status
                      ? 'bg-[#0A0A0A] text-white shadow-sm'
                      : 'bg-white border border-[#E6E5E0] text-[#706F6B] hover:border-[#C6A24A]/50 hover:text-[#0A0A0A]'
                  }`}
                >
                  {status} 
                  <span className="ml-1.5 opacity-60">
                    {status === 'All' ? registrations.length : registrations.filter(r => r.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-[#E6E5E0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0EFEA] bg-[#FAF9F5]">
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">Participant</th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">Skills / Track</th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">Status</th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B]">Registered</th>
                    <th className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#706F6B] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  <AnimatePresence>
                    {filteredData.length > 0 ? (
                      filteredData.map((hacker, i) => (
                        <motion.tr 
                          key={hacker.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="group hover:bg-[#FAF9F5] transition-colors"
                        >
                          {/* Hacker Info */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-[#0A0A0A] text-[#C6A24A] flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                                {hacker.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-serif font-bold text-sm text-[#0A0A0A] group-hover:text-[#C6A24A] transition-colors">{hacker.name}</p>
                                <p className="font-sans text-[11px] text-[#706F6B]">{hacker.email}</p>
                                <p className="font-mono text-[9px] text-[#A07F32] mt-0.5">{hacker.university}</p>
                              </div>
                            </div>
                          </td>

                          {/* Skills */}
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                              {hacker.skills.map(skill => (
                                <span key={skill} className="px-2 py-0.5 rounded bg-white border border-[#E6E5E0] text-[9px] font-mono text-[#706F6B]">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${getStatusStyles(hacker.status)}`}>
                              {hacker.status === 'Pending' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                              {hacker.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 font-mono text-[10px] text-[#706F6B]">
                            {hacker.appliedDate}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {hacker.status === 'Pending' && (
                                <>
                                  <button onClick={() => handleUpdateStatus(hacker.id, 'Rejected')} className="p-1.5 rounded text-[#706F6B] hover:text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  </button>
                                  <button onClick={() => handleUpdateStatus(hacker.id, 'Approved')} className="p-1.5 rounded text-[#706F6B] hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  </button>
                                </>
                              )}
                              <button className="px-2 py-1 rounded border border-[#E6E5E0] bg-white text-[10px] font-mono font-bold text-[#0A0A0A] hover:bg-[#FAF9F5] shadow-sm">
                                View
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      // Empty State
                      <tr>
                        <td colSpan={5}>
                          <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="h-12 w-12 rounded-full border border-[#E6E5E0] bg-[#FAF9F5] flex items-center justify-center mb-3 text-[#C6A24A]">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <h3 className="font-serif text-lg font-bold text-[#0A0A0A]">No records found</h3>
                            <p className="text-xs text-[#706F6B] mt-1">No registrations match your current filter or search criteria.</p>
                            <button 
                              onClick={() => {setSearchQuery(''); setStatusFilter('All');}}
                              className="mt-4 px-3 py-1.5 rounded bg-[#FAF9F5] border border-[#E6E5E0] text-[10px] font-mono font-bold text-[#0A0A0A] hover:text-[#C6A24A]"
                            >
                              Clear Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </DashboardShell>
    </div>
  );
}