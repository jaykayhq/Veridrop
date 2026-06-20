# Dashboard Data Integration — Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish converting the 3 remaining client-side dashboard pages to async server components with real NeDB data, completing the dashboard data integration.

**Architecture:** Server components call `requireVendor()` + `getVendor*()` directly (no HTTP fetch). Interactive UI elements extracted to client sub-components that receive data as props.

**Tech Stack:** Next.js 16 (App Router), NeDB (nedb-promises), Tailwind CSS v4, TypeScript

**Verification:** `cd veridrop-web && npm run build`

---

## File Inventory

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/app/(dashboard)/vendor/orders/order-table.tsx` | Client component: filter buttons + DataTable |
| Create | `src/app/(dashboard)/vendor/store/store-client.tsx` | Client component: store form + copy button |
| Create | `src/app/(dashboard)/vendor/dispatch/dispatch-client.tsx` | Client component: dispatch list + copy-to-clipboard |
| Modify | `src/app/(dashboard)/vendor/orders/page.tsx` | Convert to server component |
| Modify | `src/app/(dashboard)/vendor/store/page.tsx` | Convert to server component |
| Modify | `src/app/(dashboard)/vendor/dispatch/page.tsx` | Convert to server component (fixes 404 bug) |

---

### Task 1: Convert Vendor Orders Page

**Files:**
- Create: `src/app/(dashboard)/vendor/orders/order-table.tsx`
- Modify: `src/app/(dashboard)/vendor/orders/page.tsx`

- [ ] **Step 1: Create `order-table.tsx`**

Client component with filter buttons and DataTable. Receives orders as props, manages `activeFilter` state client-side.

```tsx
"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusFilters = ["all", "pending", "locked", "passed", "in_transit", "delivered", "disputed", "refunded"];

interface OrderTableProps {
  orders: any[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
              activeFilter === f
                ? "bg-brand-teal-light text-white border-brand-teal-light"
                : "bg-transparent text-text-muted border-default hover:border-hover"
            }`}
          >
            {f === "all" ? "All" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "Order" },
            { key: "buyerName", header: "Buyer" },
            { key: "productName", header: "Product" },
            { key: "amount", header: "Amount", className: "font-medium", render: (row) => formatCurrency(row.amount as number) },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
            { key: "createdAt", header: "Date", render: (row) => <span className="text-text-muted">{formatDate(row.createdAt as string)}</span> },
          ]}
          data={filtered}
        />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Rewrite `page.tsx`**

Convert to async server component. Import `requireVendor` and `getVendorOrders`. Pass orders to `<OrderTable>`. Add empty state.

```tsx
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorOrders } from "@/lib/api/queries";
import OrderTable from "./order-table";

export default async function VendorOrders() {
  const user = await requireVendor();
  const data = await getVendorOrders(user._id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Orders</h1>
          <p className="text-sm text-text-muted mt-1">All your escrow-locked orders</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
          + New Order
        </button>
      </div>

      {data.orders.length > 0 ? (
        <OrderTable orders={data.orders} />
      ) : (
        <div className="bg-surface rounded-xl border border-default p-8 text-center text-sm text-text-muted">
          No orders yet. Orders will appear here once customers make purchases.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build, no errors.

---

### Task 2: Convert Vendor Store Settings Page

**Files:**
- Create: `src/app/(dashboard)/vendor/store/store-client.tsx`
- Modify: `src/app/(dashboard)/vendor/store/page.tsx`

- [ ] **Step 1: Create `store-client.tsx`**

Client component containing the form inputs, copy button, and embed code section. Receives initial form values as props.

```tsx
"use client";

import { useState } from "react";

interface StoreClientProps {
  initialSlug: string;
  initialStoreName: string;
  origin: string;
}

export default function StoreClient({ initialSlug, initialStoreName, origin }: StoreClientProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [storeName, setStoreName] = useState(initialStoreName);
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);

  const storeUrl = `${origin}/s/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Store Link Card */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Your Store Link</p>
            <p className="text-sm text-text-muted mt-1">Share this link with customers or embed it on your website</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-default bg-app px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-input border border-default rounded-lg p-3">
          <div className="flex-1 font-mono text-sm text-brand-teal-light truncate">
            {storeUrl}
          </div>
          <button
            onClick={copyLink}
            className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Store Settings */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Store Settings</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">Store Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-mono">/s/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                className="flex-1 px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-text-muted uppercase tracking-wider">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-text-muted uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>

      {/* Embed Code */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Embed Widget</h3>
        <p className="text-xs text-text-muted mb-3">
          Add this widget to your existing website to enable Veridrop checkout
        </p>
        <div className="bg-input border border-default rounded-lg p-3 font-mono text-xs text-text-secondary overflow-x-auto">
          {`<div data-veridrop-store="${slug}" data-theme="dark"></div>\n<script src="https://veridrop.app/widget.js"></script>`}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`<div data-veridrop-store="${slug}" data-theme="dark"></div>\n<script src="https://veridrop.app/widget.js"></script>`);
          }}
          className="mt-3 px-4 py-1.5 border border-default text-text-secondary text-xs font-medium rounded-md hover:border-hover transition-colors"
        >
          Copy Code
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Rewrite `page.tsx`**

Server component. Fetches user/store data via `requireVendor()` → `getVendorStore()`, computes `origin` from headers, renders `<StoreClient>`.

```tsx
import { headers } from "next/headers";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorStore } from "@/lib/api/queries";
import StoreClient from "./store-client";

export default async function VendorStore() {
  const user = await requireVendor();
  const storeData = await getVendorStore(user._id);
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  const origin = `${protocol}://${host}`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Storefront</h1>
        <p className="text-sm text-text-muted mt-1">Your unique Veridrop-powered store link</p>
      </div>
      <StoreClient
        initialSlug={storeData.slug}
        initialStoreName={storeData.storeName}
        origin={origin}
      />
    </div>
  );
}
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build, no errors.

---

### Task 3: Convert Vendor Dispatch Page (Fixes 404 Bug)

**Files:**
- Create: `src/app/(dashboard)/vendor/dispatch/dispatch-client.tsx`
- Modify: `src/app/(dashboard)/vendor/dispatch/page.tsx`

- [ ] **Step 1: Create `dispatch-client.tsx`**

Client component with copy-to-clipboard for integration link and dispatch partner list. Receives companies and vendorSlug as props.

```tsx
"use client";

import { useState } from "react";

interface DispatchCompany {
  _id: string;
  name: string;
  status: string;
  activeRiders: number;
  deliveriesToday: number;
}

interface DispatchClientProps {
  companies: DispatchCompany[];
  stats: { connected: number; activeRiders: number; deliveriesToday: number };
  origin: string;
}

export default function DispatchClient({ companies, stats, origin }: DispatchClientProps) {
  const [copyId, setCopyId] = useState<string | null>(null);

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Connected Partners</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">{stats.connected}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active Riders</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{stats.activeRiders}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Today&apos;s Deliveries</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{stats.deliveriesToday}</p>
        </div>
      </div>

      {/* Integration Link */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Dispatch Integration Link</h3>
            <p className="text-xs text-text-muted mt-1">Share this unique link with delivery companies to onboard them</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-input border border-default rounded-lg p-3">
          <div className="flex-1 font-mono text-sm text-brand-teal-light truncate">
            {`${origin}/dispatch/link`}
          </div>
          <button
            onClick={() => copyLink("integration", `${origin}/dispatch/link`)}
            className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            {copyId === "integration" ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Dispatch Partners */}
      <div className="bg-surface rounded-xl border border-default overflow-hidden">
        <div className="px-5 py-4 border-b border-default">
          <h3 className="text-sm font-semibold text-text-primary">Delivery Partners</h3>
        </div>
        <div className="divide-y divide-default">
          {companies.map((dc: DispatchCompany) => (
            <div
              key={dc._id}
              className="flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-input border border-default flex items-center justify-center text-base">
                  🚚
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{dc.name}</div>
                  <div className="text-xs text-text-muted">{dc.activeRiders} riders · {dc.deliveriesToday} today</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    dc.status === "connected"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : dc.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {dc.status}
                </span>
                {dc.status === "connected" && (
                  <a
                    href={`/dispatch/${dc._id}`}
                    className="px-3 py-1 border border-default text-text-secondary text-xs font-medium rounded-md hover:border-hover transition-colors"
                  >
                    Dashboard
                  </a>
                )}
              </div>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-text-muted">
              No dispatch companies connected yet.
            </div>
          )}
        </div>
      </div>

      {/* Integration Instructions */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">How It Works</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Share Link", description: "Send your unique dispatch link to any delivery company" },
            { step: "02", title: "They Connect", description: "Delivery company registers riders and sets coverage zones" },
            { step: "03", title: "Automated Dispatch", description: "Orders are automatically routed to available riders with QR handoff" },
          ].map((s) => (
            <div key={s.step} className="border border-default rounded-lg p-4">
              <span className="text-brand-teal-light text-sm font-bold">{s.step}</span>
              <h4 className="text-sm font-medium text-text-primary mt-1">{s.title}</h4>
              <p className="text-xs text-text-muted mt-1">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Rewrite `page.tsx`**

Server component. Fetches dispatch data via `requireVendor()` → `getVendorDispatch(user._id)`. This fixes the 404 bug (the old code fetched from nonexistent `/api/vendor/dispatch`).

```tsx
import { headers } from "next/headers";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorDispatch } from "@/lib/api/queries";
import DispatchClient from "./dispatch-client";

export default async function VendorDispatch() {
  const user = await requireVendor();
  const data = await getVendorDispatch(user._id);
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  const origin = `${protocol}://${host}`;

  const stats = {
    connected: data.connected,
    activeRiders: data.activeRiders,
    deliveriesToday: data.deliveriesToday,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dispatch</h1>
        <p className="text-sm text-text-muted mt-1">Connect delivery companies and manage logistics</p>
      </div>
      <DispatchClient companies={data.companies} stats={stats} origin={origin} />
    </div>
  );
}
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build, no errors.

---

### Task 4: Final Build Verification

- [ ] **Step 1: Build the entire project**

Run: `cd veridrop-web && npm run build`
Expected: Clean build with zero errors.

- [ ] **Step 2: Verify no remaining API-only client-side fetches in dashboard**

Run: `rg "fetch\(" src/app/\(dashboard\)/`
Expected: No fetch calls remaining in dashboard pages (data now fetched server-side via `queries.ts`).
