import { EventsListClient } from "@/components/events/EventsListClient";

export const metadata = {
  title: "Event Management | IHI Console",
  description: "Manage your hackathons and events.",
};

export default function EventsPage() {
  return <EventsListClient />;
}
