# ADR-001 — Free-first stack (Rev 4)

Date: 2026-09-26
Status: Accepted
Context: PRD §16 + Rev 3 (inclusive sizing, ephemeral try-on) + constraints (BetterAuth, R2, Paystack, no Supabase, no Vercel, free plans).

Decisions:
1. Web: Next.js App Router + TS + Tailwind on Cloudflare Pages ($0).
2. Auth: BetterAuth (anonymous/guest, 2FA, admin, organization) + Drizzle + Neon. No custom JWT service.
3. Data: Neon Postgres + Drizzle; cache/queue Upstash Redis; local dev via docker-compose (postgres:16, redis:7, minio for R2-compat).
4. Storage: Cloudflare R2 (S3-compatible, zero egress). Buckets garment-images/ + tryon-approved/ only. Live try-on RAM-only.
5. Email: Resend (dev free) -> ZeptoMail (bursty) -> SES a-la-carte (scale). Single EmailProvider interface.
6. Payments: Paystack via PaymentProvider interface; Stripe later.
7. API/worker: Next.js routes + optional Node/Python worker on Railway ($5 credit) / Fly.io; Hetzner+Coolify for prod.
8. Sizing v1.1-inclusive: pure TS lib, interval scoring, versioned.

Consequences: one auth source, $0 MVP, no Vercel/Supabase lock-in, Python optional.
