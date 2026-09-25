import { Suspense, use } from "react";
import { ScoreWorkspace } from "@/components/judging/ScoreWorkspace";

export default function JudgeScoringPage({
  params,
  searchParams,
}: {
  params: Promise<{ submissionId: string }>;
  searchParams: Promise<{ eventId?: string }>;
}) {
  const { submissionId } = use(params);
  const { eventId } = use(searchParams);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center font-body text-sm text-gray-500">
          Loading scoring workspace…
        </div>
      }
    >
      <ScoreWorkspace submissionId={submissionId} eventId={eventId} />
    </Suspense>
  );
}