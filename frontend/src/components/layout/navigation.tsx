import { NavSection } from './DashboardShell';

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const organizerNavigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: icon('M3 3h5v5H3zM10 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5z') },
      { label: 'Events', href: '/dashboard/events', icon: icon('M3 5h12M3 9h12M3 13h12') },
    ],
  },
  {
    title: 'Event Management',
    items: [
      { label: 'Registrations', href: '/events/1/registrations', icon: icon('M9 9a3 3 0 100-6 3 3 0 000 6zM3 16c0-3 3-5 6-5s6 2 6 5'), badge: 42 },
      { label: 'Teams', href: '/events/1/teams', icon: icon('M6 8a2 2 0 100-4 2 2 0 000 4zM12 8a2 2 0 100-4 2 2 0 000 4zM2 15c0-2 2-4 4-4s4 2 4 4M10 15c0-2 2-4 4-4') },
      { label: 'Submissions', href: '/events/1/submissions', icon: icon('M4 3h7l3 3v9H4zM11 3v3h3') },
      { label: 'Judging', href: '/events/1/judging/rubric', icon: icon('M9 2l2 5h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5z') },
      { label: 'Results', href: '/events/1/results', icon: icon('M3 15V9M8 15V3M13 15V6') },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Audit Log', href: '/events/1/audit-log', icon: icon('M4 4h10v10H4zM7 8h4M7 11h4M4 4l3 3M14 4l-3 3') },
    ],
  },
];

export const judgeNavigation: NavSection[] = [
  {
    items: [
      { label: 'My Queue', href: '/judge/queue', icon: icon('M3 3h12M3 8h12M3 13h12'), badge: 12 },
      { label: 'Completed', href: '/judge/completed', icon: icon('M3 9l4 4 8-8') },
      { label: 'Rubric', href: '/judge/rubric', icon: icon('M4 3h10v12H4zM7 7h4M7 10h4') },
    ],
  },
];

export const participantNavigation: NavSection[] = [
  {
    items: [
      { label: 'My Team', href: '/team', icon: icon('M6 8a2 2 0 100-4 2 2 0 000 4zM12 8a2 2 0 100-4 2 2 0 000 4zM2 15c0-2 2-4 4-4s4 2 4 4') },
      { label: 'Submit', href: '/submit', icon: icon('M9 3v10M4 8l5-5 5 5') },
      { label: 'Discover Teams', href: '/team/discover', icon: icon('M8 14A6 6 0 108 2a6 6 0 000 12zM16 16l-3-3') },
    ],
  },
];