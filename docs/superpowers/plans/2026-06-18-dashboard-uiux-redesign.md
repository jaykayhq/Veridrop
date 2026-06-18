# Dashboard UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace horizontal pill navbar with collapsible sidebar + minimal top bar, refactor design system to CSS variables for clean dark/light mode.

**Architecture:** Semantic CSS variables on `:root` with `.light` class override (zero `!important`). Sidebar manages its own collapse state with localStorage persistence. Dashboard layout orchestrates sidebar + topbar + content. All 15 dashboard pages get className replacements.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, TypeScript

**No test framework installed** — verification will be visual + `npm run build`.

---

## File Inventory

| Action | File |
|--------|------|
| Rewrite | `src/app/globals.css` |
| Create | `src/components/sidebar.tsx` |
| Create | `src/components/topbar.tsx` |
| Rewrite | `src/app/(dashboard)/layout.tsx` |
| Edit | `src/app/(dashboard)/vendor/page.tsx` |
| Edit | `src/app/(dashboard)/vendor/orders/page.tsx` |
| Edit | `src/app/(dashboard)/vendor/products/page.tsx` |
| Edit | `src/app/(dashboard)/vendor/store/page.tsx` |
| Edit | `src/app/(dashboard)/vendor/balance/page.tsx` |
| Edit | `src/app/(dashboard)/vendor/inspectors/page.tsx` |
| Edit | `src/app/(dashboard)/vendor/dispatch/page.tsx` |
| Edit | `src/app/(dashboard)/admin/page.tsx` |
| Edit | `src/app/(dashboard)/admin/users/page.tsx` |
| Edit | `src/app/(dashboard)/admin/transactions/page.tsx` |
| Edit | `src/app/(dashboard)/admin/disputes/page.tsx` |
| Edit | `src/app/(dashboard)/admin/approvals/page.tsx` |
| Edit | `src/app/(dashboard)/admin/stores/page.tsx` |
| Edit | `src/app/(dashboard)/admin/dispatch/page.tsx` |
| Remove | `src/components/navbar.tsx` |
| Keep | `src/components/ThemeToggle.tsx` (no changes) |
| Keep | `src/components/Logo.tsx` (imported by sidebar) |
| Keep | `src/components/stat-card.tsx` (no changes) |
| Keep | `src/components/status-badge.tsx` (no changes) |
| Keep | `src/components/data-table.tsx` (no changes) |
| Keep | `src/lib/theme/ThemeProvider.tsx` (no changes) |
| Keep | `src/app/layout.tsx` (no changes) |

---

### Task 1: Refactor globals.css with Semantic CSS Variables

**Files:**
- Rewrite: `src/app/globals.css`

**Changes:**
- Add semantic surface/text/border CSS variables to `:root`
- Replace `@theme inline` color values to reference the variables
- Remove entire light mode override section (lines 447-554)
- Add `.light` class that overrides only variable values
- Add transition property for smooth mode switching

- [ ] **Replace `:root` block (lines 9-85) with semantic variable set:**

Open `src/app/globals.css` and replace lines 9-85:

```css
:root {
  /* ─── Semantic Surface Colors ─── */
  --bg-app: #0a0a0a;
  --bg-surface: #111111;
  --bg-surface-hover: #1a1a1a;
  --bg-surface-raised: #1a1a1a;
  --bg-card: #111111;
  --bg-card-hover: #1a1a1a;
  --bg-input: #0d0d0d;
  --bg-sidebar: #0d0d0d;
  --bg-topbar: rgba(13, 13, 13, 0.7);

  /* ─── Semantic Border Colors ─── */
  --border-default: #1a1a1a;
  --border-subtle: #2a2a2a;
  --border-hover: #444444;

  /* ─── Semantic Text Colors ─── */
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
  --text-inverse: #0f172a;

  /* ─── Brand Colors ─── */
  --brand-teal: #089b8a;
  --brand-teal-light: #00bda6;
  --brand-teal-muted: #00bda622;
  --brand-blue: #0a54a6;
  --brand-blue-muted: #0a54a622;
  --brand-gold: #c8a862;
  --brand-gold-muted: #c8a86222;
  --brand-danger: #dc2626;
  --brand-warning: #d97706;
  --brand-success: #00bda6;

  /* ─── Spacing Scale ─── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* ─── Border Radius Scale ─── */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-xxl: 24px;

  /* ─── Shadows ─── */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3);
  --shadow-brand: 0 0 30px -10px rgba(0, 189, 166, 0.4);
  --shadow-brand-subtle: 0 0 20px -8px rgba(0, 189, 166, 0.15);
  --shadow-gold: 0 0 30px -10px rgba(200, 168, 98, 0.3);

  /* ─── Transitions ─── */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-emphatic: cubic-bezier(0.2, 0, 0, 1);
  --transition-fast: 150ms var(--ease-standard);
  --transition-normal: 200ms var(--ease-standard);
  --transition-slow: 300ms var(--ease-standard);
  --transition-spring: 400ms var(--ease-spring);

  /* ─── Gradients ─── */
  --gradient-brand: linear-gradient(135deg, #0a54a6 0%, #00bda6 100%);
  --gradient-brand-reverse: linear-gradient(135deg, #00bda6 0%, #0a54a6 100%);
  --gradient-brand-subtle: linear-gradient(135deg, #00bda622 0%, #0a54a611 100%);
  --gradient-gold: linear-gradient(135deg, #c8a862 0%, #e8c872 100%);
  --gradient-text: linear-gradient(135deg, #00bda6 0%, #0a54a6 50%, #00bda6 100%);
  --gradient-gold-text: linear-gradient(135deg, #c8a862 0%, #e8c872 100%);
  --gradient-hero-mesh: radial-gradient(ellipse 80% 50% at 50% -20%, #00bda61a 0%, transparent 70%),
                        radial-gradient(ellipse 60% 40% at 80% 100%, #0a54a61a 0%, transparent 60%);
  --gradient-surface: linear-gradient(180deg, #111111 0%, #0a0a0a 100%);
  --gradient-card-hover: linear-gradient(135deg, #00bda608 0%, transparent 100%);

  /* ─── Mesh Gradient Pattern ─── */
  --mesh-dot: radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 100%);

  /* ─── Sidebar ─── */
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --topbar-height: 48px;

  /* ─── Theme transition ─── */
  --theme-transition: background-color 300ms var(--ease-standard),
                      color 300ms var(--ease-standard),
                      border-color 300ms var(--ease-standard),
                      box-shadow 300ms var(--ease-standard);
}

/* ─── Light Theme ─── */
.light {
  --bg-app: #f2f7fb;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f8fafc;
  --bg-surface-raised: #ffffff;
  --bg-card: #ffffff;
  --bg-card-hover: #f8fafc;
  --bg-input: #ffffff;
  --bg-sidebar: #f8f9fa;
  --bg-topbar: rgba(255, 255, 255, 0.8);

  --border-default: #e2e8f0;
  --border-subtle: #cbd5e1;
  --border-hover: #94a3b8;

  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --text-inverse: #e8e8e8;

  --shadow-xs: 0 1px 2px 0 rgb(10 84 166 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(10 84 166 / 0.08), 0 1px 2px -1px rgb(10 84 166 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(10 84 166 / 0.08), 0 2px 4px -2px rgb(10 84 166 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(10 84 166 / 0.08), 0 4px 6px -4px rgb(10 84 166 / 0.05);
  --shadow-xl: 0 20px 25px -5px rgb(10 84 166 / 0.08), 0 8px 10px -6px rgb(10 84 166 / 0.05);
  --shadow-brand-subtle: 0 0 30px -5px rgba(0, 189, 166, 0.2);
}
```

- [ ] **Replace `@theme inline` block (lines 87-105) to reference semantic variables:**

```css
@theme inline {
  --color-app: var(--bg-app);
  --color-surface: var(--bg-surface);
  --color-surface-hover: var(--bg-surface-hover);
  --color-surface-raised: var(--bg-surface-raised);
  --color-card: var(--bg-card);
  --color-card-hover: var(--bg-card-hover);
  --color-input: var(--bg-input);
  --color-sidebar: var(--bg-sidebar);
  --color-topbar: var(--bg-topbar);
  --color-border: var(--border-default);
  --color-border-subtle: var(--border-subtle);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-inverse: var(--text-inverse);
  --color-brand-teal: #089b8a;
  --color-brand-teal-light: #00bda6;
  --color-brand-blue: #0a54a6;
  --color-brand-gold: #c8a862;
  --color-danger: #dc2626;
  --color-warning: #d97706;
  --color-success: #00bda6;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

- [ ] **Update `body` background/color to use variables:**

Replace line 119 `background: var(--brand-dark);` with `background: var(--bg-app);`
Replace line 120 `color: var(--brand-text);` with `color: var(--text-primary);`

- [ ] **Remove the entire light mode override section (lines 447-554):**

Delete from line 447 (`/* ─── Light Theme Overrides ─── */`) through line 554 (end of file).

- [ ] **Add transition to `body` for smooth theme switching:**

```css
body {
  background: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-sans), Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  transition: var(--theme-transition);
}
```

- [ ] **Add theme transition to `.card` class:**

Update the `.card` base to include `transition: all var(--transition-normal), var(--theme-transition);`

- [ ] **Run build to verify no errors:**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Commit:**

```bash
git add src/app/globals.css
git commit -m "refactor: replace hardcoded hex colors with semantic CSS variables"
```

---

### Task 2: Create Sidebar Component

**Files:**
- Create: `src/components/sidebar.tsx`

This is the core navigation component. It renders a fixed left sidebar with logo, grouped nav links, and user section. Collapsible from 240px to 64px with hover-expand behavior.

- [ ] **Create `src/components/sidebar.tsx`:**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/Logo";

const Icons = {
  overview: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  products: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
  storefront: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>,
  balance: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  inspectors: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  dispatch: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  transactions: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  disputes: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  approvals: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  chevronLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
  chevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
};

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

const vendorGroups: NavGroup[] = [
  {
    label: "Main",
    links: [
      { href: "/vendor", label: "Overview", icon: Icons.overview },
      { href: "/vendor/orders", label: "Orders", icon: Icons.orders },
      { href: "/vendor/products", label: "Products", icon: Icons.products },
      { href: "/vendor/store", label: "Storefront", icon: Icons.storefront },
      { href: "/vendor/balance", label: "Balance", icon: Icons.balance },
    ],
  },
  {
    label: "Operations",
    links: [
      { href: "/vendor/inspectors", label: "Inspectors", icon: Icons.inspectors },
      { href: "/vendor/dispatch", label: "Dispatch", icon: Icons.dispatch },
    ],
  },
];

const adminGroups: NavGroup[] = [
  {
    label: "Main",
    links: [
      { href: "/admin", label: "Overview", icon: Icons.overview },
      { href: "/admin/users", label: "Users", icon: Icons.users },
      { href: "/admin/transactions", label: "Transactions", icon: Icons.transactions },
      { href: "/admin/disputes", label: "Disputes", icon: Icons.disputes },
    ],
  },
  {
    label: "Operations",
    links: [
      { href: "/admin/approvals", label: "Approvals", icon: Icons.approvals },
      { href: "/admin/stores", label: "Stores", icon: Icons.storefront },
      { href: "/admin/dispatch", label: "Dispatch", icon: Icons.dispatch },
    ],
  },
];

interface SidebarProps {
  role: "vendor" | "admin";
  collapsed: boolean;
  onToggle: () => void;
  onMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ role, collapsed, onToggle, onMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const groups = role === "admin" ? adminGroups : vendorGroups;
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const isExpanded = !collapsed || hovered;
  const effectiveWidth = isExpanded ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)";

  const isActive = useCallback((href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (onMobileOpen && onMobileClose && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onMobileClose();
      }
    }
    if (onMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [onMobileOpen, onMobileClose]);

  const sidebarContent = (
    <nav
      ref={sidebarRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-default transition-all duration-300 overflow-hidden",
        collapsed && !hovered ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
      style={{ width: collapsed && !hovered ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 px-4 border-b border-default shrink-0",
        collapsed && !hovered ? "justify-center px-0" : "gap-3"
      )}>
        <Link href={`/${role}`} className="flex items-center gap-3 shrink-0">
          <LogoIcon size={28} />
          <span className={cn(
            "logo-wordmark text-lg whitespace-nowrap overflow-hidden transition-all duration-300",
            collapsed && !hovered ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <span className="text-[#0a54a6]">Veri</span><span className="text-[#00bda6]">drop</span>
          </span>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            {/* Group Label */}
            <div className={cn(
              "px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted transition-all duration-300",
              collapsed && !hovered ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
            )}>
              {group.label}
            </div>

            {/* Links */}
            <div className="space-y-1">
              {group.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                      collapsed && !hovered ? "justify-center px-0" : "",
                      active
                        ? "bg-teal-light/10 text-teal-light"
                        : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                    )}
                    title={link.label}
                  >
                    <span className={cn(
                      "shrink-0",
                      active ? "text-teal-light" : "text-text-muted group-hover:text-text-primary transition-colors"
                    )}>
                      {link.icon}
                    </span>
                    <span className={cn(
                      "whitespace-nowrap overflow-hidden transition-all duration-300",
                      collapsed && !hovered ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className={cn(
        "border-t border-default py-3 px-3 flex items-center gap-3 shrink-0",
        collapsed && !hovered ? "justify-center" : ""
      )}>
        <div className="h-8 w-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-teal-light text-xs font-bold shrink-0 border border-teal-light/20">
          {role === "admin" ? "A" : "V"}
        </div>
        <div className={cn(
          "flex-1 min-w-0 transition-all duration-300",
          collapsed && !hovered ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        )}>
          <div className="text-sm font-medium text-text-primary truncate">
            {role === "admin" ? "Admin User" : "Vendor Name"}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
            {role === "admin" ? "Admin" : "Vendor"}
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-default text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shrink-0"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? Icons.chevronRight : Icons.chevronLeft}
      </button>
    </nav>
  );

  /* Mobile overlay */
  if (onMobileOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
        <div className="fixed inset-y-0 left-0 z-50 md:hidden">
          <div className="h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return sidebarContent;
}
```

- [ ] **Commit:**

```bash
git add src/components/sidebar.tsx
git commit -m "feat: add collapsible sidebar component with nav groups"
```

---

### Task 3: Create TopBar Component

**Files:**
- Create: `src/components/topbar.tsx`

Minimal top bar with sidebar toggle, page title, notifications, theme toggle, and user avatar.

- [ ] **Create `src/components/topbar.tsx`:**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TopBarProps {
  collapsed: boolean;
  onSidebarToggle: () => void;
  onMobileMenuOpen: () => void;
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1) return "Overview";
  const last = segments[segments.length - 1];
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

export function TopBar({ collapsed, onSidebarToggle, onMobileMenuOpen }: TopBarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-[var(--topbar-height)] bg-topbar backdrop-blur-xl border-b border-default z-30",
        "transition-all duration-300 flex items-center justify-between px-4 md:px-6",
      )}
      style={{
        left: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          title="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onSidebarToggle}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {/* Page title */}
        <h1 className="text-sm font-semibold text-text-primary hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          className="h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors relative"
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <ThemeToggle />
        <div className="h-7 w-7 rounded-full bg-brand-teal/20 flex items-center justify-center text-teal-light text-[10px] font-bold border border-teal-light/20">
          {pathname.startsWith("/admin") ? "A" : "V"}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/topbar.tsx
git commit -m "feat: add minimal top bar with sidebar toggle and theme switch"
```

---

### Task 4: Update Dashboard Layout

**Files:**
- Rewrite: `src/app/(dashboard)/layout.tsx`

The layout orchestrates sidebar + topbar + content area. Manages sidebar collapse state with localStorage persistence and mobile overlay state.

- [ ] **Rewrite `src/app/(dashboard)/layout.tsx`:**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = pathname.startsWith("/admin") ? "admin" : "vendor";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("veridrop-sidebar-collapsed");
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("veridrop-sidebar-collapsed", String(collapsed));
      document.documentElement.style.setProperty(
        "--sidebar-width",
        collapsed ? "var(--sidebar-collapsed-width)" : "240px"
      );
    }
  }, [collapsed, mounted]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-app">
        <div className="w-[var(--sidebar-width)]" />
        <div className="flex-1 flex flex-col">
          <div className="h-[var(--topbar-height)]" />
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-app relative overflow-hidden">
      {/* Background Images */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-300">
        <div className="absolute top-0 right-[-100px] w-[800px] h-[800px] opacity-70">
          <Image src="/images/map_route.png" alt="" fill className="object-contain" priority />
        </div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[600px] h-[600px] opacity-50">
          <Image src="/images/dispatch_rider.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:flex-col">
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggle={toggleCollapsed}
        />
      </div>

      {/* Sidebar - Mobile */}
      {mobileOpen && (
        <div className="md:hidden">
          <Sidebar
            role={role}
            collapsed={false}
            onToggle={() => {}}
            onMobileOpen={mobileOpen}
            onMobileClose={closeMobile}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col relative z-10 transition-all duration-300"
        style={{
          marginLeft: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        }}
      >
        <TopBar
          collapsed={collapsed}
          onSidebarToggle={toggleCollapsed}
          onMobileMenuOpen={openMobile}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 mt-[var(--topbar-height)]">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Run build to verify:**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Commit:**

```bash
git add "src/app/(dashboard)/layout.tsx"
git commit -m "feat: restructure dashboard layout with sidebar + topbar"
```

---

### Task 5: Update All Vendor Pages (className Replacement)

**Files:**
- Edit: `src/app/(dashboard)/vendor/page.tsx`
- Edit: `src/app/(dashboard)/vendor/orders/page.tsx`
- Edit: `src/app/(dashboard)/vendor/products/page.tsx`
- Edit: `src/app/(dashboard)/vendor/store/page.tsx`
- Edit: `src/app/(dashboard)/vendor/balance/page.tsx`
- Edit: `src/app/(dashboard)/vendor/inspectors/page.tsx`
- Edit: `src/app/(dashboard)/vendor/dispatch/page.tsx`

Each file gets the same className replacements as described below.

**Class mapping (apply to ALL vendor and admin pages):**

| Old | New |
|-----|-----|
| `bg-[#111]` | `bg-surface` |
| `border-[#1a1a1a]` | `border-default` |
| `text-[#e8e8e8]` | `text-text-primary` |
| `text-[#666]` | `text-text-muted` |
| `text-[#aaa]` | `text-text-secondary` |
| `text-[#00bda6]` | `text-teal-light` |
| `bg-[#00bda6]/10` | `bg-teal-light/10` |
| `hover:border-[#00bda6]/40` | `hover:border-teal-light/40` |
| `hover:bg-[#00bda6]/5` | `hover:bg-teal-light/5` |
| `border-[#1f1f1f]` | `border-default` |
| `hover:bg-[#111]` | `hover:bg-surface-hover` |
| `hover:text-[#e8e8e8]` | `hover:text-text-primary` |
| `hover:border-[#333]` | `hover:border-hover` |
| `bg-red-500` | `bg-danger` |
| `text-red-400` | `text-danger` |

- [ ] **Update `vendor/page.tsx`:**

Replace all hardcoded color classes with semantic equivalents.

- [ ] **Update `vendor/orders/page.tsx`:**

Same class replacements.

- [ ] **Update `vendor/products/page.tsx`:**

Same class replacements.

- [ ] **Update `vendor/store/page.tsx`:**

Same class replacements.

- [ ] **Update `vendor/balance/page.tsx`:**

Same class replacements.

- [ ] **Update `vendor/inspectors/page.tsx`:**

Same class replacements.

- [ ] **Update `vendor/dispatch/page.tsx`:**

Same class replacements.

- [ ] **Run build:**

```bash
npm run build
```
Expected: All vendor pages compile without errors.

- [ ] **Commit:**

```bash
git add "src/app/(dashboard)/vendor/"
git commit -m "refactor: replace hardcoded colors with semantic CSS classes in vendor pages"
```

---

### Task 6: Update All Admin Pages (className Replacement)

**Files:**
- Edit: `src/app/(dashboard)/admin/page.tsx`
- Edit: `src/app/(dashboard)/admin/users/page.tsx`
- Edit: `src/app/(dashboard)/admin/transactions/page.tsx`
- Edit: `src/app/(dashboard)/admin/disputes/page.tsx`
- Edit: `src/app/(dashboard)/admin/approvals/page.tsx`
- Edit: `src/app/(dashboard)/admin/stores/page.tsx`
- Edit: `src/app/(dashboard)/admin/dispatch/page.tsx`

Same class mapping as Task 5.

- [ ] **Update `admin/page.tsx`:**

Replace all hardcoded color classes.

- [ ] **Update `admin/users/page.tsx`:**

Same replacements.

- [ ] **Update `admin/transactions/page.tsx`:**

Same replacements.

- [ ] **Update `admin/disputes/page.tsx`:**

Same replacements.

- [ ] **Update `admin/approvals/page.tsx`:**

Same replacements.

- [ ] **Update `admin/stores/page.tsx`:**

Same replacements.

- [ ] **Update `admin/dispatch/page.tsx`:**

Same replacements.

- [ ] **Run build:**

```bash
npm run build
```
Expected: All admin pages compile without errors.

- [ ] **Commit:**

```bash
git add "src/app/(dashboard)/admin/"
git commit -m "refactor: replace hardcoded colors with semantic CSS classes in admin pages"
```

---

### Task 7: Cleanup — Remove Old Navbar

**Files:**
- Modify: `src/app/globals.css` (remove shadow-inset CSS if any referencing old header styles)
- Remove: `src/components/navbar.tsx`

- [ ] **Delete `src/components/navbar.tsx`:**

```bash
Remove-Item -LiteralPath "src/components/navbar.tsx"
```

- [ ] **Run build:**

```bash
npm run build
```
Expected: Build succeeds. No remaining references to `@/components/navbar` or `Navbar` outside of the import in the old layout (which was rewritten).

- [ ] **Commit:**

```bash
git add -A
git commit -m "cleanup: remove deprecated navbar component"
```

---

### Task 8: Final Verification

- [ ] **Full build:**

```bash
npm run build
```
Expected: Clean build with no errors or warnings.

- [ ] **Check for remaining hardcoded hex colors** in dashboard pages:

```bash
Get-ChildItem -Path "src/app/(dashboard)" -Recurse -Filter "*.tsx" | Select-String -Pattern 'bg-\[#|text-\[#|border-\[#'
```
Expected: No matches (or only intentional uses like gradient text).

- [ ] **Verify no `!important` light mode overrides remain:**

```bash
Select-String -Path "src/app/globals.css" -Pattern '!important'
```
Expected: No matches.

- [ ] **List changed files:**

```bash
git diff --stat
```

- [ ] **Final commit if any fixes were made.**
