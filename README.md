# Selam Ethiopia — v3 (Login fix + maps, temperature, activity filters, visual polish)

Next.js 14 (App Router) + Prisma + PostgreSQL. Every piece of content — destinations,
hotels, shopping places, gallery photos, and the Connect board — is stored in the
database and editable from a password-protected `/admin` dashboard, with real image
uploads and multi-language support for international visitors.

## What's new in v3
- **🔧 Fixed: admin login.** The seed script now explicitly loads `.env` (via `dotenv`)
  regardless of how it's invoked, and re-running the seed now updates the admin
  password instead of silently ignoring the change. Root cause: `tsx prisma/seed.ts`
  run directly doesn't auto-load `.env` the way the Prisma CLI does, so it was always
  falling back to the default `admin@example.com` credentials. Login errors are also
  now more specific instead of a silent failure.
- **Hotels: distance from the nearest airport** + an embeddable OpenStreetMap map
  (no API key required) toggleable per hotel card.
- **Destinations: average temperature badge** shown on both the list and detail pages.
- **Destinations: "what do you want to do" filtering** — hiking, wildlife, water,
  jungle/forest, desert, cultural, adventure, city — a fixed tag vocabulary so
  filtering stays reliable, with a filter bar on the Destinations page.
- **Destinations: location map** on the detail page when coordinates are set.
- **Visual polish pass** — hover elevation on cards, subtle motion on the destination
  rows and gallery tiles, refined hero background texture, visible focus states for
  accessibility, active-nav-link underline, and general spacing/shadow refinement
  across the board.

## What's new in v2
- Real image uploads (drag-and-drop, multi-file) from the dashboard.
- Multi-photo galleries per entity (Destinations, Hotels, Shopping places).
- Internationalization — locale-prefixed routes (`/en`, `/am`, `/fr`, `/zh`, `/ar`), auto-detected from the browser, with RTL support for Arabic.
- Currency-aware hotel pricing (USD/EUR/GBP/ETB/JPY/CNY/INR/AED).
- Editorial Destinations layout + detail pages, redesigned Gallery (masonry + lightbox + filters), redesigned Hotels and Shopping cards.


## Stack
- **Next.js 14** (App Router, Server Components + Route Handlers)
- **Prisma ORM** → **PostgreSQL**
- Cookie-based admin session (HMAC-signed, no third-party auth dependency)
- Local disk image storage via a swappable storage adapter (`src/lib/storage.ts`)
- Custom lightweight i18n (no external i18n library) — `src/lib/i18n.ts`

## 1. Get a PostgreSQL database
- [Neon](https://neon.tech) (free tier, serverless Postgres)
- [Supabase](https://supabase.com) (free tier)
- [Railway](https://railway.app)
- Local Postgres (`postgresql://postgres:password@localhost:5432/selam_ethiopia`)

## 2. Configure environment variables
```bash
cp .env.example .env
```
Fill in `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`.

## 3. Install, migrate, seed
```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```
(`npx prisma db seed` is the canonical command — it loads `.env` automatically. `npm run seed` also works now that the script loads `.env` itself.)

If you already had this project's database running from an earlier version, run
`npx prisma migrate dev --name add_maps_temp_activity` instead to add the new
columns (distance from airport, coordinates, temperature, activity tags) without
losing existing data.

## 4. Run it
```bash
npm run dev
```
- Public site: http://localhost:3000 → redirects to `/en` (or your browser's language)
- Admin dashboard: http://localhost:3000/admin/login

## Image uploads in production
Local disk storage (`public/uploads`) works for local dev and single-instance
deployments, but **does not survive redeploys or scale across multiple server
instances** — most serverless hosts (Vercel included) reset the filesystem on
every deploy. Before a real production launch:
1. Open `src/lib/storage.ts` — it's the only file that touches storage.
2. Replace `saveUploadedFile` with a call to S3, Cloudinary, or Vercel Blob.
3. Nothing else in the app needs to change — every form already just stores
   and displays whatever URL `saveUploadedFile` returns.

## Internationalization — what's covered vs. what's next
**Covered:** all UI chrome (nav, buttons, footer, hotel/meal-plan labels, connect
board headings) in English, Amharic, French, Chinese, and Arabic, with automatic
browser-language detection and RTL layout for Arabic.

**Not covered (by design, to keep scope honest):** content typed into the admin
dashboard (destination descriptions, hotel notes, etc.) is stored and displayed
exactly as written — it is not auto-translated. To support that properly, add a
`Translation` table keyed by `(entityType, entityId, locale, field)` and a
per-locale tab in each admin form. That's a genuinely separate feature — happy
to build it as a follow-up if you want dashboard content to be multilingual too.

## Project structure
```
prisma/
  schema.prisma       # Admin, Destination(+Image), Hotel(+Image), ShopPlace(+Image), GalleryImage, ConnectPost
  seed.ts              # starter content + admin account
src/
  app/
    [locale]/           # all public pages, locale-prefixed (home, gallery, destinations(+[slug]), hotels, shopping, connect)
    admin/               # dashboard: login, overview, CRUD screens per resource
    api/                 # REST route handlers (+ /api/upload for image uploads)
  components/            # Nav, Footer, forms, MultiImageUploader, GalleryGrid+lightbox, ImageCarousel, Currency/Language switchers
  lib/
    prisma.ts, auth.ts, icons.ts, storage.ts, i18n.ts, currency.ts
  middleware.ts          # admin auth guard + locale detection/redirect
```

## Honest caveats
- This was built and type-checked in a sandbox without full internet access, so
  `npx prisma generate` couldn't download its engine binary here — run it yourself
  on first install (`npx prisma generate` after `npm install`), which resolves instantly
  with normal network access.
- Currency conversion rates are static, for display reference only — not live FX rates.
- Single shared admin account — add a proper multi-admin/invite flow if more than
  one person needs dashboard access.
- No rate limiting yet on the public Connect board POST endpoint — add one
  (e.g. Upstash Ratelimit) before a public launch to prevent spam.
