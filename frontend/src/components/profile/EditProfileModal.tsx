"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import type { ParticipantProfile } from "@/types/shared";

interface EditProfileModalProps {
  profile: ParticipantProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updated: ParticipantProfile) => void;
}

export function EditProfileModal({ profile, isOpen, onClose, onSaved }: EditProfileModalProps) {
  const [headline, setHeadline] = useState(profile.headline || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [techInput, setTechInput] = useState((profile.tech_stack || []).join(", "));
  const [github, setGithub] = useState(profile.github_url || "");
  const [linkedin, setLinkedin] = useState(profile.linkedin_url || "");
  const [portfolio, setPortfolio] = useState(profile.portfolio_url || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tech_stack = techInput.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch(`/api/profile/${profile.user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, bio, tech_stack, github_url: github, linkedin_url: linkedin, portfolio_url: portfolio }),
      });
      const json = await res.json();
      if (json.ok) {
        onSaved(json.data);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--organizer-ink-primary)]/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-[var(--organizer-surface)] border border-[var(--organizer-border)] shadow-xl">
        <div className="p-6 border-b border-[var(--organizer-border)] flex justify-between items-center bg-[var(--organizer-surface-hover)]">
          <h3 className="text-xl font-bold font-display text-[var(--organizer-ink-primary)]">Edit Profile</h3>
          <button onClick={onClose} className="text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)] transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-mono uppercase font-semibold text-[var(--organizer-ink-muted)] mb-1.5 block">Headline</label>
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="bg-[var(--organizer-surface)] border-[var(--organizer-border)] text-[var(--organizer-ink-primary)] focus:ring-[var(--organizer-gold)]" />
          </div>

          <div>
            <label className="text-xs font-mono uppercase font-semibold text-[var(--organizer-ink-muted)] mb-1.5 block">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-[var(--organizer-border)] bg-[var(--organizer-surface)] p-3 text-sm text-[var(--organizer-ink-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase font-semibold text-[var(--organizer-ink-muted)] mb-1.5 block">Tech Stack (comma separated)</label>
            <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} className="bg-[var(--organizer-surface)] border-[var(--organizer-border)] text-[var(--organizer-ink-primary)] focus:ring-[var(--organizer-gold)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase font-semibold text-[var(--organizer-ink-muted)] mb-1.5 block">GitHub URL</label>
              <Input value={github} onChange={(e) => setGithub(e.target.value)} className="bg-[var(--organizer-surface)] border-[var(--organizer-border)] text-[var(--organizer-ink-primary)] focus:ring-[var(--organizer-gold)]" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase font-semibold text-[var(--organizer-ink-muted)] mb-1.5 block">LinkedIn URL</label>
              <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="bg-[var(--organizer-surface)] border-[var(--organizer-border)] text-[var(--organizer-ink-primary)] focus:ring-[var(--organizer-gold)]" />
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-[var(--organizer-border)] flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose} className="bg-[var(--organizer-surface-hover)] border-[var(--organizer-border)] text-[var(--organizer-ink-secondary)]">Cancel</Button>
            <Button type="submit" loading={loading} className="bg-[var(--organizer-ink-primary)] text-white hover:bg-[var(--organizer-ink-secondary)] border-none">
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}