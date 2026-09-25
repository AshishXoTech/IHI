"use client";

import { clsx } from "clsx";

export type LoginRole = "participant" | "organizer" | "judge";

const TABS: { id: LoginRole; label: string }[] = [
  { id: "participant", label: "Participant" },
  { id: "organizer", label: "Organizer" },
  { id: "judge", label: "Judge" },
];

interface RoleTabsProps {
  value: LoginRole;
  onChange: (role: LoginRole) => void;
}

export function RoleTabs({ value, onChange }: RoleTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sign in as"
      className="flex w-full rounded-lg border border-gray-200 bg-gray-50 p-1"
    >
      {TABS.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "flex-1 rounded-md px-3 py-2 font-body text-sm font-semibold transition-colors duration-200",
              active
                ? "bg-black text-white shadow-sm"
                : "text-gray-500 hover:text-black"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}