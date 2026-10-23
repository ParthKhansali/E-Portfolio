# Parth Khansali: Developer Portfolio

Personal developer portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lenis Smooth Scroll, Firebase Auth (Google Sign-In), and Cloud Firestore.

Designed and engineered by Parth Khansali.

---

## Highlights

- **Floating Pill Navigation**: Centered floating pill on desktop with physics-based magnetic profile avatar and online status beacon, plus a fullscreen slide-over drawer on mobile devices.
- **Projects Showcase**: Interactive engineering project cards featuring OmniMentor, GEHU Connect, TaskFlow, ForgeFlow, and ARANYA, complete with live visualizers and direct links.
- **Interactive About Section**: Alter-ego glitch video active by default on initial visit and reload, with a one-click toggle to the portrait photo.
- **Late Night Lounge**: Real-time interactive space with a shared Skribbl drawing canvas, retro arcade games (Runner, Snake, Pong, Reflex), and live visitor chat.
- **Quick Command Center (`Cmd+K`)**: Keyboard-driven command palette for navigating projects, skills, leadership records, and actions.
- **Verified Community Guestbook**: Verified visitor entries backed by Firebase Google Authentication and Cloud Firestore.
- **Developer Telemetry**: Live GitHub repository metrics, WakaTime coding telemetry, and an interactive Spotify music player.
- **CV / Resume Viewer**: In-browser PDF resume preview with direct one-click download.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 and vanilla CSS tokens
- **Animations**: Framer Motion, Lenis Smooth Scroll
- **Database & Auth**: Google Firebase (Authentication & Cloud Firestore)
- **Icons**: Lucide React

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/ParthKhansali/E-Portfolio.git
cd E-Portfolio
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build (Vercel / Node Server)

```bash
npm run build
npm run start
```

### 4. Static Export Build (GitHub Pages)

The repository includes a dedicated build script that safely isolates dynamic server routes before running `next build` with static export:

```bash
npm run build:pages
```

The exported HTML and static assets are placed in the `./out` directory, ready for deployment via GitHub Actions.

---

## Architecture & Project Structure

- `src/app/`: Next.js App Router root layout, home page, and dynamic API endpoints (lounge room, guestbook, views telemetry).
- `src/components/navigation/`: Floating pill navbar, mobile drawer, and Command Palette (`Cmd+K`).
- `src/components/sections/`: Hero, Projects, Skills portal, About, Experience, Guestbook, Dev Dashboard, and Contact.
- `src/components/effects/`: Retro Lounge modal, games (Runner, Snake, Pong, Reflex), and canvas visualizers.
- `src/lib/`: Firebase client config, sound effects generator, base path resolver, and telemetry helpers.
- `scripts/build_pages.mjs`: Production static export workflow for GitHub Pages.

---

## Author

**Parth Khansali**
- Portfolio: [https://parthkhansali-dev.vercel.app](https://parthkhansali-dev.vercel.app)
- GitHub: [@ParthKhansali](https://github.com/ParthKhansali)
- LinkedIn: [parth-khansali](https://linkedin.com/in/parth-khansali)
- Instagram: [@parth_khansali](https://instagram.com/parth_khansali)
- Email: [parthkhansali@gmail.com](mailto:parthkhansali@gmail.com)
