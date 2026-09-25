import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Button, StatusBadge, Card } from '@/components/ui';
import { organizerNavigation } from '@/components/layout/navigation';

export default function OrganizerDashboardPage() {
  return (
    <DashboardShell
      role="organizer"
      userName="Alex Chen"
      userEmail="alex@stanford.edu"
      eventName="Stanford TreeHacks 2025"
      navigation={organizerNavigation}
      headerActions={
        <Button size="sm" icon={<PlusIcon />}>
          New Event
        </Button>
      }
    >
      {/*
        Tower register surface isolation:
        DashboardShell / route layout should paint tower-base.
        Local wrapper reinforces max width + 8px spacing grid.
      */}
      <div className="mx-auto max-w-content p-3 md:p-4 lg:p-5">
        <PageHeader
          eyebrow="Command Center"
          title="Welcome back, Alex"
          description="Here's the live pulse of your active events."
          actions={
            <>
              <Button variant="secondary" size="sm">
                Export
              </Button>
              <Button size="sm">Publish Update</Button>
            </>
          }
        />

        {/* Metric row — logic preserved (values, deltas, sparklines, helpers) */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Registrations"
            value="1,247"
            delta={{ value: 12, trend: 'up' }}
            accent="primary"
            sparkline={[100, 120, 115, 140, 135, 180, 220, 240, 260]}
            helper="vs. last 24h"
          />
          <MetricCard
            label="Teams Formed"
            value="284"
            delta={{ value: 8, trend: 'up' }}
            accent="secondary"
            sparkline={[20, 25, 30, 35, 45, 55, 70, 85, 95]}
            helper="86% completion"
          />
          <MetricCard
            label="Submissions"
            value="196"
            delta={{ value: 24, trend: 'up' }}
            accent="success"
            sparkline={[5, 10, 15, 25, 40, 60, 90, 140, 196]}
            helper="of 284 expected"
          />
          <MetricCard
            label="Judging Progress"
            value="72%"
            delta={{ value: 5, trend: 'up' }}
            accent="warning"
            helper="42 of 58 done"
          />
        </div>

        {/* Main grid */}
        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <SectionCard
            title="Registration Health"
            eyebrow="Live"
            className="lg:col-span-2"
            actions={
              <Button variant="ghost" size="sm">
                View details
              </Button>
            }
          >
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { label: 'Verified', value: '1,189', status: 'success' as const },
                { label: 'Pending', value: '42', status: 'warning' as const },
                { label: 'Blocked', value: '16', status: 'danger' as const },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-md border border-ink-secondary/30 bg-tower-base p-2"
                >
                  <StatusBadge status={s.status} label={s.label} size="sm" />
                  <p className="mt-2 font-mono text-heading-md font-semibold tabular-nums text-surface-raised">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {['MIT', 'Stanford', 'CMU', 'Berkeley'].map((school, i) => {
                const count = [312, 278, 189, 156][i];
                const pct = (count / 1247) * 100;
                return (
                  <div key={school}>
                    <div className="mb-1 flex justify-between font-body text-body-sm">
                      <span className="text-signal-neutral">{school}</span>
                      <span className="font-mono tabular-nums text-signal-neutral">
                        {count}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-tower-base">
                      {/* Solid accent fill — no multi-hue decorative gradient */}
                      <div
                        className="h-full rounded-full bg-accent-signal"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Publish Readiness" eyebrow="Gate">
            <div className="flex flex-col items-center">
              <ProgressRing
                value={87}
                label="87%"
                sublabel="Ready"
                accent="success"
                size={160}
              />
              <div className="mt-3 w-full space-y-1">
                {[
                  { label: 'Judging complete', done: true },
                  { label: 'Rubrics locked', done: true },
                  { label: 'Conflicts resolved', done: true },
                  { label: 'Winners confirmed', done: false },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-2 font-body text-body-sm"
                  >
                    <span
                      className={
                        c.done
                          ? 'flex h-3 w-3 items-center justify-center rounded-full bg-signal-good/20 text-signal-good'
                          : 'flex h-3 w-3 items-center justify-center rounded-full bg-tower-base text-signal-neutral'
                      }
                    >
                      {c.done ? '✓' : '○'}
                    </span>
                    <span
                      className={
                        c.done ? 'text-surface-raised' : 'text-signal-neutral'
                      }
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Activity feed + AI briefing — content/logic preserved */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <SectionCard
            title="Live Activity"
            eyebrow="Stream"
            actions={
              <StatusBadge status="success" label="Live" pulse size="sm" />
            }
          >
            <div className="space-y-1">
              {[
                {
                  title: 'New submission',
                  desc: 'Team Nebula submitted "AI Study Buddy"',
                  time: '2m ago',
                  icon: 'submission' as const,
                },
                {
                  title: 'Judge scored',
                  desc: 'Dr. Rao scored 4 submissions',
                  time: '8m ago',
                  icon: 'score' as const,
                },
                {
                  title: 'Team formed',
                  desc: 'Team Quantum reached 4 members',
                  time: '12m ago',
                  icon: 'team' as const,
                },
                {
                  title: 'Registration verified',
                  desc: '23 new participants verified',
                  time: '18m ago',
                  icon: 'verified' as const,
                },
              ].map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-md p-2 transition-colors duration-micro hover:bg-tower-base"
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-tower-base text-accent-signal">
                    <ActivityIcon type={a.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-body-sm font-medium text-surface-raised">
                      {a.title}
                    </p>
                    <p className="truncate font-body text-body-sm text-signal-neutral">
                      {a.desc}
                    </p>
                  </div>
                  <span className="flex-shrink-0 font-mono text-label text-signal-neutral">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="AI Briefing"
            eyebrow="Gemini · Live insights"
            actions={
              <Button variant="ghost" size="sm">
                Refresh
              </Button>
            }
          >
            <Card className="border border-accent-signal/20 bg-tower-base p-2">
              <div className="flex items-start gap-2">
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm bg-accent-signal text-surface-raised">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-body-sm leading-relaxed text-surface-raised">
                    Submission velocity has doubled in the last 6 hours. Consider
                    deploying 2 additional judges to the{' '}
                    <strong className="text-accent-signal">AI/ML track</strong> to
                    maintain the 4-hour turnaround SLA.
                  </p>
                  <div className="mt-2 flex gap-1">
                    <Button size="sm" variant="outline">
                      Assign judges
                    </Button>
                    <Button size="sm" variant="ghost">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M7 2v10M2 7h10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

function ActivityIcon({
  type,
}: {
  type: 'submission' | 'score' | 'team' | 'verified';
}) {
  switch (type) {
    case 'submission':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3 2h5l3 3v7H3V2z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M8 2v3h3" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'score':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 2l1.2 2.4L11 5l-2 2 .5 2.8L7 8.8 4.5 9.8 5 7 3 5l2.8-.6L7 2z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'team':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="9.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M2 12c0-1.7 1.3-3 3-3s3 1.3 3 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'verified':
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3 7l3 3 5-5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}