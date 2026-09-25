/**
 * Organizer routes — black register (white/gold ink).
 * Do NOT mount a second OrganizerNav here; DashboardShell already has sidebar + header.
 */
export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-register="tower"
      className="theme-tower min-h-screen bg-black text-white antialiased"
    >
      {children}
    </div>
  );
}