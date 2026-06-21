# MotoMeet — Web App + PWA

A production-quality, installable **Progressive Web App** implementation of the
MotoMeet motorcycle-community design system. Riders meet on a live map, discover
events, ride routes together, join clubs and chat — dark-first with a full light
theme and responsive desktop/tablet layouts.

Built from the `MotoMeet.pen` mockup (14 mobile screens + responsive + light theme).

## Tech stack

- **Vite 5 + React 18 + TypeScript** (strict)
- **Tailwind CSS** with design tokens driven by CSS variables (dark/light themes)
- **React Router 6** for navigation
- **Zustand** (persisted) for state — auth, theme, follows, joined events/clubs,
  messages, notifications, settings, toasts
- **Leaflet + react-leaflet** with CartoDB dark/light tiles for the live map
- **lucide-react** icons · **Inter** (UI) + **Anton** (display) fonts
- **vite-plugin-pwa** (Workbox) — manifest, service worker, offline app shell
- **Vitest + Testing Library** (unit) · **Playwright** (e2e, mobile + desktop)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Sign in with the pre-filled demo credentials (any value works) to enter the app.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check + production build (emits the PWA service worker) |
| `npm run preview` | Serve the production build on :4173 |
| `npm run lint` | Type-check only |
| `npm test` | Run the unit test suite (Vitest) |
| `npm run test:e2e` | Run the Playwright e2e + screenshot suite |

## Screens

`/auth` · `/map` · `/rider/:id` (user card) · `/profile` · `/events` ·
`/events/:id` · `/create-event` · `/chats` (messages) · `/chats/:id` (DM) ·
`/community` (channel) · `/search` · `/routes` · `/clubs` · `/notifications` ·
`/settings`

- **Mobile** (`< lg`): floating pill bottom-nav on the five primary tabs.
- **Desktop** (`>= lg`): sidebar nav + live-map dashboard + "Riding now" rail.
- **Tablet** (`>= md`): 2-column events grid.
- **Themes**: dark (default) and light, switchable in Settings → Appearance.

## PWA

`npm run build && npm run preview`, then open in Chrome and install via the
address-bar install icon. The app shell, fonts, map tiles and ride photos are
cached for offline use (Workbox runtime caching). Manifest, icons and theme-color
are wired in `vite.config.ts`.

## Tests

- **Unit** (`tests/*.test.ts[x]`): formatters, the Zustand store, interactive
  components and a smoke test for every screen.
- **E2E** (`tests/e2e/*.spec.ts`): full user journeys on a mobile (Pixel 5) and a
  desktop (1440) Chromium profile, plus a screenshot pass that renders every
  screen into `tests/e2e/__shots__/` for visual conformance review against the
  original mockups in `../screenshots/`.

```bash
npx playwright install chromium   # one-time
npm run test:e2e
```
