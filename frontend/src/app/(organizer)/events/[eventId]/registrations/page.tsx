import { RegistrationsClient } from '@/components/events/RegistrationsClient';

export const metadata = {
  title: 'Registrations | IHI Console',
};

export default async function RegistrationsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const resolvedParams = await params;
  return <RegistrationsClient eventId={resolvedParams.eventId} />;
}