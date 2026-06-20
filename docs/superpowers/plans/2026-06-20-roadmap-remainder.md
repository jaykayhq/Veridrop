# Engineering Roadmap — Remainder (Post Data Integration)

**Date:** 2026-06-20
**Status:** Plan Ready
**Supersedes:** Section 6 of `docs/superpowers/specs/2026-06-19-dashboard-data-integration-design.md`

---

## Context

Dashboard data integration (Phase 1) is 91% complete — all 12 API routes migrated to NeDB, 11 of 14 dashboard pages converted to server components, `mock-data.ts` deleted, login cookie + seed working. Three pages remain.

This document sequences all remaining work into phases with dependencies.

---

## Phase 1: Dashboard Data Integration — Finish (1 day)

**Plan file:** `docs/superpowers/plans/2026-06-20-dashboard-data-integration-completion.md`

| Task | Page | Problem | Fix |
|------|------|---------|-----|
| 1 | Vendor Orders | Still client, fetches `/api/orders` | Server component + `<OrderTable>` client sub-component |
| 2 | Vendor Store | Still client, fetches `/api/vendor/settings` | Server component + `<StoreClient>` with form inputs |
| 3 | Vendor Dispatch | Still client, fetches `/api/vendor/dispatch` (**404**) | Server component + `<DispatchClient>`, fixes bug |

**Total:** 3 files created, 3 files modified. ~2 hours.

---

## Phase 2: Testing Infrastructure (1 day)

**Plan file:** `docs/superpowers/plans/2026-06-20-testing-infrastructure.md`

| Task | What | Tests |
|------|------|-------|
| 1 | Install Vitest + RTL + jsdom | — |
| 2 | Test utility functions (`cn`, `formatCurrency`, `formatDate`, `statusColor`, `generateStoreUrl`) | 12+ tests |
| 3 | Test `StatusBadge` component | 4 tests |
| 4 | Test `StatCard` component | 3 tests |
| 5 | Test `ThemeToggle` component | 1 test |

**Rationale:** Zero tests exist. Cannot safely add features without regression coverage.

**Total:** 1 config file + 1 setup file + 4 test files. ~2 hours.

---

## Phase 3: Storefront System (2 days)

**Plan file:** `docs/superpowers/plans/2026-06-20-storefront-system.md`

| Task | What | Depends on |
|------|------|------------|
| 1 | Create `storefront-queries.ts` (NeDB) | Phase 1 complete |
| 2 | Rewrite `/s/[storeId]` page (remove Appwrite → NeDB) | Task 1 |
| 3 | Create `CartProvider` (React context + localStorage) | — |
| 4 | Create cart page (`/s/[storeId]/cart`) | Task 3 |
| 5 | Create checkout flow (`/s/[storeId]/checkout`) | Task 3, Phase 1 API routes |
| 6 | Wire up store layout with CartProvider | Task 3 |

**Currently:** `/s/[storeId]` exists but uses **Appwrite** — will hard-crash without Appwrite env vars. No cart or checkout.

**Total:** 1 query file + 5 page files + 1 provider + 1 layout. ~4 hours.

---

## Phase 4: Dispatch Portal + Rider App (1 day)

**Plan file:** `docs/superpowers/plans/2026-06-20-dispatch-portal.md`

| Task | What | Depends on |
|------|------|------------|
| 1 | Create `dispatch-queries.ts` (NeDB) | Phase 1 complete |
| 2 | Rewrite `/dispatch/[companyId]` landing (remove Appwrite → NeDB) | Task 1 |
| 3 | Rewrite `/dispatch/[companyId]/dashboard` (hardcoded → NeDB) | Task 1 |
| 4 | Rewrite `/rider` page (hardcoded → NeDB) | Task 1 |
| 5 | Verify seed has dispatch + rider data | Task 1 |

**Currently:** Dispatch landing uses Appwrite. Dashboard has hardcoded arrays. Rider page has hardcoded data. Dispatch API routes already use NeDB (good).

**Total:** 1 query file + 3 page rewrites. ~3 hours.

---

## Phase 5: Future (Postponed)

| Item | Dependency | Why Not Now |
|------|------------|-------------|
| NeDB → PostgreSQL migration | Phase 1-4 stable | NeDB is sufficient for dev; PG needed for production |
| Escrow workflow (order → lock → inspector → release) | B-01 blocker | No escrow partner confirmed yet |
| Inspection system (checklists, photo capture, pass/fail) | B-02 blocker | Inspector network not recruited yet |
| QR seal custody chain | B-03 blocker | QR vendor not selected yet |
| Mobile apps (Flutter) | Web stable first | Phase 1-4 must ship before mobile |

---

## Effort Summary

| Phase | Files Created | Files Modified | Est. Time |
|-------|:------------:|:--------------:|:---------:|
| 1: Dashboard completion | 3 | 3 | 2h |
| 2: Testing infrastructure | 5 | 1 (package.json) | 2h |
| 3: Storefront system | 9 | 1 | 4h |
| 4: Dispatch portal | 1 | 3 | 3h |
| **Total** | **18** | **8** | **~11h** |
