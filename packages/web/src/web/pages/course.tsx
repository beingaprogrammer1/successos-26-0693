import { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Check, Clock, ExternalLink, Loader2, Lock, Trophy } from "lucide-react";
import { authClient } from "../lib/auth";
import { useCourse, useToggleLesson } from "../queries/progress";
import { CourseIcon } from "../components/course-icon";
import { BrandLink } from "../components/ui/brand-button";
import { GemChip, GemIcon } from "../components/ui/gem";
import { Band, Panel, Progress, Shell, Skeleton, StatusPill } from "../components/ui/primitives";
import { cn } from "@/lib/utils";

const LEVEL_TONE = { Foundation: "gem", Core: "sage", Advanced: "navy" } as const;

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const course = useCourse(slug);
  const toggle = useToggleLesson(slug);
  const { data: session } = authClient.useSession();
  const [busyLesson, setBusyLesson] = useState<string | null>(null);

  if (course.isLoading) {
    return (
      <Shell wide className="py-16">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="mt-6 h-40" />
        <div className="mt-6 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </Shell>
    );
  }

  if (course.isError || !course.data) {
    return (
      <Shell className="py-24">
        <Panel className="mx-auto max-w-md p-9 text-center">
          <h1 className="text-xl uppercase">Course not found</h1>
          <p className="mt-3 text-sm text-muted-ink">
            That course link doesn&apos;t match anything in the catalogue.
          </p>
          <BrandLink to="/courses" variant="navy" className="mt-6">
            Back to courses
          </BrandLink>
        </Panel>
      </Shell>
    );
  }

  const c = course.data;

  function onToggle(lessonId: string, completed: boolean) {
    if (!session) return;
    setBusyLesson(lessonId);
    toggle.mutate(
      { lessonId, completed },
      { onSettled: () => setBusyLesson(null) },
    );
  }

  return (
    <>
      {/* ── Course header ─────────────────────────────────────── */}
      <Band tone="navy" dots>
        <Shell wide className="py-12 lg:py-16">
          <Link
            to="/courses"
            className="label inline-flex items-center gap-2 text-cream/70 hover:text-gem"
          >
            <ArrowLeft className="size-4" />
            All courses
          </Link>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <div>
              <div className="flex items-start gap-4">
                <CourseIcon
                  icon={c.icon}
                  accent={c.accent}
                  className="size-14 border-cream/30"
                  iconClassName="size-6"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusPill tone={LEVEL_TONE[c.level]}>{c.level}</StatusPill>
                    {c.complete ? <StatusPill tone="gem">Course complete</StatusPill> : null}
                  </div>
                  <h1 className="mt-3 text-[clamp(2rem,5.5vw,3.2rem)] uppercase text-cream">
                    {c.title}
                  </h1>
                  <p className="mt-1.5 text-[15px] font-semibold text-gem">{c.tagline}</p>
                </div>
              </div>

              <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-cream/75">
                {c.description}
              </p>

              <div className="mt-8">
                <p className="label text-gem">What you will walk away with</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {c.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3 text-[13.5px] text-cream/80">
                      <span className="mt-[2px] inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-gem">
                        <Check className="size-3 text-gem" strokeWidth={3.5} />
                      </span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={c.notebookUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex h-[52px] items-center gap-2 rounded-[10px] border-2 border-ink bg-gem px-7 text-[15px] font-semibold hard-sm transition-all hover:shadow-[5px_5px_0_0_var(--ink)]"
              >
                Open the NotebookLM workspace
                <ExternalLink className="size-[17px]" />
              </a>
            </div>

            {/* Progress card */}
            <Panel tone="cream" shadow="gem" className="p-7">
              <p className="label text-muted-ink">Your progress</p>
              <p className="display mt-3 text-[46px] leading-none">{c.percent}%</p>
              <Progress percent={c.percent} tone="navy" className="mt-4" />
              <p className="mt-3 text-[13px] text-muted-ink">
                {c.done} of {c.lessons.length} lessons ticked
              </p>

              <dl className="mt-6 space-y-3 border-t-2 border-ink/15 pt-5 text-[13px]">
                <Row label="Lesson Gems" value={<GemChip amount={c.lessonGems} size="sm" tone="outline" />} />
                <Row
                  label="Completion bonus"
                  value={<GemChip amount={c.completionBonus} prefix="+" size="sm" tone={c.complete ? "gem" : "outline"} />}
                />
                <Row
                  label="Total time"
                  value={
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Clock className="size-3.5 text-navy" />
                      {c.totalMinutes} min
                    </span>
                  }
                />
              </dl>

              {!session ? (
                <BrandLink to="/sign-in?mode=create" variant="navy" className="mt-6 w-full">
                  Sign in to track lessons
                </BrandLink>
              ) : null}
            </Panel>
          </div>
        </Shell>
      </Band>

      {/* ── Lessons ───────────────────────────────────────────── */}
      <Band tone="paper" bordered={false}>
        <Shell wide className="py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.6rem,4vw,2.3rem)] uppercase">The lessons</h2>
            <p className="text-[13px] text-muted-ink">
              {session
                ? "Tick a lesson once you have studied it — Gems land immediately."
                : "Sign in to tick lessons off and collect Gems."}
            </p>
          </div>

          <ol className="mt-8 space-y-4">
            {c.lessons.map((lesson, i) => {
              const busy = busyLesson === lesson.id;
              return (
                <li key={lesson.id}>
                  <Panel
                    tone={lesson.completed ? "gem-soft" : "paper"}
                    className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center"
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(lesson.id, !lesson.completed)}
                      disabled={!session || busy}
                      title={session ? "Toggle lesson" : "Sign in to track lessons"}
                      className={cn(
                        "inline-flex size-12 shrink-0 items-center justify-center rounded-[11px] border-2 border-ink transition-all",
                        lesson.completed ? "bg-navy text-cream" : "bg-cream hover:bg-gem",
                        (!session || busy) && "cursor-not-allowed opacity-70",
                      )}
                    >
                      {busy ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : !session ? (
                        <Lock className="size-4 text-muted-ink" />
                      ) : lesson.completed ? (
                        <Check className="size-6" strokeWidth={3} />
                      ) : (
                        <span className="display text-[17px] text-muted-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3
                          className={cn(
                            "text-[18px] uppercase",
                            lesson.completed && "line-through decoration-2 decoration-ink/40",
                          )}
                        >
                          {lesson.title}
                        </h3>
                        {lesson.completed ? <StatusPill tone="done">Done</StatusPill> : null}
                      </div>
                      <p className="mt-1.5 text-[13.5px] text-muted-ink">{lesson.summary}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-ink">
                        <Clock className="size-3.5" />
                        {lesson.minutes}m
                      </span>
                      <GemChip
                        amount={lesson.gems}
                        prefix="+"
                        size="sm"
                        tone={lesson.completed ? "gem" : "outline"}
                      />
                    </div>
                  </Panel>
                </li>
              );
            })}
          </ol>

          {/* Completion banner */}
          <Panel
            tone={c.complete ? "navy" : "cream"}
            className="mt-9 flex flex-wrap items-center justify-between gap-5 p-7"
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[11px] border-2 border-ink bg-gem">
                <Trophy className="size-5" strokeWidth={2.2} />
              </span>
              <div>
                <h3 className={cn("text-[19px] uppercase", c.complete && "text-cream")}>
                  {c.complete ? "Completion bonus banked" : `Clear all ${c.lessons.length} for +${c.completionBonus} Gems`}
                </h3>
                <p className={cn("mt-1.5 text-[13px]", c.complete ? "text-cream/70" : "text-muted-ink")}>
                  {c.complete
                    ? `The ${c.title} bonus is in your ledger. Check your dashboard.`
                    : `${c.lessons.length - c.done} lesson${c.lessons.length - c.done === 1 ? "" : "s"} to go.`}
                </p>
              </div>
            </div>
            <BrandLink to={session ? "/dashboard" : "/sign-in"} variant={c.complete ? "gem" : "navy"}>
              <GemIcon className="size-4" />
              {session ? "Open dashboard" : "Sign in"}
            </BrandLink>
          </Panel>

          {/* Related achievements */}
          {c.achievements.length > 0 ? (
            <div className="mt-14">
              <h2 className="text-[clamp(1.4rem,3.2vw,1.9rem)] uppercase">
                Achievements in play here
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {c.achievements.map((a) => (
                  <Panel key={a.id} tone="cream" className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[16px] uppercase">{a.title}</h3>
                      <StatusPill tone={a.tier === "Legend" ? "navy" : "gem"}>{a.tier}</StatusPill>
                    </div>
                    <p className="mt-2 text-[12.5px] text-muted-ink">{a.description}</p>
                    <GemChip amount={a.gems} prefix="+" size="sm" tone="outline" className="mt-3" />
                  </Panel>
                ))}
              </div>
            </div>
          ) : null}
        </Shell>
      </Band>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-ink">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
