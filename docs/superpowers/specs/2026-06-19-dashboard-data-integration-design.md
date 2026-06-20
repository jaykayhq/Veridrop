# Dashboard Data Integration Design

**Date:** 2026-06-19
**Status:** Draft
**Goal:** Replace all hardcoded dashboard data with real data from NeDB, with proper state handling (loading, empty, error, auth-guarded).

---

## 1. Architecture

### Data Flow

```
Dashboard Page (async Server Component)
  ├── cookies() → JWT token
  ├── verifyToken() → AuthPayload
  ├── getAuthUser() → User from NeDB
  ├── redirect to /login if unauthorized
  └── queries.ts → typed data from NeDB (direct, no HTTP)
       └── render
            ├── <Suspense> → <StatsGrid />
            ├── <Suspense> → <DataTable />
            └── <EmptyState /> when data.length === 0
```

API routes remain for client-side consumers (storefront, tracking pages, mobile apps). Server components bypass HTTP and query NeDB directly since they share the same Node.js process.

### Layer Separation

| Layer | File | Responsibility |
|-------|------|----------------|
| Auth (server) | `lib/api/auth-server.ts` | JWT from cookies, user lookup, role guard, redirect |
| Queries | `lib/api/queries.ts` | Typed NeDB queries per dashboard view, stats computation |
| Auth (API) | `lib/api/auth.ts` | JWT from Authorization header (existing, unchanged) |
| DB | `lib/api/db.ts` | NeDB datastore initialization (existing, unchanged) |
| Helpers | `lib/api/helpers.ts` | ok(), err(), id() (existing, unchanged) |

---

## 2. Phase 1: Fix API Routes

### Problem
All API route files import from `MOCK_*` arrays in `lib/api/mock-data.ts` which are empty arrays. Routes return zero results for every query.

### Solution
Replace every `MOCK_*` reference with NeDB queries. The seed script (`lib/api/seed.ts`) already populates NeDB with demo data.

### Files to modify

| Route File | Current Pattern | New Pattern |
|---|---|---|
| `api/orders/route.ts` | `MOCK_ORDERS.filter(...)` | `db.orders.find({ vendorId: auth.userId })` |
| `api/products/route.ts` | `MOCK_PRODUCTS.filter(...)` | `db.products.find({ vendorId: auth.userId })` |
| `api/admin/users/route.ts` | `MOCK_USERS.filter(...)` | `db.users.find({ role: filterRole })` |
| `api/admin/stores/route.ts` | mock vendor+product transform | `db.products.find()`, group by vendor |
| `api/admin/dispatch/route.ts` | `MOCK_DISPATCH.filter(...)` | `db.dispatchCompanies.find()` |
| `api/admin/approvals/route.ts` | mock pending approvals | `db.users.find({ status: "pending" })` |
| `api/vendor/balance/route.ts` | mock order aggregation | `db.orders.find({ vendorId })`, aggregate |
| `api/vendor/settings/route.ts` | mock user lookup | `db.users.findOne({ _id: userId })` |
| `api/transactions/route.ts` | `MOCK_ORDERS` enrichment | `db.orders.find()`, enrich from db.users |
| `api/disputes/route.ts` | `MOCK_DISPUTES` | `db.disputes.find()` |
| `api/inspections/route.ts` | `MOCK_INSPECTIONS` | `db.inspections.find()` |
| `api/notifications/route.ts` | `MOCK_NOTIFICATIONS` | `db.notifications.find({ userId })` |

### Cleanup
- Delete `lib/api/mock-data.ts` (all empty arrays, no longer needed)
- Ensure `seed.ts` runs on app startup (call from global middleware or `layout.tsx`)

---

## 3. Phase 2: Data Fetcher Layer

### `src/lib/api/queries.ts`

Each dashboard page gets a single query function that returns a typed result matching its UI needs:

```typescript
export async function getVendorDashboard(userId: string): Promise<{
  activeOrders: number;
  escrowBalance: number;
  monthlyVolume: number;
  passRate: number;
  recentOrders: EnrichedOrder[];
}>
```

```typescript
export async function getVendorOrders(userId: string, status?: string): Promise<{
  total: number;
  orders: EnrichedOrder[];
  statusCounts: Record<OrderStatus, number>;
}>
```

```typescript
export async function getVendorProducts(userId: string): Promise<{
  activeListings: number;
  outOfStock: number;
  totalSales: number;
  products: Product[];
}>
```

```typescript
export async function getVendorStore(userId: string): Promise<{
  store: User;
  url: string;
}>
```

```typescript
export async function getVendorBalance(userId: string): Promise<{
  available: number;
  escrowLocked: number;
  securityReserve: number;
  recentTransactions: Escrow[];
}>
```

```typescript
export async function getVendorInspectors(vendorId: string): Promise<{
  available: number;
  onAssignment: number;
  avgRating: number;
  inspectors: Inspector[];
}>
```

```typescript
export async function getVendorDispatch(vendorId: string): Promise<{
  connected: number;
  activeRiders: number;
  deliveriesToday: number;
  companies: DispatchCompany[];
}>
```

```typescript
export async function getAdminDashboard(): Promise<{
  totalUsers: number;
  activeOrders: number;
  escrowVolume: number;
  disputeRate: number;
  recentTransactions: EnrichedOrder[];
}>
```

```typescript
export async function getAdminUsers(role?: string, search?: string): Promise<{
  total: number;
  users: User[];
}>
```

```typescript
export async function getAdminTransactions(): Promise<{
  totalVolume: number;
  activeEscrows: number;
  avgAmount: number;
  transactions: EnrichedOrder[];
}>
```

```typescript
export async function getAdminDisputes(): Promise<{
  open: number;
  underReview: number;
  avgResolutionTime: number;
  disputes: Dispute[];
}>
```

```typescript
export async function getAdminDispatch(): Promise<{
  totalCompanies: number;
  activeCompanies: number;
  totalRiders: number;
  totalDeliveries: number;
  companies: DispatchCompany[];
}>
```

```typescript
export async function getAdminStores(): Promise<{
  totalStores: number;
  activeStores: number;
  pendingStores: number;
  totalProducts: number;
  stores: EnrichedStore[];
}>
```

```typescript
export async function getAdminApprovals(): Promise<{
  pending: number;
  vendors: number;
  inspectors: number;
  riders: number;
  approvals: User[];
}>
```

### Helper: Enrichment

Create `enrichOrder()` that joins order with buyer/vendor names from NeDB, matching the existing enrichment pattern in API routes:

```typescript
async function enrichOrder(order: Order): Promise<EnrichedOrder> {
  const [buyer, vendor] = await Promise.all([
    db.users.findOne({ _id: order.buyerId }),
    db.users.findOne({ _id: order.vendorId }),
  ]);
  return { ...order, buyerName: buyer?.name || "Unknown", vendorName: vendor?.name || "Unknown" };
}
```

### Error Handling

Each query function wraps NeDB calls in try/catch. Errors are thrown as `DataFetchError` with context (which query, what params). The server component's error boundary catches and displays a retry UI.

---

## 4. Phase 3: Refactor Dashboard Pages

### Pattern

Each dashboard page becomes an async server component:

```typescript
// Page component (server)
export default async function Page() {
  const user = await requireVendor();  // or requireAdmin
  const data = await getVendorDashboard(user._id);

  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <StatsGrid items={metricsToStats(data)} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <DataTableOrEmpty data={data.recentOrders} />
      </Suspense>
    </div>
  );
}
```

### State Handling Matrix

| State | Mechanism | UX |
|-------|-----------|----|
| **Loading** | `<Suspense>` with `<Skeleton>` fallback | Animated placeholder matching layout |
| **Empty** | `<EmptyState>` component | Message + illustration + CTA |
| **Error** | `error.tsx` (error boundary) | Error message + retry button |
| **Not Found** | `not-found.tsx` | 404 with redirect options |
| **Unauthenticated** | `requireVendor()`/`requireAdmin()` redirect | Redirect to `/login` |
| **Wrong Role** | `requireAdmin()` when user is vendor | Redirect to `/login` |

### Pages to refactor (14 total)

**Vendor (7):**
- `vendor/page.tsx` — dashboard overview (stats + recent orders)
- `vendor/orders/page.tsx` — order list with status filter
- `vendor/products/page.tsx` — product inventory
- `vendor/store/page.tsx` — store settings form
- `vendor/balance/page.tsx` — wallet view
- `vendor/inspectors/page.tsx` — inspector roster
- `vendor/dispatch/page.tsx` — dispatch companies

**Admin (7):**
- `admin/page.tsx` — overview
- `admin/users/page.tsx` — user management
- `admin/transactions/page.tsx` — transaction list
- `admin/disputes/page.tsx` — dispute queue
- `admin/dispatch/page.tsx` — dispatch oversight
- `admin/stores/page.tsx` — store management
- `admin/approvals/page.tsx` — approval queue

### Client Component Extraction

DataTable rows, form fields, and interactive UI are extracted into client sub-components (`*-table.tsx`, `*-form.tsx`, etc.) that receive data as props from the server parent. This keeps interactivity while maintaining server-side data fetching.

---

## 5. Auth Server-Side

### `src/lib/api/auth-server.ts`

```typescript
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { db } from "./db";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function getAuthUser() {
  const store = await cookies();
  const token = store.get("veridrop_token")?.value;
  if (!token) return null;
  try {
    const payload = verify(token, JWT_SECRET) as AuthPayload;
    return db.users.findOne({ _id: payload.userId });
  } catch { return null; }
}

export async function requireVendor(): Promise<User> {
  const user = await getAuthUser();
  if (!user || user.role !== "vendor") redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") redirect("/login");
  return user;
}
```

### Login Cookie Update

The existing `api/auth/login/route.ts` needs to set an HTTP-only cookie alongside the existing body response:

```typescript
const res = ok({ token, user });
res.cookies.set("veridrop_token", token, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 86400 * 7,
});
```

This ensures server components can read the auth token. The existing localStorage-based auth continues working for client components alongside the cookie.

---

## 6. What Comes Next

After this data integration is complete, the engineering roadmap priorities:

| Priority | Item | Rationale |
|----------|------|-----------|
| 1 | **Testing infrastructure** (Vitest + RTL) | Zero tests exist. Cannot safely add features without regression coverage. |
| 2 | **Storefront system** (PRD §14) | Core customer-facing feature. `/s/[slug]` route + "Buy with Veridrop" flow. |
| 3 | **Dispatch portal** (PRD §15) | Second core workflow. `/dispatch/[companyId]` + rider management. |
| 4 | **NeDB → PostgreSQL migration** | NeDB is a local file DB. PRD and Phase Zero plan specify PostgreSQL. |
| 5 | **Escrow workflow** (PRD §6) | Connect order → escrow lock → inspector dispatch → release. |
| 6 | **Inspection system** (PRD §16) | Dynamic checklists, photo capture, pass/fail workflow. |

The three Phase Zero blockers (B-01 escrow partner, B-02 inspector network, B-03 QR seals) are business/ops dependencies that must be resolved before the corresponding engineering features can go to production.
