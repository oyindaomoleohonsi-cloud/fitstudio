# FitStudio AI — Detailed Implementation Plan (MVP v1.0 Rev 4)

Derived from: `FitStudio_AI_PRD.md` (2 user groups: Customers + Admins with Consultant/Designer as Admin role type).
Rev 4 keeps Rev 3 (A: 2–40 + XXS-XS → XXXL-XXXXL + world systems + body types, B: zero-storage ephemeral try-on, approved saves only, zero admin/tech access) and swaps to free-first stack: BetterAuth + Neon + Upstash + R2 + Resend→ZeptoMail→SES + Paystack + Cloudflare Pages / Railway. No Supabase, no Vercel.
Repo: `https://github.com/oyindaomoleohonsi-cloud/fitstudio`
Stack: Next.js + BetterAuth + Drizzle + Neon + Upstash + R2, Python worker optional (try-on only).

---

## 0. Architectural Decisions (lock before coding)

### 0.1 Monorepo layout
```
fitstudio/
  apps/web/                     # Next.js App Router + BetterAuth + Tailwind (deploy: Cloudflare Pages)
    app/(shop)/ app/admin/ app/api/auth/[...all]/  # BetterAuth handler
    components/design-system/ lib/auth.ts lib/auth-client.ts
    lib/size-system.ts          # 2-40 + overlap + region converters (mirrors server)
    lib/payments/ lib/email/    # provider adapters (Paystack, Resend/ZeptoMail/SES)
    server/routers/             # profiles, measurements, size_system, garments, tryon, sizing, admin, privacy
  packages/sizing-engine-ts/    # pure TS lib v1.1-inclusive, no DB deps
  services/worker/ (optional)   # Node or Python try-on worker (deploy: Railway/Fly), calls Fashn.ai/Replicate
  drizzle/                      # schema + migrations (Neon Postgres)
  infra/ .env.example
```

### 0.2 Key decisions (free-first, no Supabase, no Vercel)
1. **Frontend/hosting:** Next.js App Router + TS + Tailwind. Web on **Cloudflare Pages** ($0, unlimited bandwidth). API/worker on **Railway** ($5 credit/mo ≈ free for MVP, no cold-start, monorepo-native) — alt Fly.io or $4 Hetzner+Coolify for prod.
2. **Auth: BetterAuth** in Next.js (`emailAndPassword + anonymous + twoFactor + admin + organization`, Drizzle-Neon adapter). `anonymous` = guest shoppers (24h), org roles = `super/support/content/consultant-designer`. FastAPI (if kept) verifies BetterAuth JWT via JWKS only.
3. **DB/Cache:** **Neon** serverless Postgres + Drizzle + **Upstash** Redis. No person images in Redis/DB.
4. **Storage: Cloudflare R2** (10GB-mo + 1M-A + 10M-B free, zero egress, S3-compatible). Buckets: `garment-images/`, `tryon-approved/` only. No raw-uploads bucket — live is memory-only.
5. **RBAC (5):** `customer, admin_super, admin_support, admin_content, admin_consultant_designer`. Zero admin/tech access to live/ephemeral images by design.
6. **Try-on:** `TryOnProvider.generate(in_memory_bytes, garment_key)` (Fashn.ai / Replicate IDM-VTON), 90s timeout, fallback intact. Default = Ephemeral-Zero-Store.
7. **Sizing v1.1-inclusive:** TS pure lib, interval scoring + stretch + pref + length scaling, `engine_version` stored.
8. **Email:** `EmailProvider.send()` — **Resend** free 3k/mo dev → **ZeptoMail** credits prod bursty → **SES à-la-carte** past ~100k/mo.
9. **Payments:** `PaymentProvider` — **Paystack** (free integration, T+1, cards/bank/USSD/mobile-money, webhooks) with Stripe swap later.
10. **Privacy/envs:** TLS/HSTS, PII encryption, per-session ephemeral keys, immutable audit, local/staging/prod, no secrets in repo.

---

## A. Inclusive Sizing Taxonomy (new requirement, cross-cutting)

### A.1 Supported systems (MVP must accept all, recommend in canonical + display)
- **Overlap letter (first-class, exact MVP ladder):** `XXS-XS, XS, S, S-M, M, M-L, L, L-XL, XL-XXL, XXL, XXL-XXXL, XXXL, XXXL-XXXXL`. Each overlap (e.g. S-M, M-L, L-XL) = measurement **interval** (min–max), not a point. Standalone `L` and `XXXL` are kept as anchor sizes so every shopper maps to at least one exact or overlap label.
- **Numeric 2–40 (US women's baseline):** 2,4,6…40 contiguous. Map to bust/waist/hip canonical ranges; allow half-steps via interval.
- **World systems:** US / UK / EU / FR / IT / JP / AU conversion table stored in `size_system_regions`. Brand size chart declares its region; engine converts to canonical cm intervals for scoring, displays back in shopper's preferred region.
- **Body-type modifiers:** `petite / regular / tall` (length + rise scaling), `plus / curve` (graded sweep, not just +cm), `maternity` (placeholder flag, not scored in MVP), proportions auto-derived from measurements (never gender).

### A.2 Canonical model
```
size_systems(id, code: US_W_2_40 | LETTER_OVERLAP | EU ... )
size_labels(id, system_id, label: 'M-L' | '12' | '40', sort_order)
size_intervals(label_id, area: bust|waist|hips|length, min_cm, max_cm)
region_mappings(from_system, from_label, to_system, to_label)
garment_sizes(id, garment_id, label_id, custom_min/max overrides, stretch, fit_type)
```
- Garment CRUD **must** allow picking any label 2–40 or overlap set, or custom label mapped to an interval. Publish QA fails if any size lacks bust+waist+hips interval.
- Frontend `lib/size-system.ts`: converter + overlap explainer ("M-L covers M to L, eased cut") + region toggle (US/UK/EU).

### A.3 Engine handling
- Score against **interval distance**, not point distance: if user meas inside interval → 0; outside → distance to nearest edge minus stretch/pref allowances.
- Overlap sizes naturally win ties for between-size shoppers; alternative always offers neighbor interval.
- Store `engine_version='v1.1-inclusive'`, `size_system`, `region_display` on every recommendation for replay.

---

## B. Ephemeral Private Try-On (new requirement, cross-cutting)

### B.1 Principle
**Live uploads are NEVER stored.** Default try-on is RAM-only, encrypted in transit + in memory, auto-wiped. Saving is explicit opt-in per result, and even then admins/tech cannot view person images.

### B.2 Modes
1. **Live Ephemeral (default):** browser → TLS → API memory buffer → provider → memory buffer → streamed back to browser, never touches disk/S3/DB/logs. Buffers zeroed after response/timeout. No CDN cache (`Cache-Control: no-store`).
2. **User-Approved Save (opt-in only):** after seeing live result, user clicks "Save this try-on". Only then is the **result image** (never the raw upload unless separately consented) encrypted with a per-user data-key and written to `tryon-approved/`. User can delete anytime; delete = hard delete + key destruction.

### B.3 Zero-access guarantees
- No `GET` endpoint for person images exists. Admin APIs return only anonymized metadata (garment_id, success/fail, timing) — never image bytes/keys.
- Raw upload bytes excluded from logs, Sentry, analytics. Request IDs are random, not linkable to image.
- S3 bucket policy denies `s3:GetObject` on `tryon-approved/` to any admin/tech IAM role; only app role via presigned per-user URLs. Support Admin troubleshooting uses metadata + user-shared links only (user pastes a temporary expiring link if they choose).
- Keys: per-session ephemeral key for live (destroyed in <5 min), per-user DEK for approved saves wrapped by KMS (destroy on delete). No shared master readable by staff.
- Provider contract: DPA, zero-retention flag, region pinning; mock provider locally to prove no egress in tests.

### B.4 UX
- Try-On screen shows lock badge: "Live preview — not stored. Only saves if you tap Save."
- Consent split: (a) process-live consent (required per session), (b) save-result consent (per image), (c) optional analytics consent (default off).
- History shows only approved saves with Delete + "Never stored" explainer for live sessions.

---

## C. Auth — BetterAuth (replaces custom JWT)

- `lib/auth.ts`: `betterAuth({ emailAndPassword, anonymous, twoFactor, admin, organization, session: jwt })`, Drizzle-Neon adapter, `nextCookies()` last.
- Roles via org: `admin_super / admin_support / admin_content / admin_consultant_designer`; `customer` default; `anonymous` auto-upgraded on signup (guest session preserved).
- Admin MFA enforced via twoFactor plugin; middleware checks session cookie only for redirects, `auth.api.getSession()` server-side.
- Email verification + password reset via EmailProvider (Resend dev).

## D. Data/Cache — Neon + Upstash + R2 (no Supabase)

- Neon Postgres + Drizzle migrations (replaces Alembic); Upstash Redis for queue/guest/rate-limit; R2 via S3-compatible presigned URLs.
- Buckets: `garment-images/`, `tryon-approved/` only. R2 policy denies admin/tech `GetObject` on approved; app-only presigned per-user reads.

## E. Email — Resend → ZeptoMail → SES

- Interface `EmailProvider.send(to, template, props)` + React-Email templates.
- MVP: Resend free (3k/mo, 100/day cap). Prod bursty: ZeptoMail credits ($2.50/10k, 6-mo expiry, transactional-only, EU DC option). Scale: SES à-la-carte ($0.10/1k, opt out of Essentials $0.16/1k).

## F. Payments — Paystack (adapter)

- Interface `PaymentProvider.initialize/verify/webhook()`; impl `Paystack` (free integration, T+1, cards/bank transfer/USSD/mobile-money/Apple Pay). `orders.status=reserved→paid` on verified webhook. Keep Stripe swap path.

## G. Hosting — Pages + Railway (no Vercel)

- Web → Cloudflare Pages ($0). API/worker → Railway project (web+worker+Neon-link+Upstash, $5 credit covers MVP). Alt: Fly.io regions or Hetzner+Coolify $4 predictable prod. Render free avoided (15m sleep, 30-50s wake kills sizing API).

---

## Phase 1 — Design System + UX Shell

PRD §4.4, §6, §12–14 + A + B.
1. Tokens, Button/Input/Select/UnitToggle/MeasurementField/FitPreferenceSegment/SizeBadge/**SizeConverter** (2-40 + region + overlap explainer)/FitMeter/TryOnViewer (live-badge + no-store note)/DisclaimerBanner/Empty/Error.
2. `(shop)` + `/admin` layouts. Copy rules: no gendered/proxy language, overlap explained plainly.
3. A11y AA, keyboard, reduced-motion, screen-reader FitMeter.
**Accept:** preview page renders SizeConverter + live-badge; Lighthouse a11y ≥95.

## Phase 2 — Data, Auth & Platform Foundations

PRD §7, §15, §17 + A.2 + B.3 + C/D.
1. Drizzle models: all §17 tables + `size_systems, size_labels, size_intervals, region_mappings` + `tryon_sessions(mode, stored=false, consent_ids)` + BetterAuth tables (`user, session, account, verification`) + `consents`. `tryon-approved/` R2 only.
2. Auth: BetterAuth handler `/api/auth/[...all]`, `require_role` from session, audit middleware.
3. Crypto: ephemeral session keys, per-user DEKs (KMS-wrapped), zeroing helpers. No image keys in logs.
4. Seeds: super-admin, Bodycon S/M/L + M-L overlap + Size 12 numeric.
**Accept:** RBAC matrix green; `test_live_tryon_writes_nothing` passes; guest anonymous upgrades without data loss.

## Phase 3 — Customer Profile, Measurements & Fit Prefs

PRD §7.1, §8, §13 + A.
1. `CRUD /me/profile|measurements|fit-preference`, `/me/history` (approved saves only), `/size-systems/convert`.
2. Validation shared ranges, suspicious-warning, cm canonical, region display pref.
3. Wizard: Manual → Existing Size (any 2-40/letter/region) → AI-Assisted placeholder → Fit Pref. Edit + delete-my-data (destroys DEK).
**Accept:** profile <3 min, overlap/existing-size prefill works, delete hard-deletes.

## Phase 4 — Admin Catalog (Content + Consultant/Designer)

PRD §7.2–7.3, §9 + A.
1. `CRUD /admin/brands|garments|sizes|measurements`, publish/archive + QA (all sizes need intervals; overlap needs min-max; numeric 2-40 continuous check).
2. UI: size-grid supporting 2-40 multi-select + overlap creator + region tag + converter preview.
3. Permissions: content + consultant_designer publish; support read-only; super manages admins. No person-image access anywhere in admin UI.
4. Seed 10–14 garments spanning S→XLLL-XLLLL, 2–40, petite/tall variants.
**Accept:** publish blocked on missing interval; archived hidden but replayable.

## Phase 5 — Smart Sizing Engine v1.1-inclusive (TS lib)

PRD §10, §12–13 + A.3.
- `packages/sizing-engine-ts`: interval scoring + stretch (woven 0 / low +1 / med +2.5 / high +4) + pref (fitted -2 / regular 0 / relaxed +3 / oversized +6) + length (petite -3 / tall +3).
- `POST /api/sizing/recommend {garment_id}` → `{recommended, per_area[], alternative, explanation[], size_system, region_display, engine_version}`.
- PDP Fit Analysis card with visual-vs-prediction disclaimers.
**Accept:** M user → M (Regular), L (Relaxed); between-size → M-L wins; tests for 2,12,40 + overlap + EU→US.

## Phase 6 — Virtual Try-On Ephemeral + Approved Saves (R2 only saves)

PRD §11, §18 + B.
1. Adapter + mock. `POST /api/tryon/live` (memory-only, no-store) + `POST /api/tryon/{id}/approve` (encrypt → R2 `tryon-approved/`) + `DELETE /api/me/tryons/{id}`.
2. Worker (Railway/Fly): buffer → provider → buffer → respond, zero buffers, no R2 write on live path.
3. UI: per-session consent, progress, live-badge, Save/Delete, fallback sizing.
4. Admin analytics: counts/timings only — no thumbnails.
**Accept:** p80 <90s; live 0 objects; approved user-only read; admin GET → 404 by design.

## Phase 7 — Shop Browse, PDP, Paystack Cart Hook + Email

PRD §6.1, §12 + A.1 + E/F.
- Browse filters (system/region/length), PDP chart + converter, explainer, guest nudge, cart `orders(reserved)` → Paystack initialize/verify → `paid`, receipt via EmailProvider.
**Accept:** guest end-to-end; signup preserves session; "Why M-L?" explains interval; test Paystack webhook grants order once.

## Phase 8 — Privacy, Security, NFR Hardening

PRD §15, §18 + B.3.
- TLS/HSTS, at-rest PII encryption, KMS wrap, live-memory zeroing audit, guest purge cron, approved-save retention only, rate limits, <2s p75 (Redis garment cache), Sentry scrubbed (no image data), backup drill, DPA checklist, pen-test for zero-access (attempt admin image read must fail).
**Accept:** delete destroys DEK; audit immutable; zero-storage test passes in CI.

## Phase 9 — Analytics, Metrics & Launch

PRD §20–21 + A/B metrics.
- Dashboard: §20 primaries + size-acceptance by interval/region + live-vs-saved rate + zero-storage compliance + time-to-recommend.
- Feedback, diversity QA (skin tones/sizes 2-40/heights), UAT success quote, runbook.
**Accept:** cuts by garment/brand/size-system; UAT passes.

---

## Build Order (1–2 wk sprints)
A: Phase 0 + 1 (shell + design + SizeConverter + live-badge)
B: Phase 2 (auth + size-system tables + crypto + seeds)
C: Phase 3 (profile/measurements)
D: Phase 4 (catalog intervals + seeds S→XLLLL, 2–40)
E: Phase 5 (engine v1.1 TDD) — first value demo
F: Phase 6 (ephemeral try-on + approve)
G: Phase 7 (browse/PDP/cart)
H: Phase 8 + 9 (harden + analytics + launch)

## Immediate Next
1. `git checkout -b feat/inclusive-sizing-ephemeral` — add size-system migration + crypto stub + SizeConverter.
2. Add CI tests: interval scoring + `test_live_tryon_writes_nothing`.
3. Seed overlap + numeric garments before engine tests.

## Risks
- Overlap grading confusion → interval explainer + QA gate.
- World-size mapping disputes → versioned mapping table + engine_version replay.
- Provider retention → DPA + mock + egress test; kill-switch to mock.
- Zero-access vs support needs → metadata-only troubleshooting + user-shared temp links.
