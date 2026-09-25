import { EventSectionPlaceholder } from '@/components/events/EventSectionPlaceholder';

export const metadata = {
  title: 'Judging | IHI Console',
};

export default async function JudgingPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <EventSectionPlaceholder
      eventId={resolvedParams.eventId}
      title="Judging"
      eyebrow="Evaluation Console"
      description="Assign judges, lock rubrics, and track scoring progress."
    />
  );
}