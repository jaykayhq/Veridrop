# Dashboard Data Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded mock data across 14 dashboard pages and 12 API routes with real NeDB queries, with proper loading/empty/error/auth states.

**Architecture:** Async server components authenticate via JWT cookie and fetch data through a `queries.ts` layer that queries NeDB directly. API routes switch from empty `MOCK_*` arrays to NeDB. Login sets HTTP-only cookie for server component auth.

**Tech Stack:** Next.js 16 (App Router), NeDB (nedb-promises), JWT (jsonwebtoken), Tailwind CSS v4, TypeScript

**No test framework installed — verification:** `cd veridrop-web && npm run build`

---

## File Inventory

### Create (3 files)
| File | Purpose |
|------|---------|
| `src/lib/api/auth-server.ts` | Server component auth: getAuthUser, requireVendor, requireAdmin |
| `src/lib/api/queries.ts` | Typed NeDB query functions per dashboard view |
| `src/app/(dashboard)/vendor/orders/order-table.tsx` | Client component: filter buttons + DataTable for orders |
| `src/app/(dashboard)/vendor/dispatch/dispatch-client.tsx` | Client component: dispatch list with copy-to-clipboard |

### Delete (1 file)
| File | Reason |
|------|--------|
| `src/lib/api/mock-data.ts` | All empty MOCK_* arrays; delay() inlined where needed |

### Modify (28 files)
| File | Change |
|------|--------|
| `src/app/api/auth/login/route.ts` | Add `Set-Cookie` header for JWT |
| `src/app/(dashboard)/layout.tsx` | Call `seedDatabase()` on mount |
| `src/app/api/orders/route.ts` | MOCK_ORDERS → `db.orders.find()` |
| `src/app/api/products/route.ts` | MOCK_PRODUCTS → `db.products.find()` |
| `src/app/api/admin/users/route.ts` | MOCK_USERS → `db.users.find()` |
| `src/app/api/admin/stores/route.ts` | MOCK_USERS/PRODUCTS → NeDB |
| `src/app/api/admin/dispatch/route.ts` | MOCK_DISPATCH_COMPANIES → NeDB |
| `src/app/api/admin/approvals/route.ts` | MOCK_USERS → `db.users.find()` |
| `src/app/api/transactions/route.ts` | MOCK_ORDERS/USERS → NeDB |
| `src/app/api/disputes/route.ts` | MOCK_DISPUTES → `db.disputes.find()` |
| `src/app/api/inspections/route.ts` | MOCK_INSPECTIONS → `db.inspections.find()` |
| `src/app/api/notifications/route.ts` | MOCK_NOTIFICATIONS → `db.notifications.find()` |
| `src/app/api/vendor/balance/route.ts` | MOCK_ORDERS → `db.orders.find()` |
| `src/app/api/vendor/settings/route.ts` | MOCK_USERS → `db.users.findOne()` |
| `src/app/(dashboard)/vendor/page.tsx` | Server component with real data |
| `src/app/(dashboard)/vendor/orders/page.tsx` | Server component → client table |
| `src/app/(dashboard)/vendor/products/page.tsx` | Server component with real data |
| `src/app/(dashboard)/vendor/store/page.tsx` | Fetch settings from server data |
| `src/app/(dashboard)/vendor/balance/page.tsx` | Server component with real wallet data |
| `src/app/(dashboard)/vendor/inspectors/page.tsx` | Server component with real inspector data |
| `src/app/(dashboard)/vendor/dispatch/page.tsx` | Server component → client UI |
| `src/app/(dashboard)/admin/page.tsx` | Server component with real platform metrics |
| `src/app/(dashboard)/admin/users/page.tsx` | Server component with real user data |
| `src/app/(dashboard)/admin/transactions/page.tsx` | Server component with real transaction data |
| `src/app/(dashboard)/admin/disputes/page.tsx` | Server component with real dispute data |
| `src/app/(dashboard)/admin/dispatch/page.tsx` | Server component with real dispatch data |
| `src/app/(dashboard)/admin/stores/page.tsx` | Server component with real store data |
| `src/app/(dashboard)/admin/approvals/page.tsx` | Server component with real approval data |

---

### Task 1: Login Cookie + Seed on Startup

**Files:**
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/app/(dashboard)/layout.tsx`

**Context:** Server components need JWT from cookies. Login route currently returns token only in body. Seed script is never called.

- [ ] **Step 1: Update login route to set HTTP-only cookie**

Edit `src/app/api/auth/login/route.ts`. Add imports:
```typescript
import { signToken } from '@/lib/api/auth';
import type { AuthPayload } from '@/lib/api/types';
```

After user is found and password matches, generate JWT and set cookie:
```typescript
const token = signToken({
  userId: user.$id,
  email: user.email,
  role: (user.role || 'VENDOR').toLowerCase() as AuthPayload['role'],
});
const response = NextResponse.json({
  success: true,
  data: { token, user: { id: user.$id, email: user.email, name: user.name, role: user.role, storeId: user.storeId } },
});
response.cookies.set("veridrop_token", token, {
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
});
return response;
```

Replace the existing `return NextResponse.json({...})` with this.

- [ ] **Step 2: Call seedDatabase on layout mount**

In `src/app/(dashboard)/layout.tsx`, add import:
```typescript
import { seedDatabase } from "@/lib/api/seed";
```

Inside the `useEffect` that runs on mount (line 23-29), add `seedDatabase();` before `setMounted(true)`.

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: No errors.

---

### Task 2: Delete mock-data.ts + Create auth-server.ts

**Files:**
- Delete: `src/lib/api/mock-data.ts`
- Create: `src/lib/api/auth-server.ts`

- [ ] **Step 1: Create `src/lib/api/auth-server.ts`**

```typescript
import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { db } from "./db";
import { redirect } from "next/navigation";
import type { User } from "./types";

export async function getAuthUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get("veridrop_token")?.value;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (!payload) return null;
    return (await db.users.findOne({ _id: payload.userId })) as User | null;
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

- [ ] **Step 2: Delete `src/lib/api/mock-data.ts`**

Run: `Remove-Item -LiteralPath "src/lib/api/mock-data.ts"`

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Errors in API routes still importing from mock-data — expected, fixed in Tasks 4-7.

---

### Task 3: Create `src/lib/api/queries.ts`

**Files:**
- Create: `src/lib/api/queries.ts`

**Context:** One query function per dashboard view. Each returns typed data matching the page's UI needs. This is imported by all 14 dashboard pages.

- [ ] **Step 1: Write the query module**

Create `src/lib/api/queries.ts` with the following functions. The full code is in the design doc at `docs/superpowers/specs/2026-06-19-dashboard-data-integration-design.md` Section 3. Key functions:

- `getVendorDashboard(vendorId)` → activeOrders, escrowBalance, monthlyVolume, passRate, recentOrders
- `getVendorOrders(vendorId, status?)` → total, orders[], statusCounts
- `getVendorProducts(vendorId)` → activeListings, outOfStock, totalSales, products[]
- `getVendorStore(userId)` → slug, storeName
- `getVendorBalance(vendorId)` → availableBalance, escrowLocked, securityReserve, breakdown
- `getVendorInspectors()` → available, total, inspectors[]
- `getVendorDispatch(vendorId)` → connected, activeRiders, deliveriesToday, companies[]
- `getAdminDashboard()` → totalUsers, activeOrders, escrowVolume, disputeRate, recentTransactions[]
- `getAdminUsers(role?, status?)` → total, users[]
- `getAdminTransactions()` → totalVolume, activeEscrows, avgAmount, transactions[]
- `getAdminDisputes()` → open, underReview, avgResolutionTime, disputes[]
- `getAdminDispatch()` → totalCompanies, activeCompanies, totalRiders, totalDeliveries, companies[]
- `getAdminStores()` → totalStores, activeStores, pendingStores, totalProducts, stores[]
- `getAdminApprovals()` → pending, vendors, inspectors, riders, approvals[]

Also include `enrichOrder()` helper and `calculatePassRate()` helper.

- [ ] **Step 2: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Passes (queries.ts is not imported anywhere yet).

---

### Task 4: Fix Orders + Products API Routes

**Files:**
- Modify: `src/app/api/orders/route.ts`
- Modify: `src/app/api/products/route.ts`

**Pattern:** Replace `import { MOCK_ORDERS } from "@/lib/api/mock-data"` → `import { db } from "@/lib/api/db"` + `import type { Order, User } from "@/lib/api/types"`. Replace array filters with `await db.orders.find({})`.

- [ ] **Step 1: Fix `orders/route.ts`**

Replace `MOCK_ORDERS` import with `db` and `Order` type. Change `GET` to query `db.orders.find({})`, filter by auth role, enrich with buyer/vendor names from `db.users.findOne()`. Change `POST` to insert into `db.orders.insert()`.

- [ ] **Step 2: Fix `products/route.ts`**

Replace `MOCK_PRODUCTS` import. Change `GET` to `db.products.find({})`. Change `POST` to `db.products.insert()`.

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`

---

### Task 5: Fix Admin API Routes (users, stores, dispatch, approvals)

**Files:**
- Modify: `src/app/api/admin/users/route.ts`
- Modify: `src/app/api/admin/stores/route.ts`
- Modify: `src/app/api/admin/dispatch/route.ts`
- Modify: `src/app/api/admin/approvals/route.ts`

- [ ] **Step 1-4: Fix each route**

Each follows the same pattern: remove `MOCK_*` import, add `db` import, replace `.filter()` on mock arrays with `await db.X.find({})`. Remove `delay()` calls. Add `await` to DB writes for PUT routes (approvals).

- [ ] **Step 5: Build check**

Run: `cd veridrop-web && npm run build`

---

### Task 6: Fix Disputes + Inspections + Notifications API Routes

**Files:**
- Modify: `src/app/api/disputes/route.ts`
- Modify: `src/app/api/inspections/route.ts`
- Modify: `src/app/api/notifications/route.ts`

- [ ] **Step 1-3: Fix each route**

Same pattern: `MOCK_DISPUTES` → `db.disputes.find({})`, `MOCK_INSPECTIONS` → `db.inspections.find({})`, `MOCK_NOTIFICATIONS` → `db.notifications.find({})`. Add `await db.X.insert()` for POST routes.

- [ ] **Step 4: Build check**

Run: `cd veridrop-web && npm run build`

---

### Task 7: Fix Transactions + Vendor Balance + Vendor Settings API Routes

**Files:**
- Modify: `src/app/api/transactions/route.ts`
- Modify: `src/app/api/vendor/balance/route.ts`
- Modify: `src/app/api/vendor/settings/route.ts`

- [ ] **Step 1-3: Fix each route**

`transactions/route.ts`: `MOCK_ORDERS` → `db.orders.find({})`, enrich with user names from NeDB.
`vendor/balance/route.ts`: `MOCK_ORDERS` → `db.orders.find({ vendorId: auth.userId })` (business logic stays the same).
`vendor/settings/route.ts`: `MOCK_USERS` → `db.users.findOne({ _id: auth.userId })`, add `db.users.update()` for PUT.

- [ ] **Step 4: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build with NO remaining imports from `mock-data.ts` anywhere.

---

### Task 8: Refactor Vendor Dashboard Overview

**Files:**
- Modify: `src/app/(dashboard)/vendor/page.tsx`

**Pattern for ALL dashboard pages:**
1. Replace inline array with `requireVendor()` / `requireAdmin()` auth call
2. Call corresponding `getVendor*()` / `getAdmin*()` query from `queries.ts`
3. Replace every hardcoded number/string with `data.field`
4. Add empty state: `data.orders.length > 0 ? <DataTable /> : <EmptyState />`

- [ ] **Step 1: Rewrite file**

Convert to async server component. Import `requireVendor` and `getVendorDashboard`. Replace `<StatCard value="18">` with `<StatCard value={String(data.activeOrders)}>`. Replace DataTable `data={recentOrders}` with `data={data.recentOrders}`. Add empty state for when `recentOrders.length === 0`.

- [ ] **Step 2: Build check**

Run: `cd veridrop-web && npm run build`

---

### Task 9: Refactor Vendor Orders Page

**Files:**
- Create: `src/app/(dashboard)/vendor/orders/order-table.tsx`
- Modify: `src/app/(dashboard)/vendor/orders/page.tsx`

**Context:** This page has client-side status filtering — extract the interactive parts into a client sub-component, keep data fetching in the server component.

- [ ] **Step 1: Create `order-table.tsx`**

Client component "use client". Receives `orders` as props. Contains the `useState` for `activeFilter`, the filter buttons, and the DataTable with filtered data. Import `StatusBadge`, `DataTable`, `formatCurrency`, `formatDate`.

- [ ] **Step 2: Rewrite `page.tsx`**

Server component. Calls `requireVendor()` → `getVendorOrders(user._id)`. Returns JSX with the header, "New Order" button, and `<OrderTable orders={data.orders} />`. Add empty state when `data.orders.length === 0`.

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`

---

### Task 10: Refactor Vendor Products Page

**Files:**
- Modify: `src/app/(dashboard)/vendor/products/page.tsx`

- [ ] **Step 1: Rewrite file**

Convert to async server component. Import `requireVendor` and `getVendorProducts`. Hardcoded "5" → `{data.activeListings}`, "2" → `{data.outOfStock}`, `formatCurrency(3438700)` → `{formatCurrency(data.totalSales)}`. DataTable `data={products}` → `data={data.products}`. Add empty state for no products.

- [ ] **Step 2: Build check**

---

### Task 11: Refactor Vendor Store Settings Page

**Files:**
- Modify: `src/app/(dashboard)/vendor/store/page.tsx`

**Context:** This page is a form with hardcoded defaults ("gadgethub-ng", "GadgetHub NG"). The form needs initial values from the server. Use React's `use()` hook with a server-promise to pass initial data into the client component.

- [ ] **Step 1: Rewrite file**

Keep `"use client"`. Add `import { use } from "react"`. At the top of the component function, create a server data promise:
```typescript
const storeData = use(Promise.resolve(
  import("@/lib/api/auth-server").then(m => m.requireVendor()).then(u =>
    import("@/lib/api/queries").then(m => m.getVendorStore(u._id))
  )
));
```

Replace `useState("gadgethub-ng")` → `useState(storeData.slug)`, `useState("GadgetHub NG")` → `useState(storeData.storeName)`.

- [ ] **Step 2: Build check**

---

### Task 12: Refactor Vendor Balance Page

**Files:**
- Modify: `src/app/(dashboard)/vendor/balance/page.tsx`

- [ ] **Step 1: Rewrite file**

Convert to async server component. Import `requireVendor` and `getVendorBalance`. Hardcoded `formatCurrency(284000)` → `{formatCurrency(data.availableBalance)}`, `formatCurrency(892000)` → `{formatCurrency(data.escrowLocked)}`, `formatCurrency(125000)` → `{formatCurrency(data.securityReserve)}`. Breakdown values from `data.breakdown`. Progress from `Math.min(data.breakdown.deliveredOrders, 10)`.

- [ ] **Step 2: Build check**

---

### Task 13: Refactor Vendor Inspectors Page

**Files:**
- Modify: `src/app/(dashboard)/vendor/inspectors/page.tsx`

- [ ] **Step 1: Rewrite file**

Convert to async server component. Import `requireVendor` and `getVendorInspectors`. Replace hardcoded values. Add empty state when `data.inspectors.length === 0`.

- [ ] **Step 2: Build check**

---

### Task 14: Refactor Vendor Dispatch Page

**Files:**
- Create: `src/app/(dashboard)/vendor/dispatch/dispatch-client.tsx`
- Modify: `src/app/(dashboard)/vendor/dispatch/page.tsx`

**Context:** This page has interactive elements (copy-to-clipboard buttons). Extract those into a client component.

- [ ] **Step 1: Create `dispatch-client.tsx`**

Client component "use client". Receives `companies` array and `vendorSlug` as props. Contains `useState` for `origin`, `copyId`. Handles the copy-to-clipboard logic. Renders the stats cards, integration link section, and dispatch partner list with buttons.

- [ ] **Step 2: Rewrite `page.tsx`**

Server component. Calls `requireVendor()` → `getVendorDispatch(user._id)`. Renders `<DispatchClient data={data.companies} vendorSlug={user.slug || ""} />`.

- [ ] **Step 3: Build check**

---

### Task 15: Refactor Admin Dashboard Overview

**Files:**
- Modify: `src/app/(dashboard)/admin/page.tsx`

- [ ] **Step 1: Rewrite file**

Convert to async server component. Import `requireAdmin` and `getAdminDashboard`. Replace hardcoded stats ("1,482" → `{data.totalUsers}`, "347" → `{data.activeOrders}`, "₦8.2M" → `{formatCurrency(data.escrowVolume)}`, "2.1%" → `{data.disputeRate}`). Replace DataTable data with `data.recentTransactions`. Replace sidebar hardcoded numbers with computed from data. Add empty states.

- [ ] **Step 2: Build check**

---

### Task 16: Refactor Admin Users + Transactions + Disputes Pages

**Files:**
- Modify: `src/app/(dashboard)/admin/users/page.tsx`
- Modify: `src/app/(dashboard)/admin/transactions/page.tsx`
- Modify: `src/app/(dashboard)/admin/disputes/page.tsx`

**Context:** These 3 pages follow the exact same pattern — inline array + StatCards + DataTable.

- [ ] **Step 1: Rewrite `admin/users/page.tsx`**

Convert to async server component. Remove `readOnly` from search input (makes it functional). Replace hardcoded `users` array with `getAdminUsers()`. Map NeDB `_id` to display `id`, map `name/email/role/status/createdAt` to table columns.

- [ ] **Step 2: Rewrite `admin/transactions/page.tsx`**

Convert to async server component. Replace hardcoded stats with `getAdminTransactions()`. DataTable uses `data.transactions` with enriched buyer/vendor names.

- [ ] **Step 3: Rewrite `admin/disputes/page.tsx`**

Convert to async server component. Replace hardcoded stats with `getAdminDisputes()`. DataTable uses `data.disputes`. Note: `avgResolutionTime` will show "—" since we don't have resolution time data yet.

- [ ] **Step 4: Build check**

---

### Task 17: Refactor Admin Dispatch + Stores + Approvals Pages

**Files:**
- Modify: `src/app/(dashboard)/admin/dispatch/page.tsx`
- Modify: `src/app/(dashboard)/admin/stores/page.tsx`
- Modify: `src/app/(dashboard)/admin/approvals/page.tsx`

- [ ] **Step 1: Rewrite `admin/dispatch/page.tsx`**

Convert to async server component. Replace hardcoded `companies` array with `getAdminDispatch()`. Stats: total, active, riders, deliveries from `data.totalCompanies`, `data.activeCompanies`, etc.

- [ ] **Step 2: Rewrite `admin/stores/page.tsx`**

Convert to async server component. Replace hardcoded `stores` array with `getAdminStores()`. Stats: total, active, pending, products from `data.totalStores`, `data.activeStores`, etc. Table columns map `_id`, `name`, `slug`, `owner`, `products`, `status`.

- [ ] **Step 3: Rewrite `admin/approvals/page.tsx`**

Convert to async server component. Replace hardcoded `pendingApprovals` array with `getAdminApprovals()`. Stats: pending, vendors, inspectors, riders from corresponding data fields.

- [ ] **Step 4: Build check**

---

### Task 18: Final Build Verification

- [ ] **Step 1: Build the entire project**

Run: `cd veridrop-web && npm run build`
Expected: Clean build with zero errors.

- [ ] **Step 2: Verify no remaining mock-data references**

Run: `rg "mock-data" src/`
Expected: No matches found anywhere.

- [ ] **Step 3: Verify all 14 dashboard pages load their route**

Check each page's root `export default` is now `async` (servers that use auth/queries). Confirm no page still has inline hardcoded arrays.

- [ ] **Step 4: Summary**

After completion, the following should be true:
- All 12 API routes query NeDB instead of empty MOCK_* arrays
- All 14 dashboard pages fetch real data from NeDB via `queries.ts`
- All pages have empty states (conditional rendering when data.length === 0)
- Auth-guarded (redirect to /login if unauthenticated or wrong role)
- `mock-data.ts` deleted
- Seed data populates on first dashboard visit
