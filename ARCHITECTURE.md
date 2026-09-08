# Portfolio Architecture & Engineering Guide

This document outlines the architecture, directory structure, data flow, and engineering conventions of Parth Khansali's personal developer portfolio.

---

## 1. Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Runtime**: React 19 (Client & Server Components)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Vanilla CSS variables for 60fps GPU transforms
- **Animations**: Framer Motion 12, Lenis smooth scrolling, Canvas 2D particle systems
- **Backend & Auth**: Firebase Auth (Google Sign-In) + Cloud Firestore
- **Deployment**: Static Site Export (`output: "export"` compatible with cloud static hosts or Node servers)

---

## 2. Directory Structure

```
.
├── public/                     # Static media, SVG runes, generated PDF resume
├── scripts/
│   └── generate_resume.js      # Type-safe A4 PDF resume builder (pdf-lib)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Edge & static API route handlers
│   │   │   ├── dev-metrics/    # Live GitHub / WakaTime / Spotify data
│   │   │   └── visitor/geo/    # Visitor geolocation resolver
│   │   ├── projects/           # Dedicated /projects archive page + layout metadata
│   │   ├── resume/             # Dedicated /resume preview route + layout metadata
│   │   ├── globals.css         # Custom animations, scanlines, SGA rune styles
│   │   ├── layout.tsx          # Root HTML layout, SEO JSON-LD schema, global providers
│   │   ├── page.tsx            # Main single-page interactive experience
│   │   ├── robots.ts           # Dynamic robots.txt
│   │   └── sitemap.ts          # Automated XML sitemap
│   ├── components/
│   │   ├── CustomCursor.tsx    # Zero-lag GPU cursor with link hover states
│   │   ├── GlowCard.tsx        # High-performance CSS-variable mouse glow card
│   │   ├── RevealText.tsx      # Scroll-triggered typographic reveal
│   │   ├── SmoothScroll.tsx    # Lenis inertia scrolling container
│   │   ├── assistant/          # Interactive floating AI companion
│   │   │   └── CursorAssistant.tsx
│   │   ├── dashboard/          # Developer Systems Deck
│   │   │   ├── DevDashboard.tsx
│   │   │   ├── DevMetrics.tsx
│   │   │   ├── GitTerminal.tsx
│   │   │   └── MusicWidget.tsx
│   │   ├── effects/            # Visual canvas & lighting effects
│   │   │   ├── CursorSpotlight.tsx
│   │   │   ├── EnchantingParticles.tsx
│   │   │   ├── ScrollProgress.tsx
│   │   │   └── StarfieldCanvas.tsx
│   │   ├── footer/
│   │   │   └── SiteFooter.tsx
│   │   ├── icons/              # Clean bespoke SVG icons
│   │   │   └── InstagramIcon.tsx
│   │   ├── navigation/         # Navigation controls
│   │   │   ├── CommandPalette.tsx # Keyboard-accessible Cmd+K quick launcher
│   │   │   └── Navbar.tsx         # Responsive glass navbar with mobile drawer
│   │   ├── resume/             # Embedded PDF viewer modal
│   │   │   └── ResumeModal.tsx
│   │   └── sections/           # Section modules for the homepage
│   │       ├── Hero.tsx
│   │       ├── PortalMarquee.tsx
│   │       ├── FeaturedProjects.tsx
│   │       ├── About.tsx
│   │       ├── Experience.tsx
│   │       ├── GuestbookSection.tsx
│   │       └── ClosingCTA.tsx
│   ├── data/
│   │   └── projects.ts         # Centralized project catalog, tech stacks, and links
│   └── lib/
│       ├── firebase.ts         # Firebase App, Auth, and Firestore initialization
│       ├── geo.ts              # Multi-tier IP geolocation resolver (Cloudflare/ipinfo)
│       └── guestbook.ts        # Firestore queries, Google auth sign-in, view counter
├── ARCHITECTURE.md             # This file
├── AGENTS.md                   # Environment rules
├── package.json
└── tsconfig.json
```

---

## 3. Key Design Patterns

### High-Performance Mouse Tracking (60+ FPS)
Instead of updating React state on every `mousemove` event (which causes 60+ component re-renders per second and CPU sluggishness), components like `GlowCard`, `ClosingCTA`, and `CustomCursor` write coordinates directly to:
1. CSS custom properties (`--mouse-x`, `--mouse-y`) on DOM elements.
2. GPU hardware-accelerated transforms: `transform: translate3d(x, y, 0)`.

### Event-Driven Modal Coordination
To avoid header overlap and clipping between the fixed `Navbar` and the full-screen `ResumeModal`:
- When `ResumeModal` opens, it dispatches a window event:
  ```ts
  window.dispatchEvent(new CustomEvent("resume-modal-state", { detail: { open: true } }));
  ```
- `Navbar.tsx` listens for this event and applies `-translate-y-24 opacity-0 pointer-events-none` with smooth CSS transition timing.

### Authentic Guestbook & View Counter
- All guestbook notes are stored in and fetched from Cloud Firestore (`guestbook` collection).
- Users sign in using Firebase Authentication popup with Google provider.
- Live page views use Firestore atomic increments (`updateDoc` with `increment(1)`), deduplicated per browser session via `sessionStorage`.
- No mock or hardcoded reviews exist in the codebase.

---

## 4. Development & Build Scripts

```bash
# Run local development server
npm run dev

# Run ESLint validation
npm run lint

# Generate fresh PDF resume in public/
npm run generate:resume

# Create production build
npm run build
```
