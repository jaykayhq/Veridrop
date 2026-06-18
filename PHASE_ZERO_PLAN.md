# Phase Zero — Architecture & Partnerships (Weeks 1–4)

**Status:** Not started  
**Goal:** All 3 pre-flight blockers resolved + green light to build  
**Duration:** 4 weeks  
**Dependency:** This phase must complete before any code is written

---

## Pre-Flight Blockers (Resolve before writing code)

### B-01 — Escrow Licensing / Payment Partnership
**Risk:** Can Veridrop legally hold buyer funds in Nigeria?
- [ ] Engage legal counsel on CBN Payment Service Provider (PSP) licensing requirements
- [ ] Evaluate Paystack Formal Escrow API vs Flutterwave Escrow vs direct CBN license
- [ ] Determine: is Veridrop holding funds (needs license) or is a licensed partner holding them?
- [ ] Sign escrow partnership agreement
- [ ] Document: every payment architecture decision flows from this choice

**Decision record:** Payment gateway (Paystack/Flutterwave/other) + escrow model (licensed hold vs partner hold)

### B-02 — Inspector Gig Network
**Risk:** Tech without inspectors = zero completed transactions on launch day
- [ ] Draft inspector profile requirements (experience, device, location)
- [ ] Define vetting workflow (application → document verification → interview → training)
- [ ] Create training materials: inspection checklists, app usage, QR seal handling
- [ ] Set pricing model: base fee per inspection + travel surcharge + category premium
- [ ] Recruit first cohort of 10–20 inspectors in target metro area
- [ ] Establish payout schedule and dispute handling for inspector claims

**Deliverable:** Inspector onboarding playbook (ops deliverable, not engineering)

### B-03 — Tamper-Evident QR Seal Supply Chain
**Risk:** The physical product defines the digital system
- [ ] Research QR seal vendors (adhesive durability, tamper-evident tear pattern, print quality)
- [ ] Define seal specifications: size, material, adhesive strength, environmental resistance
- [ ] Determine minimum order quantities (MOQs) and cost per unit
- [ ] Establish serialization scheme (unique ID format, barcode/QR encoding)
- [ ] Procure sample batch and field-test: readability in dim light, after handling, in rain/humidity
- [ ] Contract vendor for production run and distribution logistics

**Decision record:** Seal vendor selected + serialization scheme finalized + sample batch passes field test

---

## Architecture & Technical Decisions

### Tech Stack Confirmation

| Layer | Decision | Notes |
|-------|----------|-------|
| Backend | NestJS (Node.js/TypeScript) | Modular, strong typing, OpenAPI-native |
| Buyer App | Flutter (iOS + Android) | Cross-platform, single codebase |
| Vendor App | Flutter (iOS + Android) | Same codebase, role-based views |
| Inspector App | Flutter (iOS + Android) | Camera-heavy, offline-first |
| Vendor Dashboard | Next.js (web) | SSR, responsive |
| Admin Dashboard | Next.js (web) | Same codebase, admin routes |
| Rider App | Flutter (iOS + Android) | QR scanning, GPS tracking |
| Database | PostgreSQL (primary) + Redis (cache/queue) | ACID compliance for escrow ledger |
| File Storage | S3-compatible (AWS S3 / MinIO) | Encrypted media archive |
| Queue | Bull/BullMQ (Redis-backed) | Inspection dispatch, notifications |
| Search | PostgreSQL全文 search → later Elasticsearch if needed | |
| Auth | JWT + RBAC (multi-role) | 5 roles: Buyer, Vendor, Inspector, Rider, Admin |

### Database Schema — Core Entities

```
users              → id, role (enum), email, phone, password_hash, kyc_status, metadata
wallets            → id, user_id, balance, locked_balance, currency, version (optimistic lock)
escrow_vaults      → id, order_id, amount, status (locked/released/refunded/partial), audit_trail
orders             → id, buyer_id, vendor_id, product_id, status, escrow_id, timeline
products           → id, vendor_id, category, title, description, price, attributes (JSON)
inspections        → id, order_id, inspector_id, status (pending/passed/failed), checklists, media[]
checklist_templates → id, category, version, fields (JSON schema)
qr_seals           → id, serial, order_id, status (active/scanned/tampered), custody_log[]
custody_log        → id, qr_seal_id, scan_event, user_id, gps, timestamp, device_hash
audit_log          → id, actor_id, action, resource, old_state, new_state, timestamp, device_id
disputes           → id, order_id, initiator, reason_code, status, resolution
notifications      → id, user_id, channel (push/sms/email), template, status, sent_at
```

### OpenAPI Contract Strategy

- Define contract before any code is written
- 5 app surfaces share a single OpenAPI 3.0 spec
- Tools: NestJS `@nestjs/swagger` decorators → auto-generate spec
- CI check: spec diff on PR — breaking changes require team review
- Shared type package (`@veridrop/types`) generated from spec

### Payment Architecture Decision Tree

```
Escrow partner confirmed?
├── Yes, using partner API
│   ├── Paystack Formal Escrow
│   │   ├── Funds held by Paystack
│   │   ├── Veridrop initiates lock/release via API
│   │   └── No CBN license needed
│   └── Flutterwave Escrow
│       ├── Similar model
│       └── Verify Nigeria-specific support
├── Yes, self-licensed
│   ├── CBN PSP license required (6–12 months)
│   └── Direct CBN regulatory compliance
└── No → STOP. Resolve before Phase 1.
```

---

## Infrastructure Setup

### Cloud Environment
- [ ] Cloud provider: AWS (recommended for Nigerian market latency) or GCP
- [ ] Infrastructure-as-Code: Terraform or Pulumi
- [ ] Environments: `dev`, `staging`, `prod`
- [ ] CI/CD: GitHub Actions or GitLab CI
  - PR → lint + typecheck + test
  - Merge to `main` → build + deploy to staging
  - Tag release → deploy to prod (with approval gate)
- [ ] Containerization: Docker + ECS (Fargate) or GCP Cloud Run
- [ ] Database: RDS PostgreSQL (Multi-AZ for prod)
- [ ] Redis: ElastiCache or Memorystore
- [ ] File storage: S3 with lifecycle policies
- [ ] CDN: CloudFront for static assets + inspection media

### Monitoring & Observability
- [ ] Application monitoring: Sentry or DataDog
- [ ] Infrastructure monitoring: CloudWatch / GCP Monitoring
- [ ] Uptime monitoring: Pingdom / Better Uptime
- [ ] Audit log retention policy: minimum 7 years (regulatory)

---

## Week-by-Week Breakdown

### Week 1 — Foundation
- Legal: Escrow partner evaluation kickoff (B-01)
- Ops: Inspector profile definition + job posting draft (B-02)
- Supply: QR seal vendor research + spec requirements (B-03)
- Tech: Repository setup, monorepo structure (Nx or Turborepo)

### Week 2 — Decisions
- Legal: Escrow partner shortlist → select final partner
- Ops: Inspector vetting workflow finalized, first 5 applications
- Supply: QR seal vendor shortlist → request samples
- Tech: Database schema finalized in SQL migrations (pre-commit, no code)

### Week 3 — Validation
- Legal: Escrow partnership agreement signed (B-01 resolved)
- Ops: Inspector training materials drafted, first cohort onboarding begins
- Supply: QR seal samples received → field readability tests (B-03 resolved)
- Tech: OpenAPI contract first draft, CI/CD pipelines operational

### Week 4 — Green Light
- Ops: Inspector playbook finalized, 10 inspectors recruited (B-02 resolved)
- Supply: QR seal vendor contracted, serialization scheme locked
- Tech: Infrastructure provisioned (dev/staging), OpenAPI contract reviewed
- **Go/No-Go decision:** All 3 blockers resolved → proceed to Phase 1

---

## Success Criteria

- [ ] Escrow partner confirmed and agreement signed
- [ ] Inspector onboarding playbook drafted with 10+ recruits identified
- [ ] QR seal vendor selected, samples tested, contract ready
- [ ] Database schema frozen and reviewed
- [ ] OpenAPI contract published for all 5 app surfaces
- [ ] CI/CD pipelines running on dev environment
- [ ] Dev/staging infrastructure provisioned
- [ ] Tech stack decisions documented and team-aligned

---

## Key Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Escrow license takes >4 weeks | Entire project delayed | Prioritize partner escrow model (Paystack/Flutterwave) over self-licensing |
| Inspector recruitment slow | Tech built with no one to use it | Start recruitment Week 1, offer signup incentives |
| QR seal sample fails field test | Custody chain design must change | Test multiple vendors in parallel, have fallback material |
| Team not aligned on OpenAPI first | Parallel work causes integration hell | Mandate spec review before any endpoint implementation |

---

## Outputs of Phase Zero

Deliverable | Owner | Due
--- | --- | ---
Escrow partnership agreement (signed) | Legal / Ops | Week 3
Inspector onboarding playbook | Ops | Week 4
QR seal vendor contract + serialization spec | Ops / Supply | Week 4
Database migration SQL (schema only) | Engineering | Week 2
OpenAPI 3.0 spec (all surfaces) | Engineering | Week 4
Terraform/Pulumi infra code | Engineering | Week 4
CI/CD pipeline config | Engineering | Week 3
Architecture decision record (ADR) | Engineering | Week 4
