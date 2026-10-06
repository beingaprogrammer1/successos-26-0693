import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { authClient } from "../lib/auth";
import { useMyReports, useReportStats, useSubmitReport } from "../queries/reports";
import { useCatalogue } from "../queries/progress";
import { BrandButton, BrandLink } from "../components/ui/brand-button";
import { Band, Eyebrow, Panel, Shell, Skeleton, StatusPill } from "../components/ui/primitives";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "bug", label: "Something is broken" },
  { value: "content", label: "Wrong or unclear content" },
  { value: "account", label: "Account or sign-in" },
  { value: "feedback", label: "Feedback or idea" },
  { value: "other", label: "Something else" },
] as const;

const SEVERITIES = [
  { value: "low", label: "Low", hint: "Annoying, not blocking" },
  { value: "medium", label: "Medium", hint: "Getting in my way" },
  { value: "high", label: "High", hint: "Can't use the platform" },
] as const;

const STATUS_TONE = { open: "open", reviewing: "review", resolved: "done" } as const;

type Category = (typeof CATEGORIES)[number]["value"];
type Severity = (typeof SEVERITIES)[number]["value"];

export default function ReportPage() {
  const { data: session } = authClient.useSession();
  const catalogue = useCatalogue();
  const stats = useReportStats();
  const myReports = useMyReports(!!session);
  const submit = useSubmitReport();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("bug");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [area, setArea] = useState("Dashboard");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName((v) => v || session.user.name || "");
      setEmail((v) => v || session.user.email || "");
    }
  }, [session]);

  const areas = [
    "Dashboard",
    "Courses",
    "Success Gems",
    "Achievements",
    "Sign-in",
    "What's New",
    "Terms of Service",
    "Contact",
    ...(catalogue.data?.courses.map((c) => `Course: ${c.title}`) ?? []),
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (details.trim().length < 10) {
      setError("Give us at least a sentence of detail so we can reproduce it.");
      return;
    }
    if (subject.trim().length < 3) {
      setError("Add a short subject line.");
      return;
    }
    try {
      await submit.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        category,
        severity,
        area,
        subject: subject.trim(),
        details: details.trim(),
      });
      setDone(true);
      setSubject("");
      setDetails("");
    } catch {
      setError("Could not send that report. Check your details and try again.");
    }
  }

  return (
    <>
      <Band tone="cream" dots>
        <Shell wide className="py-14 lg:py-18">
          <Eyebrow tone="navy">Report</Eyebrow>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <h1 className="text-[clamp(2.1rem,5.5vw,3.4rem)] uppercase">
                Tell us what
                <br />
                went wrong.
              </h1>
              <p className="mt-5 max-w-xl text-[15.5px] text-muted-ink">
                Bugs, broken links, a lesson that contradicts itself, a Gem count that looks off —
                send it here. Reports are triaged by severity, and fixes get written up on the
                What&apos;s New page.
              </p>
            </div>
            {stats.isLoading ? (
              <Skeleton className="h-24" />
            ) : (
              <Panel className="grid grid-cols-2 divide-x-2 divide-ink/12 p-0">
                <div className="px-4 py-6 text-center">
                  <p className="display text-[30px] leading-none">{stats.data?.total ?? 0}</p>
                  <p className="label mt-2 text-muted-ink">Reports in</p>
                </div>
                <div className="px-4 py-6 text-center">
                  <p className="display text-[30px] leading-none">{stats.data?.resolved ?? 0}</p>
                  <p className="label mt-2 text-muted-ink">Resolved</p>
                </div>
              </Panel>
            )}
          </div>
        </Shell>
      </Band>

      <Band tone="paper" bordered={false}>
        <Shell wide className="grid gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Form */}
          <Panel className="p-7 lg:p-9">
            {done ? (
              <div className="py-8 text-center">
                <span className="inline-flex size-14 items-center justify-center rounded-full border-2 border-ink bg-gem">
                  <CheckCircle2 className="size-7" strokeWidth={2.2} />
                </span>
                <h2 className="mt-6 text-[24px] uppercase">Report received</h2>
                <p className="mx-auto mt-3 max-w-sm text-[14px] text-muted-ink">
                  Thanks — it&apos;s logged with a status of <strong>open</strong>.
                  {session
                    ? " You can follow it in your report history on the right."
                    : " Sign in next time and you'll get a history you can follow."}
                </p>
                <BrandButton variant="navy" className="mt-7" onClick={() => setDone(false)}>
                  Send another report
                </BrandButton>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" value={name} onChange={setName} placeholder="Alex Carter" required />
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <p className="label text-muted-ink">What kind of report is this?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={cn(
                          "rounded-full border-2 border-ink px-4 py-2 text-[13px] font-semibold transition-all",
                          category === c.value
                            ? "bg-ink text-cream hard-sm"
                            : "bg-cream text-ink hover:bg-gem-soft",
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="label text-muted-ink">How bad is it?</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {SEVERITIES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setSeverity(s.value)}
                        className={cn(
                          "rounded-[10px] border-2 border-ink px-4 py-3 text-left transition-all",
                          severity === s.value
                            ? "bg-navy text-cream hard-sm"
                            : "bg-cream hover:bg-gem-soft",
                        )}
                      >
                        <span className="label block">{s.label}</span>
                        <span
                          className={cn(
                            "mt-1.5 block text-[11.5px]",
                            severity === s.value ? "text-cream/70" : "text-muted-ink",
                          )}
                        >
                          {s.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="label text-muted-ink">Where on the platform?</span>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="mt-2 h-12 w-full rounded-[10px] border-2 border-ink bg-cream px-4 text-[14.5px] outline-none focus:bg-paper focus:shadow-[3px_3px_0_0_var(--navy)]"
                  >
                    {areas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>

                <Field
                  label="Subject"
                  value={subject}
                  onChange={setSubject}
                  placeholder="Gem total didn't update after lesson 4"
                  required
                />

                <label className="block">
                  <span className="label text-muted-ink">What happened?</span>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    aria-label="What happened?"
                    rows={6}
                    placeholder="What you did, what you expected, and what happened instead. Include the course and lesson if it's course-related."
                    className="mt-2 w-full resize-y rounded-[10px] border-2 border-ink bg-cream p-4 text-[14.5px] leading-relaxed outline-none placeholder:text-muted-ink/60 focus:bg-paper focus:shadow-[3px_3px_0_0_var(--navy)]"
                  />
                </label>

                {error ? (
                  <div className="flex items-start gap-2.5 rounded-[10px] border-2 border-danger bg-danger/8 p-3 text-[13px] text-danger">
                    <AlertCircle className="mt-[1px] size-4 shrink-0" />
                    {error}
                  </div>
                ) : null}

                <BrandButton
                  type="submit"
                  variant="navy"
                  size="lg"
                  className="w-full"
                  disabled={submit.isPending}
                >
                  {submit.isPending ? (
                    <>
                      <Loader2 className="size-[18px] animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send report
                      <Send className="size-[17px]" />
                    </>
                  )}
                </BrandButton>
              </form>
            )}
          </Panel>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <Panel tone="ink" className="p-7">
              <h2 className="text-[19px] uppercase text-cream">What makes a good report</h2>
              <ul className="mt-5 space-y-3 text-[13.5px] text-cream/75">
                {[
                  "Name the exact course and lesson if it's content-related.",
                  "Say what you expected to happen, then what actually happened.",
                  "Mention your device and browser for anything visual.",
                  "One problem per report — it keeps the triage honest.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gem" />
                    {tip}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel className="p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[19px] uppercase">Your reports</h2>
                {session ? <StatusPill tone="sage">History</StatusPill> : null}
              </div>

              {!session ? (
                <>
                  <p className="mt-4 text-[13.5px] text-muted-ink">
                    Sign in and every report you send is kept here with its status.
                  </p>
                  <BrandLink to="/sign-in" variant="paper" className="mt-5 w-full">
                    Sign in
                  </BrandLink>
                </>
              ) : myReports.isLoading ? (
                <div className="mt-5 space-y-3">
                  {[0, 1].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (myReports.data?.length ?? 0) === 0 ? (
                <p className="mt-4 text-[13.5px] text-muted-ink">
                  Nothing sent yet. Hopefully it stays that way.
                </p>
              ) : (
                <ul className="mt-5 divide-y-2 divide-ink/10">
                  {myReports.data?.map((r) => (
                    <li key={r.id} className="py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13.5px] font-semibold">{r.subject}</p>
                        <StatusPill tone={STATUS_TONE[r.status as keyof typeof STATUS_TONE] ?? "open"}>
                          {r.status}
                        </StatusPill>
                      </div>
                      <p className="label mt-1.5 text-muted-ink">
                        {r.area} · {r.severity}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </Shell>
      </Band>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="label text-muted-ink">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-[10px] border-2 border-ink bg-cream px-4 text-[14.5px] outline-none placeholder:text-muted-ink/60 focus:bg-paper focus:shadow-[3px_3px_0_0_var(--navy)]"
      />
    </label>
  );
}
