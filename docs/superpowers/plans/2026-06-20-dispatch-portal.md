# Dispatch Portal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Appwrite-backed `/dispatch/[companyId]` page with NeDB, convert dispatch dashboard to real data (remove hardcoded arrays), ensure rider onboarding works end-to-end via NeDB API routes.

**Architecture:** Server components fetch company and rider data from NeDB via `queries.ts`. Dispatch dashboard computes stats from `db.riders` and `db.orders`. Rider page fetches assignments from NeDB.

**Tech Stack:** Next.js 16 (App Router), NeDB (nedb-promises), Tailwind CSS v4, TypeScript

**Verification:** `cd veridrop-web && npm run build`

---

## File Inventory

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/app/dispatch/[companyId]/page.tsx` | Replace Appwrite with NeDB |
| Modify | `src/app/dispatch/[companyId]/dashboard/page.tsx` | Replace hardcoded data with NeDB queries |
| Modify | `src/app/rider/page.tsx` | Replace hardcoded data with NeDB queries |
| Create | `src/lib/api/dispatch-queries.ts` | Dispatch-specific NeDB query functions |
| Add to seed | `src/lib/api/seed.ts` | Ensure seed has dispatch company + riders |

---

### Task 1: Create Dispatch Queries Module

- [ ] **Step 1: Create `src/lib/api/dispatch-queries.ts`**

```ts
import { db } from "./db";
import type { DispatchCompany, Rider, Order } from "./types";

export async function getCompanyById(companyId: string) {
  return (await db.dispatchCompanies.findOne({ _id: companyId })) as DispatchCompany | null;
}

export async function getCompanyRiders(companyId: string) {
  return (await db.riders.find({ companyId })) as Rider[];
}

export async function getCompanyDashboard(companyId: string) {
  const riders = await getCompanyRiders(companyId);
  const orders = (await db.orders.find({})) as Order[];
  const companyOrders = orders.filter((o) => o.dispatchCompanyId === companyId);

  return {
    activeDeliveries: companyOrders.filter((o) => ["picked_up", "in_transit", "out_for_delivery"].includes(o.status)).length,
    pendingPickup: companyOrders.filter((o) => o.status === "passed").length,
    deliveredToday: companyOrders.filter((o) => o.status === "delivered").length,
    qrScansToday: companyOrders.filter((o) => o.status === "delivered").length, // proxy until scan log exists
    activeRiders: riders.filter((r) => r.status === "available" || r.status === "on_delivery").length,
    totalRiders: riders.length,
    recentDeliveries: companyOrders.slice(-5).reverse(),
  };
}

export async function getRiderAssignments(riderId: string) {
  const orders = (await db.orders.find({ riderId })) as Order[];
  return orders.reverse();
}
```

---

### Task 2: Rewrite Dispatch Company Landing Page

- [ ] **Step 1: Rewrite `src/app/dispatch/[companyId]/page.tsx`**

Replace Appwrite with NeDB query. Keep the same UI.

```tsx
import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import { getCompanyById } from "@/lib/api/dispatch-queries";
import { notFound } from "next/navigation";

export default async function DispatchPortalPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const company = await getCompanyById(companyId);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-app text-text-primary p-6">
      <div className="max-w-4xl mx-auto bg-surface border border-default rounded-xl p-8">
        <LogoIcon size={48} className="mb-6" />
        <h1 className="text-2xl font-bold mb-2">{company.name} Dispatch Portal</h1>
        <p className="text-text-muted mb-8">Manage your Veridrop delivery riders and active pickups.</p>

        <div className="flex gap-4">
          <Link
            href={`/dispatch/${companyId}/dashboard`}
            className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Dashboard
          </Link>
          <Link
            href={`/dispatch/${companyId}/onboard`}
            className="px-6 py-3 border border-default text-text-secondary text-sm font-medium rounded-lg hover:border-hover transition-colors"
          >
            Manage Riders
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build.

---

### Task 3: Rewrite Dispatch Dashboard with Real Data

- [ ] **Step 1: Rewrite `src/app/dispatch/[companyId]/dashboard/page.tsx`**

Replace all hardcoded numbers with `getCompanyDashboard()` data.

```tsx
import { LogoIcon } from "@/components/Logo";
import { getCompanyById, getCompanyDashboard } from "@/lib/api/dispatch-queries";
import { notFound } from "next/navigation";

export default async function DispatchDashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const [company, data] = await Promise.all([
    getCompanyById(companyId),
    getCompanyDashboard(companyId),
  ]);

  if (!company) notFound();

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="border-b border-default bg-app px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">{company.name}</span>
            <span className="text-[10px] text-text-muted ml-2">Dispatch Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{data.activeRiders} riders online</span>
            <div className="h-6 w-px bg-default" />
            <span className="text-emerald-400">● Live</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Active Deliveries</p>
            <p className="text-lg font-semibold mt-1">{data.activeDeliveries}</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Pending Pickup</p>
            <p className="text-lg font-semibold text-yellow-400 mt-1">{data.pendingPickup}</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">Delivered Today</p>
            <p className="text-lg font-semibold text-emerald-400 mt-1">{data.deliveredToday}</p>
          </div>
          <div className="bg-surface rounded-xl border border-default p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider">QR Scans Today</p>
            <p className="text-lg font-semibold text-brand-teal-light mt-1">{data.qrScansToday}</p>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-surface rounded-xl border border-default overflow-hidden">
          <div className="px-5 py-4 border-b border-default">
            <h3 className="text-sm font-semibold">Active Deliveries</h3>
          </div>
          {data.recentDeliveries.length > 0 ? (
            <div className="divide-y divide-default">
              {data.recentDeliveries.map((d) => (
                <div key={d._id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{d.productName}</div>
                      <div className="text-xs text-text-muted">{d._id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-text-muted">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/30 capitalize">
                      {d.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-text-muted">
              No active deliveries yet.
            </div>
          )}
        </div>

        {/* QR Scan Terminal (placeholder) */}
        <div className="bg-surface rounded-xl border border-default p-6">
          <h3 className="text-sm font-semibold mb-4">QR Custody Scanner</h3>
          <div className="bg-input border border-default rounded-lg p-4 text-center">
            <div className="mx-auto h-24 w-24 rounded-lg border-2 border-dashed border-hover flex items-center justify-center mb-3">
              <span className="text-3xl opacity-30">📷</span>
            </div>
            <p className="text-sm text-text-muted">Point camera at Veridrop QR seal to scan</p>
            <p className="text-xs text-text-muted mt-1">Opens camera on mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build.

---

### Task 4: Rewrite Rider Page with Real Data

- [ ] **Step 1: Rewrite `src/app/rider/page.tsx`**

Replace hardcoded assignments with NeDB data. Keep the same UI.

```tsx
import { LogoIcon } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { db } from "@/lib/api/db";
import type { Order } from "@/lib/api/types";

// For demo: show all orders as rider assignments
async function getRiderAssignments() {
  return (await db.orders.find({})) as Order[];
}

export default async function RiderPage() {
  const assignments = await getRiderAssignments();

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="border-b border-default bg-app px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">Rider App</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="text-emerald-400">● Available</span>
            <ThemeToggle />
            <div className="h-5 w-5 rounded-full bg-border flex items-center justify-center text-[10px]">
              R
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Your Assignments</h1>
            <p className="text-xs text-text-muted mt-1">{assignments.length} orders in system</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Scan QR
          </button>
        </div>

        <div className="space-y-3">
          {assignments.length > 0 ? assignments.map((a) => (
            <div key={a._id} className="bg-surface rounded-xl border border-default p-4 hover:border-hover transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.productName}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${
                        a.status === "delivered"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : a.status === "picked_up" || a.status === "in_transit"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {a.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Order {a._id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-brand-teal-light/10 text-brand-teal-light text-xs font-medium rounded-lg border border-brand-teal-light/20 hover:bg-brand-teal-light/20 transition-colors">
                  Scan QR at Pickup
                </button>
                <button className="px-3 py-2 border border-default text-text-secondary text-xs font-medium rounded-lg hover:border-hover transition-colors">
                  Navigate
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-surface rounded-xl border border-default p-8 text-center text-sm text-text-muted">
              No assignments yet. Orders will appear here once inspection passes.
            </div>
          )}
        </div>

        {/* QR Scanner Quick Action */}
        <div className="bg-surface rounded-xl border border-default p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-input border border-default flex items-center justify-center text-xl">
              📷
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">QR Custody Scan</h3>
              <p className="text-xs text-text-muted mt-0.5">Scan the Veridrop tamper-evident seal at every handoff point</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
              Open Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build.

---

### Task 5: Verify Dispatch API Routes + Seed

- [ ] **Step 1: Verify dispatch API routes work with NeDB**

The following API routes already use NeDB and need no changes:
- `src/app/api/dispatch/companies/route.ts` ✓
- `src/app/api/dispatch/companies/[id]/route.ts` ✓
- `src/app/api/dispatch/companies/[id]/riders/route.ts` ✓

- [ ] **Step 2: Verify seed creates dispatch + rider data**

Read `src/lib/api/seed.ts` and confirm it creates at least 1 dispatch company and 2-3 riders. If not, add them:

```ts
// Add to seed if not present:
if (counts.dispatchCompanies === 0) {
  const companyId = id();
  await db.dispatchCompanies.insert({ _id: companyId, name: "Swift Logistics", vendorId: vendorIds[0], status: "connected", activeRiders: 3, deliveriesToday: 12, onboarding: false, coverage: ["Ikeja", "Surulere", "VI"], createdAt: new Date().toISOString() });
  await db.riders.insert({ _id: id(), companyId, name: "Emeka N.", phone: "+234 800 000 0001", status: "on_delivery", activeDeliveries: 2, totalDeliveries: 45, createdAt: new Date().toISOString() });
  await db.riders.insert({ _id: id(), companyId, name: "Fatima Y.", phone: "+234 800 000 0002", status: "available", activeDeliveries: 0, totalDeliveries: 38, createdAt: new Date().toISOString() });
}
```

- [ ] **Step 3: Full build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build with zero errors.
