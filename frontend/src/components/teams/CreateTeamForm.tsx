"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";

// Usage: <CreateTeamForm eventId={id} maxTeamSize={4} onCreated={fn} />

interface CreateTeamFormProps {
  eventId?: string;
  maxTeamSize?: number;
  onCreated?: (teamId: string) => void;
  onSuccess?: (teamId: string) => void;
  onCancel?: () => void;
}

export function CreateTeamForm({
  eventId,
  maxTeamSize = 4,
  onCreated,
  onSuccess,
  onCancel,
}: CreateTeamFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [track, setTrack] = useState("");
  const [maxMembers, setMaxMembers] = useState(maxTeamSize);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const fe: Record<string, string> = {};

    if (!name.trim()) fe.name = "Team name is required.";
    if (name.trim().length > 48) fe.name = "Name must be 48 characters or fewer.";
    if (maxMembers < 1 || maxMembers > 10)
      fe.maxMembers = "Team size must be between 1 and 10.";
    if (maxMembers > maxTeamSize)
      fe.maxMembers = `Event limit is ${maxTeamSize} members per team.`;

    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId || undefined,
          name: name.trim(),
          description: description.trim() || null,
          skills_wanted: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          track: track.trim() || null,
          max_members: maxMembers,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        if (json.code === "duplicate_name") {
          setFieldErrors({ name: "A team with this name already exists for this event." });
        } else if (json.code === "already_on_team") {
          setError("You're already on a team for this event. Leave it before creating another.");
        } else if (json.code === "no_event") {
          setError("No active event found. An organizer must create an event first.");
        } else {
          setError(json.error || "Could not create team.");
        }
        return;
      }

      const createdTeamId = json.data?.id || json.team?.id;

      if (createdTeamId) {
        if (onCreated) onCreated(createdTeamId);
        if (onSuccess) onSuccess(createdTeamId);

        if (!onCreated && !onSuccess) {
          router.push(`/team/${createdTeamId}`);
        }
      } else {
        setError("Team created, but failed to retrieve team ID.");
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card padding="lg" className="max-w-lg w-full">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Create a team
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Team name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
          }}
          error={fieldErrors.name}
          placeholder="e.g. Neural Forge"
          maxLength={48}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="team-desc"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Description
          </label>
          <textarea
            id="team-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="What are you planning to build?"
            className="w-full rounded-md px-3 py-2 text-sm bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border border-[var(--border-default)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-bg)] transition-colors duration-150 motion-reduce:transition-none"
          />
        </div>

        <Input
          label="Skills wanted"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          hint="Comma-separated, e.g. React, Python, Figma"
          placeholder="React, Python, Figma"
        />

        <Input
          label="Track / theme"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          placeholder="Optional — AI/ML, FinTech…"
        />

        <Input
          label="Max members"
          type="number"
          value={String(maxMembers)}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
          error={fieldErrors.maxMembers}
          min={1}
          max={10}
        />

        {error && (
          <p className="text-xs text-rose-500 font-medium" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-default)]">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading} disabled={!name.trim()}>
            Create team & Workspace →
          </Button>
        </div>
      </form>
    </Card>
  );
}