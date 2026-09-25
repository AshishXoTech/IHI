/**
 * Participant shell — world-class DashboardShell wrapper.
 * Keeps participant routes visually consistent without touching organizer/judge layouts.
 */
import { DashboardShell } from "@/components/layout/DashboardShell";
import { participantNavigation } from "@/components/layout/navigation";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-register="tower" className="min-h-screen">
      <DashboardShell
        role="participant"
        userName="Jordan Kim"
        userEmail="jordan@berkeley.edu"
        eventName="Spring Innovation Challenge"
        navigation={participantNavigation}
      >
        {children}
      </DashboardShell>
    </div>
  );
}