# VERIDROP — Project Context (Superpowers-Enabled)

You have Superpowers. This project-level AGENTS.md extends the global Superpowers methodology with Veridrop-specific context. Follow the global Superpowers workflow (Brainstorm → Plan → TDD → Review), then layer on these project details.

---

## 1. OPERATIONAL DIRECTIVES

- **Follow instructions immediately.** No deviation.
- **Zero fluff.** No philosophical lectures or unsolicited advice.
- **Stay focused.** Concise answers only.
- **Output first.** Prioritize code and visual solutions.

---

## 2. PROJECT OVERVIEW

**Veridrop** is a trust commerce infrastructure platform for Africa. It provides escrow-protected payments, physical inspection at source, and managed logistics — the trust layer for verified commerce.

**Current Status:** Phase Zero (pre-development). 3 pre-flight blockers must be resolved before coding begins:
- **B-01** — Escrow licensing / payment partnership (Paystack vs Flutterwave vs direct CBN license)
- **B-02** — Inspector gig network (recruit 10–20 inspectors in target metro)
- **B-03** — Tamper-evident QR seal supply chain (vendor selection, serialization, field testing)

**Target Markets:** Nigeria (initial), expanding across Africa.

---

## 3. FULL TECH STACK

| Layer | Tech | Notes |
|-------|------|-------|
| Backend | NestJS (Node.js/TypeScript) | Modular, OpenAPI-native |
| Vendor/Admin Web | Next.js (React) + Tailwind CSS v4 | App Router, SSR |
| Mobile Apps (Buyer, Vendor, Inspector, Rider) | Flutter (Dart) | Cross-platform, role-based |
| Database | PostgreSQL (primary) + Redis (cache/queue) | ACID for escrow ledger |
| File Storage | S3-compatible (AWS S3 / MinIO) | Encrypted media archive |
| Queue | Bull/BullMQ (Redis-backed) | Inspection dispatch, notifications |
| Search | PostgreSQL full-text → Elasticsearch later | — |
| Auth | JWT + RBAC | 5 roles: Buyer, Vendor, Inspector, Rider, Admin |
| Auth | JWT + RBAC (multi-role) | 5 roles |
| CI/CD | GitHub Actions | PR → lint+typecheck+test → staging → prod |
| Infra | Terraform/Pulumi | dev / staging / prod on AWS or GCP |

---

## 4. WEB APP ARCHITECTURE (veridrop-web)

### Route Structure

```
/                              Landing page (hero, features, how-it-works, CTA)
/login                         Authentication

/(dashboard)/vendor/*          Vendor dashboard
  /vendor/                     Overview
  /vendor/products             Product management
  /vendor/orders               Order management
  /vendor/store                Store settings
  /vendor/balance              Wallet & payouts
  /vendor/dispatch             Dispatch management
  /vendor/inspectors           Inspector assignments

/(dashboard)/admin/*           Admin dashboard
  /admin/                      Overview
  /admin/users                 User management
  /admin/stores                Store approvals
  /admin/transactions          Transaction overview
  /admin/disputes              Dispute resolution
  /admin/dispatch              Dispatch oversight
  /admin/approvals             Approval workflows

/s/[storeId]/*                 Public storefront (per vendor)
/dispatch/[companyId]          Dispatch portal
/rider/*                       Rider dashboard
/buyer/*                       Buyer transaction views
/t/*                           Unique transaction links
/api/*                         API routes (admin, auth, dispatch, disputes, inspections,
                                notifications, orders, products, qr-seals, stores,
                                transactions, vendor)
```

### Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Logo | `src/components/Logo.tsx` | Full, icon, wordmark variants |
| ThemeToggle | `src/components/ThemeToggle.tsx` | Dark/light mode switch |
| Sidebar | `src/components/sidebar.tsx` | Dashboard navigation |
| DataTable | `src/components/data-table.tsx` | Tabular data display |
| StatCard | `src/components/stat-card.tsx` | Metric display cards |
| StatusBadge | `src/components/status-badge.tsx` | Status indicators |

### Library Utilities

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | `cn()` classnames, `formatCurrency()`, `formatDate()`, `statusColor()`, `generateStoreUrl()` |
| `src/lib/theme/ThemeProvider.tsx` | Dark/light context provider with localStorage persistence |
| `src/lib/theme/` | Theme system |

---

## 5. DATABASE SCHEMA (Core Entities)

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

---

## 6. DESIGN SYSTEM — "INTENTIONAL MINIMALISM"

### Philosophy
- **Anti-Generic**: Reject standard layouts. If it looks like a template, it's wrong.
- **Uniqueness**: Bespoke layouts, asymmetry, distinctive typography.
- **The "Why" Factor**: Every element must have a purpose. If none, delete it.
- **Minimalism**: Reduction is the ultimate sophistication.
- **Visuals**: Micro-interactions, perfect spacing, "invisible" UX.
- **ALWAYS use dark theme as default.** Dashboard and landing page share the same palette.

### Brand Colors

```
--brand-teal:        #089b8a
--brand-teal-light:  #00bda6
--brand-blue:        #0a54a6
--brand-gold:        #c8a862
--brand-dark:        #0a0a0a
--brand-card:        #111111
--brand-card-hover:  #1a1a1a
--brand-border:      #1a1a1a
--brand-border-light:#2a2a2a
--brand-text:        #e8e8e8
--brand-muted:       #666666
--brand-danger:      #dc2626
--brand-warning:     #d97706
--brand-success:     #00bda6
```

### CSS Architecture
- **Tailwind CSS v4** with `@theme inline` tokens mapped to CSS custom properties
- Custom properties for spacing scale, border radius, shadows, transitions, gradients
- Animation utilities: `animate-fade-in`, `animate-fade-in-up`, `animate-scale-in`, `stagger`
- Glass effects, grid patterns, mesh patterns via utility classes
- Light mode support via `.light` class overrides with !important

### Gradients
```
--gradient-brand:         linear-gradient(135deg, #0a54a6 0%, #00bda6 100%)
--gradient-gold:          linear-gradient(135deg, #c8a862 0%, #e8c872 100%)
--gradient-text:          linear-gradient(135deg, #00bda6 0%, #0a54a6 50%, #00bda6 100%)
```

### Button Variants
- `.btn-primary` — gradient brand background, white text, shine overlay on hover
- `.btn-secondary` — transparent with border, teal accent on hover

### Cards
- `.card` — dark card with `bg-[#111]`, `border-[#1a1a1a]`, subtle hover gradient

### Color Unification Rule
All surfaces — landing page, vendor dashboard, admin dashboard, storefronts, rider app — MUST use the dark theme palette consistently.

---

## 7. KEY INTEGRATIONS

### Dispatch / Delivery
- Public dispatch portal: `/dispatch/[companyId]`
- Rider dashboard: `/rider/*`
- Delivery companies get unique integration links
- **QR custody chain scanning** at every handoff point
- **Real-time GPS tracking** webhooks for shipment visibility
- Multi-carrier network coordination

### Storefront System
- Each vendor gets a unique public link: `/s/[vendor-slug]`
- Public storefront shows products with "Buy with Veridrop" checkout flow
- **Embedded widget** support for existing websites (drop-in integration)
- **Auto-generates product pages** from vendor listings
- Per-transaction encrypted portal for buyers to track inspection and authorize release

---

## 8. KEY WORKFLOWS

### Transaction Flow
```
Buyer commits funds to escrow
  → Seller notified of verified commitment
  → Inspector dispatched to source location
  → Product inspected & photographed
  → Digital report shared via unique transaction link
  → Buyer reviews evidence & authorizes release
  → Funds settle to seller
  → Logistics coordinates pickup & delivery
  → Buyer confirms receipt
```

### Core Platform Capabilities
1. **Escrow Protection** — Funds held in trust until inspection passes and delivery confirmed
2. **Physical Inspection** — On-site verification by trained inspector network with photo evidence
3. **Unique Transaction Links** — Per-transaction encrypted portal for tracking and approval
4. **Managed Logistics** — Multi-carrier pickup, trackable shipping, automated settlement
5. **QR Seal Custody Chain** — Tamper-evident seals scanned at every handoff

### OpenAPI Contract Strategy
- Define contract before code
- 5 app surfaces share single OpenAPI 3.0 spec
- NestJS `@nestjs/swagger` decorators → auto-generate spec
- CI check: spec diff on PR — breaking changes require team review
- Shared type package (`@veridrop/types`) generated from spec

### Payment Architecture Decision Tree
```
Escrow partner confirmed?
├── Yes, using partner API (Paystack Formal Escrow / Flutterwave Escrow)
│   └── Funds held by partner, Veridrop initiates lock/release via API
└── Yes, self-licensed (CBN PSP license, 6-12 months)
    └── Direct CBN regulatory compliance
```

---

## 9. CODING STANDARDS

### Frontend (Next.js)
- **Library Discipline**: Use existing UI patterns first. No redundant CSS.
- **Stack**: Next.js (React), Tailwind CSS v4, semantic HTML5, TypeScript strict mode
- **Path aliases**: `@/*` maps to `./src/*`
- **State**: React context for theme; server components where possible
- **Dark mode**: Always default. Light mode via localStorage + CSS class toggle.
- **Micro-interactions**: Use CSS animations (`animate-fade-in`, `stagger`, transitions)
- **Typography**: Geist font via next/font, `text-balance` and `text-pretty` utilities

### Backend (NestJS — future)
- Modular architecture with OpenAPI-native `@nestjs/swagger`
- Repository pattern for data access
- JWT + RBAC for auth (5 roles)

### Flutter (future)
- Cross-platform single codebase with role-based views
- Camera-heavy features (QR scanning, inspection photos)
- Offline-first for inspector app

### Git & CI
- Feature branches → PR → lint + typecheck + test → merge to main → staging → prod tag
- Infrastructure-as-Code via Terraform/Pulumi
- Environments: dev, staging, prod

---

## 10. OPEN QUESTIONS & RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Escrow license takes >4 weeks | Entire project delayed | Prioritize partner escrow (Paystack/Flutterwave) |
| Inspector recruitment slow | Tech built with no one to use it | Start recruitment Week 1, offer incentives |
| QR seal sample fails field test | Custody chain design must change | Test multiple vendors in parallel |
| Team not aligned on OpenAPI first | Integration hell | Mandate spec review before any endpoint |
| Payment gateway Nigeria-specific | Limited options | Evaluate Paystack vs Flutterwave for escrow API support |
| Cross-border expansion | Regulatory complexity | Build for Nigeria first, then expand |

---

## 11. SUPERPOWERS WORKFLOW — PROJECT-SPECIFIC ADAPTATIONS

When working on Veridrop, apply the standard Superpowers cycle with these project-specific notes:

### Brainstorming
- **Always reference PHASE_ZERO_PLAN.md** for architectural decisions
- **Check B blockers first** — don't design features dependent on unresolved pre-flight items
- **Include the Nigeria market context** in all design discussions (payment regulations, logistics realities)
- **Visual companions** are especially useful for storefront UX, dashboard layouts, and the QR seal custody chain visualization

### Writing Plans
- **Monorepo context** — specify which package/codebase each task targets (web, backend, mobile)
- **API-first** — tasks touching data MUST start with the OpenAPI contract
- **Database migrations** — any schema change MUST have a corresponding migration file

### TDD
- **Next.js tests**: Use Vitest + React Testing Library
- **NestJS tests**: Jest with supertest for e2e
- **Flutter tests**: flutter_test with mockito/mocktail

### Code Review
- Check: OpenAPI contract updated? Migration written? Dark & light mode both considered?
- Verify: Status enums handled exhaustively? Error states rendered?
