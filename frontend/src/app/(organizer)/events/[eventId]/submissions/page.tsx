import { SubmissionsClient } from "@/components/events/SubmissionsClient";

export const metadata = {
  title: "Submissions | IHI Console",
};

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <SubmissionsClient eventId={eventId} />;
}
