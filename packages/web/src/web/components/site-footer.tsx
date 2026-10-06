import { Link } from "wouter";
import { SiYoutube, SiTiktok } from "react-icons/si";
import { ScriptLogo } from "./ui/brand";
import { Shell } from "./ui/primitives";
import { GemIcon } from "./ui/gem";

export const SOCIALS = [
  {
    label: "YouTube",
    handle: "@Success26-real",
    href: "https://www.youtube.com/@Success26-real",
    Icon: SiYoutube,
    blurb: "Full lesson walkthroughs, study breakdowns and platform updates.",
  },
  {
    label: "TikTok",
    handle: "@success_real",
    href: "https://www.tiktok.com/@success_real",
    Icon: SiTiktok,
    blurb: "Short, sharp clips — one idea from the courses at a time.",
  },
];

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Courses", to: "/courses" },
      { label: "What's New", to: "/whats-new" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Report a problem", to: "/report" },
      { label: "Contact / Find us", to: "/contact" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-cream">
      <Shell wide className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <ScriptLogo variant="primary" className="h-28 w-auto border-cream/30" />
            <p className="mt-5 max-w-xs text-sm text-cream/65">
              SuccessOS 26 is a six-course learning system for studying smarter, working better and
              handling people and money with a straight spine.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="label text-gem">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream/70 transition-colors hover:text-gem"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="label text-gem">Find us</p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-cream/70 transition-colors hover:text-gem"
                  >
                    <s.Icon className="size-4" />
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-3 py-1.5 text-[12px] text-cream/70">
              <GemIcon className="size-3.5 text-gem" />
              Earn Gems as you learn
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t-2 border-cream/15 pt-6 text-[12.5px] text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SuccessOS 26. Study &amp; work smarter.</p>
          <p>
            Success Gems are a progress reward with no monetary value. See the{" "}
            <Link to="/terms" className="underline decoration-gem/60 hover:text-gem">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </Shell>
    </footer>
  );
}
