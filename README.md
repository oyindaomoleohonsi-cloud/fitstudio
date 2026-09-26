# FitStudio AI (Rev 4)

Free-first: Next.js + BetterAuth + Drizzle + Neon + Upstash + R2 + Paystack. No Supabase, no Vercel.

## Quick start (no installs needed to view design)
- Open `design-studio.html` in a browser — vibrant fashion preview.
- Next.js preview (needs Node 20): `cd apps/web && npm install && npm run dev` → `/design`.

## Local services (needs Docker)
```
docker compose up -d  # postgres:5432, redis:6379, minio:9000/9001
cp .env.example .env
```

## Phases
See `IMPLEMENTATION_PLAN.md` Rev 4. Executing one phase at a time. Phase 0 (arch lock, ADR, compose, CI, sizing lib, scaffold) is DONE and merged.

## Next planned phase of work: Phase 1 — Design System + UX Shell finalization
Finalize tokens (`apps/web/components/design-system/tokens.css`), library (`components.tsx`: AnnouncementBar, Hero, ProductCard, SizeBadge, FitMeter, TryOnViewer), shop + `/admin` shells, inclusive copy, AA focus states. Preview: open `design-studio.html` or run `cd apps/web && npm install && npm run dev` → `/design`. Exit: `/design` renders + Lighthouse a11y ≥95. After that: Phase 2 (Neon + BetterAuth wiring).
