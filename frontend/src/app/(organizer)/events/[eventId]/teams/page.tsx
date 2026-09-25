import { TeamsClient } from '@/components/events/TeamsClient';

export const metadata = {
  title: 'Team Formation Oversight | IHI Console',
};

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  // Await the params to resolve Next.js 15 sync/async params requirements
  const resolvedParams = await params;
  
  return <TeamsClient eventId={resolvedParams.eventId} />;
}