# Veridrop Dashboard UI/UX Redesign

**Date:** 2026-06-18
**Status:** Approved Design
**Author:** Superpowers

## Overview

Refactor Veridrop's web dashboard from a horizontal pill navbar to a collapsible sidebar layout, and replace the hardcoded hex color system with semantic CSS custom properties for clean dark/light mode support.

## Motivation

- **Navigation scalability:** Current horizontal navbar breaks with >7 items. Dashboard sections will grow (riders, analytics, settings).
- **Industry pattern:** Every major SaaS dashboard (Stripe, Linear, Vercel, Notion) uses sidebar navigation. Research confirms sidebar is the 2026 standard for apps with 15-40 sections.
- **Design system debt:** Light mode uses 80+ lines of `!important` overrides for hardcoded hex colors. This is brittle and unmaintainable.
- **Trust commerce UX:** Fintech users expect calm, data-dense interfaces. A sidebar frees horizontal space for content.

## Design System Refactor

### CSS Custom Properties

All colors become semantic CSS variables on `:root`. Light mode overrides ONLY the variable values — zero `!important`.

| Variable | Dark Value | Light Value |
|----------|-----------|-------------|
| `--bg-app` | `#0a0a0a` | `#f2f7fb` |
| `--bg-surface` | `#111111` | `#ffffff` |
| `--bg-surface-hover` | `#1a1a1a` | `#f8fafc` |
| `--bg-surface-raised` | `#1a1a1a` | `#ffffff` |
| `--bg-card` | `#111111` | `#ffffff` |
| `--bg-card-hover` | `#1a1a1a` | `#f8fafc` |
| `--bg-input` | `#0d0d0d` | `#ffffff` |
| `--bg-sidebar` | `#0d0d0d` | `#f8f9fa` |
| `--bg-topbar` | `rgba(13,13,13,0.7)` | `rgba(255,255,255,0.8)` |
| `--border-default` | `#1a1a1a` | `#e2e8f0` |
| `--border-subtle` | `#2a2a2a` | `#cbd5e1` |
| `--border-hover` | `#444444` | `#94a3b8` |
| `--text-primary` | `#e8e8e8` | `#0f172a` |
| `--text-secondary` | `#a0a0a0` | `#334155` |
| `--text-muted` | `#666666` | `#64748b` |
| `--text-inverse` | `#0f172a` | `#e8e8e8` |

### Tailwind v4 `@theme inline` Mapping

Map variables to Tailwind utility classes:
```css
@theme inline {
  --color-surface: var(--bg-surface);
  --color-card: var(--bg-card);
  --color-sidebar: var(--bg-sidebar);
  --color-topbar: var(--bg-topbar);
  --color-primary: var(--text-primary);
  --color-secondary: var(--text-secondary);
  --color-muted: var(--text-muted);
  --color-border: var(--border-default);
  --color-border-subtle: var(--border-subtle);
}
```

### Light Mode

Single `.light` class on `<html>` overrides variable values. No attribute selectors on hardcoded hex values. Remove all 80+ lines of `html.light [class*="bg-[#111]"]` hacks.

### Removal

Delete the entire `/* ─── Light Theme Overrides ─── */` section (lines 447-554 in current globals.css).

## New Components

### `src/components/sidebar.tsx`

**Props:** `role: "vendor" | "admin"`, `collapsed: boolean`, `onToggle: () => void`

**States:**
- **Expanded (240px):** Full icon + label, group section labels visible, user avatar + name at bottom
- **Collapsed (64px):** Icon only centered, labels hidden, user avatar only
- **Hover-expand:** When collapsed, hovering temporarily expands to 240px (CSS + mouse events)
- **Mobile (<768px):** Overlay drawer with backdrop blur, toggled by hamburger in top bar

**Navigation Groups:**
- **Main:** Overview, Orders, Products, Storefront, Balance
- **Operations:** Inspectors, Dispatch (vendor) | Users, Transactions, Disputes, Approvals, Stores, Dispatch (admin)

**Active state:** Teal pill highlight with subtle background. Inactive: muted with hover.

**Persistence:** Collapse state stored in localStorage.

### `src/components/topbar.tsx`

Thin (~48px) horizontal bar at top of content area.

- **Left:** Hamburger button (toggles sidebar), page title / breadcrumb
- **Right:** Notification bell icon, ThemeToggle, user avatar with dropdown
- **Position:** Fixed at top, offset by sidebar width (CSS transition on `left`)
- **Background:** Glass blur using `--bg-topbar`
- **Hidden on mobile** sidebar overlay

### `src/app/(dashboard)/layout.tsx` Updates

Change from vertical stack to horizontal split:
```
[Sidebar (fixed left)] [Top Bar + Main Content (offset)]
```

Main content area uses `margin-left: var(--sidebar-width)` with CSS transition.

## Page Color Refactoring

### Class Mapping

| Old Hardcoded Class | New Semantic Class |
|---|---|
| `bg-[#111]` | `bg-surface` |
| `bg-[#0d0d0d]` | `bg-input` |
| `border-[#1a1a1a]` | `border-default` |
| `border-[#2a2a2a]` | `border-subtle` |
| `text-[#e8e8e8]` | `text-primary` |
| `text-[#666]` | `text-muted` |
| `text-[#aaa]` | `text-secondary` |
| `text-[#00bda6]` | `text-teal-light` |
| `bg-[#00bda6]/10` | `bg-teal/10` |
| `shadow-[inset_0_0_0_1px_rgba(0,189,166,0.2)]` | `shadow-inset-teal` (utility class) |

### Files to Update

- `src/app/(dashboard)/vendor/page.tsx`
- `src/app/(dashboard)/vendor/orders/page.tsx`
- `src/app/(dashboard)/vendor/products/page.tsx`
- `src/app/(dashboard)/vendor/store/page.tsx`
- `src/app/(dashboard)/vendor/balance/page.tsx`
- `src/app/(dashboard)/vendor/inspectors/page.tsx`
- `src/app/(dashboard)/vendor/dispatch/page.tsx`
- `src/app/(dashboard)/admin/page.tsx`
- `src/app/(dashboard)/admin/users/page.tsx`
- `src/app/(dashboard)/admin/transactions/page.tsx`
- `src/app/(dashboard)/admin/disputes/page.tsx`
- `src/app/(dashboard)/admin/approvals/page.tsx`
- `src/app/(dashboard)/admin/stores/page.tsx`
- `src/app/(dashboard)/admin/dispatch/page.tsx`

No functional changes — only className replacements.

## File Changes Summary

| Action | File |
|--------|------|
| Rewrite | `src/app/globals.css` (CSS variables, remove light mode hacks) |
| Rewrite | `src/app/(dashboard)/layout.tsx` (sidebar + topbar layout) |
| Create | `src/components/sidebar.tsx` |
| Create | `src/components/topbar.tsx` |
| Keep (move | `src/components/navbar.tsx` repurposed; logic absorbed into sidebar |
| 15× edit | All dashboard page files (className replacements) |

## Verification

1. Run `npm run build` — no errors
2. Manual check: dashboard renders correctly in dark mode (default)
3. Toggle to light mode — all surfaces, text, borders readable
4. Collapse sidebar — icons only, smooth transition
5. Expand sidebar — full labels, sections
6. Hover-expand when collapsed — temporary expansion
7. Mobile viewport — sidebar hidden, overlay works
8. Navigate to each dashboard page — active state correct, content renders

## Scope

**In scope:** Sidebar navigation, top bar, layout restructure, CSS variable refactor, light mode cleanup, page color updates.

**Out of scope:** New pages, functional changes, API routes, backend, mobile Flutter apps, landing page redesign.
