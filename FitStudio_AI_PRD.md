# Product Requirements Document (PRD)
## FitStudio AI

**Product:** FitStudio AI  
**Product Type:** AI-powered virtual fashion fitting and smart-sizing platform  
**User Groups (2):** 1. Customers — Online fashion shoppers / 2. Admins — Platform operators including consultants/designers, brands, boutiques, tailors and fashion studios as admin role types  
**Version:** MVP v1.0

---

## 1. Product Overview

FitStudio AI is an inclusive fashion technology platform that allows customers to **virtually try on clothing and receive personalized size recommendations before purchasing**.

Users can create a personalized body/fit profile by entering their measurements or using AI-assisted measurement. They can then select a garment, virtually visualize themselves wearing it, and receive an AI-powered recommendation for the most suitable size based on their measurements, the garment's dimensions, construction, fabric properties and preferred fit.

The platform is designed to support **different genders, ages, body sizes, shapes and proportions**, rather than relying solely on conventional S/M/L sizing.

---

## 2. Problem Statement

Online fashion shoppers often purchase clothing without being able to physically try it on. Generic size labels also vary between brands, making it difficult for customers to determine which size will actually fit.

This can result in:

- Incorrect size selection
- Returns and exchanges
- Customer dissatisfaction
- Reduced confidence when shopping online
- Difficulty finding suitable clothing for diverse body types
- Poor representation of different body sizes and proportions

Fashion businesses also lack an accessible way to provide customers with personalized fitting information online.

---

## 3. Product Goal

The goal is to help customers make **more informed clothing purchasing decisions** by allowing them to:

1. Create a personalized fit profile.
2. Input or estimate their body measurements.
3. Virtually try on clothing.
4. Receive garment-specific size recommendations.
5. Understand how the garment is expected to fit different parts of their body.
6. Make a purchase with greater confidence.

---

## 4. User Groups (2 Only)

The platform has exactly two user groups for MVP v1.0: **1. Customers** and **2. Admins**. There is no separate third group — consultants/designers, brands, boutiques, tailors and fashion studios all operate as Admin role types with least-privilege permissions.

### 4.1 Customers (User Group 1)

- Guest shoppers (no account, can try core flow with limited persistence)
- Registered shoppers (saved profile, history)
- Adults shopping for clothing online
- Teenagers
- Parents shopping for children
- Older adults
- Plus-size customers
- Petite and tall customers
- Customers with different body proportions
- Customers shopping across different clothing categories

Customers own: fit profile, measurements, photos, try-on sessions, recommendations, orders/feedback.

### 4.2 Admins (User Group 2)

- Super Admin (full access, user management, system config)
- Support Admin (view users/sessions, help with fit issues, refund/support triage, no system config)
- Content / Catalog Admin (manage garments, brands, size charts, fabric data, no user PII deletion except via approval)
- Consultant / Designer Admin (fashion consultants, designers, tailors, boutiques — manage garments, size charts, fabric/fit guidance and fitting analytics; no bulk PII export, all PII access audit-logged)

Admins own: catalog quality, user support, moderation, analytics, privacy compliance.

### 4.3 Fashion Businesses — No Separate Login (Admin-Managed)

In MVP, brands/boutiques/designers do NOT have a separate user group or direct login. Their garments are onboarded by Content Admin or Consultant / Designer Admin. Post-MVP brand self-service, if added, remains an Admin role type, not a third user group.

### 4.4 Inclusive Considerations

The product should support:

- Different genders
- Gender-neutral clothing
- Different ages
- Different body shapes
- Different heights
- Different body sizes
- Different proportions
- Different skin tones

**Important product principle:** gender should not be used as a proxy for body measurements. The system should primarily make fitting decisions from actual measurements and garment data.

---

## 5. User Stories

### 5.1 Customer (Guest vs Registered)

> As a guest customer, I want to try measurements + try-on without creating an account so that I can evaluate the product quickly.

> As a registered customer, I want to enter my measurements so that I can receive a personalized clothing size.

> As a customer, I want to upload a photo and virtually try on clothing so that I can see how an outfit may look on me before purchasing.

> As a customer, I want to know why a particular size was recommended so that I can make an informed purchase.

> As a customer, I want to adjust my preferred fit between fitted, regular, relaxed and oversized so that recommendations reflect how I like my clothes to fit.

> As a registered customer, I want to save my measurements so that I don't have to enter them every time I shop.

> As a customer, I want to delete my profile, photos and measurements so that I control my privacy.

> As a customer, I want to view my past try-ons and recommendations so that I can compare and decide.

### 5.2 Admin (includes Consultant / Designer)

> As a Super Admin, I want to create/manage admin accounts and assign roles (super/support/content/consultant-designer) so that access is least-privilege.

> As a Content Admin, I want to create/edit/archive brands and garments including images, sizes, size charts, garment measurements, fabric/stretch, fit type so that customers get accurate recommendations.

> As a Support Admin, I want to view (with consent/audit) a user's fit profile, try-on sessions and recommendation logs so that I can troubleshoot fitting issues.

> As a Support Admin, I want to delete user-uploaded images on request and confirm retention compliance so that privacy requirements are met.

> As an Admin, I want to see fitting analytics (try-on success rate, recommendation acceptance, returns, size-related issues) so that I can identify catalog or sizing problems.

> As an Admin, I want to moderate/flag low-quality garment data or failed try-on outputs so that bad data doesn't drive bad recommendations.

> As a Super Admin, I want to view audit logs of admin actions so that PII access is accountable.

### 5.3 Consultant / Designer (Admin Role Type — No Separate User Group)

> As a Consultant / Designer Admin, I want to upload my garment measurements and size chart so that customers can receive accurate size recommendations.

> As a Consultant / Designer Admin, I want to see fitting analytics so that I can identify sizing problems and improve my products.

---

## 6. Core User Journeys

### 6.1 Customer Journey

```text
Landing Page
      ↓
Create Account / Continue as Guest
      ↓
Create Fit Profile
      ↓
Enter Measurements
      ↓
Optional AI Measurement
      ↓
Select Fit Preference
      ↓
Browse Garments
      ↓
Select Garment
      ↓
Virtual Try-On
      ↓
Smart Size Recommendation
      ↓
Fit Analysis
      ↓
Add to Cart
      ↓
Purchase
```

### 6.2 Admin Journey

```text
Admin Login (MFA, role check)
      ↓
Admin Dashboard (catalog health, try-on success, open support tasks, privacy requests)
      ↓
  ┌───────────────┬──────────────────┬──────────────┐
  ↓               ↓                  ↓              ↓
Manage Catalog  Manage Users/    View Analytics  Privacy &
(Brands/Garments Support Tickets  (sizing issues, Audit Logs
/Sizes/Charts)  (view sessions,   returns, AI
                troubleshoot)     failures)
      ↓               ↓                  ↓              ↓
Publish / Archive Resolve / Escalate Adjust catalog / Delete images
+ QA check         + audit-logged      flag garment   on request
                   PII access
```

---

## 7. Functional Requirements

### 7.1 Customer – Account & Profile

The system must allow customers to:

- Continue as guest (measurements + try-on, session-only storage, prompt to save)
- Create an account
- Log in / log out
- Create a fit profile
- Edit measurements
- Save preferences
- View try-on + recommendation history
- Delete their profile, images and measurements

### Technical Requirements

- Authentication (customer + separate admin auth with MFA)
- Secure password handling (hashing, reset flow)
- User database
- Profile API
- Data encryption
- Role-based access control (RBAC): `customer`, `admin_super`, `admin_support`, `admin_content`, `admin_consultant_designer`
- Guest data expiry (e.g., 24h unless converted to account)

### 7.2 Admin – Management & Moderation (MVP Must-Have)

The system must allow admins (scoped by role) to:

- Log in via separate `/admin` surface with MFA and role check
- Dashboard: catalog health, try-on success/failure, recommendation volume, open privacy/support requests
- Brands/Garments CRUD + archive/publish + QA checklist (required fields from §9)
- Size charts + garment measurements CRUD with validation
- User lookup (by email/ID), view fit profile/sessions/recommendations with audit-logged PII access (support only, no bulk export)
- Privacy ops: delete user images/measurements on request, confirm retention, export/delete account data
- Content moderation: flag/quarantine low-quality garments or failed try-on outputs
- Analytics view: §20 metrics cut by garment/brand/size/body-range
- Audit logs: every admin PII access, catalog publish, delete action is immutable and viewable by Super Admin

Super Admin only: create/disable admins, assign roles (super/support/content/consultant-designer), system config (retention windows, AI provider keys).

### 7.3 Authorization Matrix (MVP)

```text
Capability                        Customer  Support  Content  Consult-Designer  Super
Create/edit own profile             Y         -        -           -             -
View own history                    Y         -        -           -             -
Guest try-on                        Y         -        -           -             -
View user PII (audit-logged)        -         Y        -           -             Y
Delete user images on request       -         Y        -           -             Y
Manage garments/brands/sizes        -         -        Y           Y             Y
Publish/archive catalog             -         -        Y           Y             Y
View analytics                      -         Y        Y           Y             Y
Manage admins/roles/config          -         -        -           -             Y
View audit logs                     -         -        -           -             Y
```

---

## 8. Measurement System

Users should have multiple ways to create their measurements.

### Method 1 — Manual

Users can enter:

- Height
- Bust/chest
- Waist
- Hips
- Shoulder width
- Inseam
- Arm length

Additional measurements should be requested depending on the selected garment.

### Method 2 — AI-Assisted

Users upload photographs.

The system uses computer vision to estimate measurements.

### Method 3 — Existing Size

Users can enter a size they normally wear as an initial reference.

### Requirements

The system must:

- Validate measurement values
- Allow cm/inches
- Flag suspicious measurements
- Allow users to manually correct AI estimates
- Display confidence where AI estimation is used

---

## 9. Garment Management

Each garment must have a digital garment profile.

### Required Garment Information

- Garment name
- Brand
- Category
- Images
- Available sizes
- Size chart
- Garment measurements
- Fabric
- Stretch level
- Fit type
- Length
- Color
- Pattern

### Example

```text
Garment: Bodycon Dress

S
Bust: 88 cm
Waist: 70 cm
Hip: 94 cm

M
Bust: 94 cm
Waist: 76 cm
Hip: 100 cm

L
Bust: 100 cm
Waist: 82 cm
Hip: 106 cm
```

---

## 10. Smart Sizing Engine

This is a **core feature**.

The sizing engine compares:

```text
User measurements
+
Garment measurements
+
Fabric/stretch
+
Garment construction
+
Fit preference
+
Brand sizing
```

and produces a recommendation.

### Example Output

**Recommended size: L**

| Area | Expected Fit |
|---|---|
| Bust | Good |
| Waist | Good |
| Hips | Slightly fitted |
| Length | Good |

**Alternative:** XL for a more relaxed fit.

---

## 11. Virtual Try-On

The system should allow a customer to:

1. Upload/select a photo.
2. Select a garment.
3. Process the image.
4. Generate a visualization of the customer wearing the garment.

### AI Pipeline

```text
Customer Image
       ↓
Person Detection
       ↓
Pose Estimation
       ↓
Body Segmentation
       ↓
Garment Processing
       ↓
Virtual Try-On Model
       ↓
Image Refinement
       ↓
Quality Check
       ↓
Final Result
```

### MVP Technical Approach

Use an existing virtual try-on AI model/API rather than developing a foundation model from scratch.

The proprietary value should initially come from the **fit profile + garment database + smart-sizing engine**.

---

## 12. Fit Analysis

The platform should distinguish between:

### Visual Appearance

> "This is an AI-generated visualization of how the garment may look on you."

### Fit Prediction

> Bust: Good  
> Waist: Slightly fitted  
> Hip: Comfortable  
> Length: Good

This distinction is important because **looking good in a generated image doesn't necessarily mean the real garment will physically fit.**

---

## 13. Fit Preferences

Users should be able to select:

- Fitted
- Regular
- Relaxed
- Oversized

The sizing engine should incorporate this preference into its recommendation.

### Example

**System recommendation:** L

But:

> "You selected relaxed fit. We recommend XL."

---

## 14. Accessibility & Inclusivity Requirements

The interface should:

- Support different body types
- Avoid assuming gender from body measurements
- Provide inclusive size ranges
- Use accessible typography
- Support screen readers
- Provide clear measurement instructions
- Avoid stigmatizing body terminology
- Allow users to skip optional demographic information

The AI should be tested across diverse:

- Skin tones
- Ages
- Body sizes
- Heights
- Body proportions
- Genders

---

## 15. Privacy & Security Requirements

Because the platform handles body measurements and potentially photographs, privacy needs to be a core requirement.

The system should:

- Encrypt sensitive data
- Encrypt data during transmission
- Obtain explicit consent for photo processing
- Allow users to delete uploaded images
- Minimize image retention
- Restrict employee/business access (least-privilege roles: super/support/content/consultant-designer)
- Implement role-based permissions + immutable audit logs for all PII access (see §7.2-7.3)
- Never use customer images for AI training without appropriate consent

---

## 16. Technical Architecture

### Frontend

Recommended:

- React
- Next.js
- Tailwind CSS

### Backend

Recommended:

- Python
- FastAPI
- PostgreSQL
- Redis

### AI/ML

- Python
- PyTorch
- Computer vision
- Pose estimation
- Human segmentation
- Virtual try-on model
- ML sizing algorithm

### Storage

- AWS S3 or equivalent object storage

### Architecture

```text
                USER
                  │
                  ▼
          ┌───────────────┐
          │   Next.js UI  │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │   FastAPI     │
          │   Backend     │
          └───────┬───────┘
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   User Data   Garments   Fit Engine
       │          │          │
       └──────────┼──────────┘
                  ▼
          ┌───────────────┐
          │ AI Services   │
          ├───────────────┤
          │ Measurement   │
          │ Virtual Try-On│
          │ Sizing        │
          └───────────────┘
```

---

## 17. Database Requirements

Core tables:

```text
Users (includes role: customer / admin_super / admin_support / admin_content / admin_consultant_designer, status)
UserProfiles
Measurements
FitPreferences
Brands
Garments (includes status: draft / published / archived, QA flags)
GarmentSizes
GarmentMeasurements
TryOnSessions
SizeRecommendations
FitResults
Orders
Feedback
AdminAuditLogs (admin_id, action, target_user_id, timestamp, IP, reason)
PrivacyRequests (user_id, type: export/delete-images/delete-account, status, handled_by)
SupportTickets (optional MVP-lite: user_id, subject, status, assigned_admin)
```

### Example Relationship

```text
User
 ↓
Body Profile
 ↓
Measurements
 ↓
Try-On Session
 ↓
Garment
 ↓
Sizing Engine
 ↓
Recommendation
 ↓
Purchase
```

---

## 18. Non-Functional Requirements

### Performance

Target initial page/API response: **<2 seconds** where practical.

Virtual try-on can take longer because of AI processing.

### Scalability

The architecture should support additional:

- Users
- Brands
- Garments
- AI models

without major restructuring.

### Reliability

The system should handle failures gracefully.

If virtual try-on fails:

> "We couldn't generate your try-on right now. Your size recommendation is still available."

### Security

Sensitive user information must be protected throughout the system.

---

## 19. MVP Scope

For the first version, **do not build everything at once**.

### Must-Have

- Customer: profile, guest mode, manual measurements, fit preferences, history, privacy controls
- Admin: role-based /admin login with MFA (super/support/content/consultant-designer), dashboard, catalog CRUD + publish QA, user lookup (audit-logged), privacy ops, analytics view, audit logs
- Garment database
- Size charts
- Smart size recommendation
- Photo upload
- AI virtual try-on
- Basic fit explanation

### Future Features

- Brand self-service portal (post-MVP: remains an Admin role type — Consultant / Designer Admin login, garment upload, analytics; not a third user group)
- Real-time AR
- Full 3D avatars
- Marketplace
- Physical store integration
- Advanced body scanning
- Automated tailoring
- Real-time camera fitting

---

## 20. Success Metrics

### Primary Metrics

**Virtual Try-On Completion Rate**  
Percentage of users who successfully complete a try-on.

**Size Recommendation Acceptance**  
Percentage of users who proceed with the recommended size.

**Purchase Conversion**  
Percentage of users who purchase after using the fitting feature.

**Return Rate**  
Compare purchases made with FitStudio versus purchases without it.

### Secondary Metrics

- Profile completion rate
- Measurement correction rate
- Try-on generation success rate
- Average time to recommendation
- Repeat usage
- User satisfaction
- Size-related returns

---

## 21. Product Success Definition

The MVP is successful if users can go from:

> "I like this outfit."

to:

> "I understand how it may look on me, I know which size is recommended for my body, and I feel informed enough to decide whether to buy it."

That is the actual product outcome.

---

## 22. One-Sentence Product Definition

> **FitStudio AI is an inclusive AI-powered fashion fitting platform that combines personalized body measurements, virtual try-on technology and garment-specific smart sizing to help customers of different genders, ages, sizes and body types make more informed clothing purchasing decisions.**

---

## 23. Local Execution (App + Database) — Confirmed

Both app and database run locally with no paid services required:

- **App (no build needed for design):** open `design-studio.html` in any browser for the vibrant fashion preview (tokens, SizeConverter, FitMeter, live-badge try-on). Full Next.js preview (needs Node 20): `cd apps/web && npm install && npm run dev` → `/design`.
- **Database + services:** `docker compose up -d` starts `postgres:16` (5432), `redis:7` (6379), `minio` (9000/9001, R2-compatible). App uses `cp .env.example .env` with `DATABASE_URL=postgresql://user:pass@localhost:5432/fitstudio`.
- **Sizing logic without Node:** pure function in `packages/sizing-engine-ts/index.mjs`; CI runs `node --test`. Verified locally via file/JSON checks + PowerShell scoring math (Phase 0).
- **Status:** Phase 0 verified on this machine without Node/Docker installed; `node --test` and `docker compose up` are documented next-run steps, not blockers.

## 24. Accounts / Files Handling

- **GitHub account:** `oyindaomoleohonsi-cloud`; repo `https://github.com/oyindaomoleohonsi-cloud/fitstudio` (private). Work happens on branch `feat/rev4-stack`; `main` stays deployable.
- **Files in repo:** `FitStudio_AI_PRD.md` (this file), `IMPLEMENTATION_PLAN.md` (Rev 4), `design-studio.html` (standalone preview), `apps/web/` (Next.js + BetterAuth + design system), `drizzle/schema.ts`, `packages/sizing-engine-ts/`, `docker-compose.yml`, `.env.example` (never commit real `.env`), `docs/ADR-001-stack.md`.
- **Uploads:** garment images → R2 `garment-images/` (persistent). Live try-on uploads are RAM-only and NEVER stored. User-approved saves only → R2 `tryon-approved/` (encrypted, per-user key, deletable). No person images in git, Redis, logs, or email.
- **Secrets:** all keys via env/KMS; admin/tech have zero access to live or approved person images by design (no GET endpoint, bucket deny).

## 25. Tool Review Rationale (why this stack)

- **BetterAuth over custom JWT / NextAuth:** lives in code, free/OSS; `anonymous` plugin maps to guest shoppers (24h, auto-upgrade), `twoFactor + admin + organization` maps to the 5 roles (customer + 4 admin types); Drizzle-Neon adapter; NextAuth is now part of BetterAuth.
- **Neon (not Supabase):** serverless Postgres free tier + branching + Drizzle; per ban on Supabase.
- **Upstash Redis:** serverless free tier for queue/guest/rate-limit; no self-hosting.
- **Cloudflare R2 (not AWS S3):** 10GB-mo + 1M-A + 10M-B free, zero egress, S3-compatible — same code, near-$0 image serving.
- **Email (Resend → ZeptoMail → SES):** Resend free 3k/mo for dev DX + React-Email; ZeptoMail credits ($2.50/10k, transactional-only, EU DCs) for bursty prod; SES à-la-carte ($0.10/1k) past ~100k/mo.
- **Paystack:** free integration, T+1, cards/bank/USSD/mobile-money/Apple Pay + webhooks; `PaymentProvider` interface keeps Stripe swap open.
- **Hosting (not Vercel):** Cloudflare Pages ($0 web) + Railway $5-credit (API/worker, no cold-start, monorepo-native); Fly.io or Hetzner+Coolify as prod alts. Render free avoided (15m sleep / 30-50s wake).
