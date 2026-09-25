/**
 * Organizer Layout - Premium White Register (Ink/Gold Accents).
 * Provides the global wrapper setting up our custom theme values.
 */
export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-register="tower"
      className="min-h-screen bg-[#F9F9F6] text-[#0A0A0A] selection:bg-[#C6A24A]/20 selection:text-[#0A0A0A] antialiased"
    >
      {children}
    </div>
  );
}