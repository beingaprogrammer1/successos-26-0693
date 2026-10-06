# SuccessOS 26 — Design

SuccessOS 26 is a web learning platform for the Success brand ("Study & Work Smarter"). Members sign in,
work through six courses hosted on NotebookLM, tick off lessons, unlock achievements, and earn **Success Gems**
— the platform's currency. A dashboard hub links Courses, What's New, Terms of Service, Report and Contact.

Visual direction: **confident editorial-brutalist corporate**. Full-bleed color bands stacked down the page
(navy → cream → ink), hard 2px ink borders with offset solid shadows, tight uppercase display headlines,
pill badges, dotted-grid texture on hero bands. No soft pastel gradients, no glassmorphism.

## Brand & Colors

Web/desktop tokens live in `packages/web/src/web/styles.css` as CSS variables, surfaced through Tailwind 4
`@theme` so classes like `bg-navy`, `text-ink`, `border-ink`, `bg-gem` work everywhere.

| Token | Hex | Use |
|-------|-----|-----|
| navy | `#0F3473` | Brand dominant — hero band, footer accents, primary buttons (sampled from the logos) |
| navy-deep | `#0A2350` | Navy band gradients, hover states |
| ink | `#12161C` | Near-black band, all borders, body headings |
| cream | `#F4F1EB` | Page background, card surfaces on navy |
| paper | `#FFFFFF` | Card surfaces on cream/ink |
| gem | `#E8B341` | Success Gems: coin icons, balance figures, badges |
| gem-soft | `#FBEFCF` | Gem chip backgrounds, progress track fill |
| sage | `#B6C6BF` | Tertiary band (testimonials / stats), muted cards |
| muted | `#5C6577` | Secondary text |
| line | `#12161C` | Hairlines are full ink at 2px, never grey |
| danger | `#C0392B` | Report severity, destructive |

Signature treatments:
- `.hard-shadow` → `box-shadow: 5px 5px 0 0 var(--ink)` on cards and buttons; `4px 4px` on small chips.
- `.dot-grid` → radial-dot background pattern used on navy and gem bands.
- Borders: `border-2 border-ink`, radius `12px` on cards, `999px` on pills, `10px` on buttons.

## Typography

- **Display**: Archivo (700/800/900), uppercase, `letter-spacing: -0.02em`, tight leading. Headlines and stat figures.
- **Body**: Poppins (400/500/600). Line height 1.65 for paragraphs.
- **Script**: the brand wordmark is an image (`/images/logo-primary.png`) — never re-typed in a font.
- Both loaded from Google Fonts in `index.html`. Scale: hero 64–76px, section title 38–44px, card title 20px,
  body 15–16px, label 11–12px uppercase tracked `0.14em`.

## Pages

All pages under `packages/web/src/web/pages/`, routed in `app.tsx`. Public shell = marketing nav + footer;
app shell = sidebar-less top nav with the Gem balance chip.

- **Landing** (`index.tsx`) — hero on navy dot-grid, gem explainer, 6-course grid, how-it-works 1-2-3 on ink band, achievements, CTA.
- **Sign in** (`sign-in.tsx`) — Google (Runable managed) + email/password, tabbed sign-in / create account.
- **Dashboard** (`dashboard.tsx`) — gem balance, progress %, lessons done, streak of achievements, continue-learning card, tab tiles for every section, recent gem ledger.
- **Courses** (`courses.tsx`) — all six courses with progress bars and gem payouts.
- **Course detail** (`course.tsx`) — NotebookLM launch button, lesson checklist (toggles award gems), course achievements.
- **What's New** (`whats-new.tsx`) — release feed, version pills, dated entries.
- **Terms of Service** (`terms.tsx`) — numbered sections, sticky in-page nav.
- **Report** (`report.tsx`) — bug/issue/feedback form + the member's past reports and their status.
- **Contact** (`contact.tsx`) — YouTube + TikTok cards, response-time note.

## Key User Flows

1. Landing → Sign in (Google or email) → Dashboard.
2. Dashboard → Courses → course detail → open NotebookLM → tick lessons → Gems credited optimistically, achievements auto-unlock with a bonus payout.
3. Dashboard → Report → submit issue → appears in "Your reports" as Open.

## Architecture

- Courses, lessons, achievements and changelog entries are static curriculum data in `src/api/data/curriculum.ts` (single source of truth, no CMS).
- DB (Drizzle/Turso): Better Auth tables + `lesson_completions`, `gem_ledger`, `unlocked_achievements`, `reports`.
- Gems are always derived from `gem_ledger` sums so the balance can never drift from what earned it.
- Auth: Better Auth with Runable managed Google + email/password. Protected routes wrap in `ProtectedRoute`.
- Queries in `src/web/queries/` (one file per feature), optimistic updates on lesson toggles.
