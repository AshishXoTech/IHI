import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { JudgeNav } from "@/components/judging/JudgeNav";

export default async function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole("judge");
  } catch {
    redirect("/login?error=SESSION_EXPIRED");
  }

  return (
    <div
      data-register="tower"
      className="theme-tower relative min-h-screen bg-black text-white antialiased overflow-hidden"
    >
      {/* ==========================================================================
          PREMIUM BACKGROUND: Diagonal { I H I } + Blueprint Grid
          ========================================================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Subtle Dark Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
          }}
        />

        {/* Diagonal Giant { I H I } Background */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 -rotate-12 items-center gap-6 opacity-[0.06]">
          <span className="font-display text-[16rem] md:text-[22rem] font-black text-gray-500">
            {"{"}
          </span>
          <span
            className="font-display text-[18rem] md:text-[28rem] font-black tracking-tighter"
            style={{ color: "#E4574C" }} /* Brand Red */
          >
            I
          </span>
          <span
            className="font-display text-[18rem] md:text-[28rem] font-black tracking-tighter"
            style={{ color: "#2FB67C" }} /* Brand Green */
          >
            H
          </span>
          <span
            className="font-display text-[18rem] md:text-[28rem] font-black tracking-tighter"
            style={{ color: "#3E6FF3" }} /* Brand Blue */
          >
            I
          </span>
          <span className="font-display text-[16rem] md:text-[22rem] font-black text-gray-500">
            {"}"}
          </span>
        </div>
      </div>

      {/* ==========================================================================
          FOREGROUND CONTENT
          ========================================================================== */}
      <div className="relative z-10">
        <JudgeNav />
        {/* Offset fixed JudgeNav */}
        <div className="pt-14 md:pt-16">{children}</div>
      </div>
    </div>
  );
}