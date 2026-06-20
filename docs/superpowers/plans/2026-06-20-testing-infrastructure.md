# Testing Infrastructure Setup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Vitest + React Testing Library, configure for Next.js 16 (App Router), write smoke tests for existing components and pages.

**Architecture:** Vitest with `@vitejs/plugin-react`, `jsdom` environment for DOM tests, `@testing-library/react` for component tests. Config extends Next.js tsconfig paths. First tests cover utility functions, shared components, and a representative dashboard page.

**Tech Stack:** Vitest v3+, React Testing Library v16+, jsdom, Next.js 16, React 19, TypeScript 5

**Verification:** `cd veridrop-web && npx vitest run`

---

## File Inventory

| Action | File | Purpose |
|--------|------|---------|
| Install | — | `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@types/jsdom` |
| Create | `vitest.config.ts` | Vitest configuration aligned with Next.js |
| Create | `src/lib/__tests__/utils.test.ts` | Tests for `cn()`, `formatCurrency()`, `formatDate()`, `statusColor()`, `generateStoreUrl()` |
| Create | `src/components/__tests__/StatusBadge.test.tsx` | Tests for StatusBadge component |
| Create | `src/components/__tests__/StatCard.test.tsx` | Tests for StatCard component |
| Create | `src/components/__tests__/ThemeToggle.test.tsx` | Tests for ThemeToggle |

---

### Task 1: Install Dependencies + Create Config

- [ ] **Step 1: Install Vitest and testing packages**

Run from `veridrop-web`:

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @types/jsdom
```

Expected: Installed successfully.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

- [ ] **Step 3: Create `src/test-setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test script to `package.json`**

Edit `package.json` scripts section. Replace:

```json
"lint": "eslint"
```

With:

```json
"lint": "eslint",
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify Vitest runs**

Run: `cd veridrop-web && npx vitest run`
Expected: No test files found — exits cleanly (0 tests, 0 failures).

---

### Task 2: Test Utility Functions

- [ ] **Step 1: Write tests for utils**

Create `src/lib/__tests__/utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, statusColor, generateStoreUrl } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats in Naira", () => {
    const result = formatCurrency(1500);
    expect(result).toContain("₦");
    expect(result).toContain("1");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toContain("₦");
  });

  it("handles large numbers", () => {
    const result = formatCurrency(1_500_000);
    expect(result).toContain("₦");
  });
});

describe("formatDate", () => {
  it("formats ISO date string", () => {
    const result = formatDate("2026-06-19T10:00:00.000Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("returns empty string for null", () => {
    expect(formatDate(null as unknown as string)).toBe("");
  });
});

describe("statusColor", () => {
  it("returns warning for pending", () => {
    expect(statusColor("pending")).toBe("warning");
  });

  it("returns success for delivered", () => {
    expect(statusColor("delivered")).toBe("success");
  });

  it("returns danger for disputed", () => {
    expect(statusColor("disputed")).toBe("danger");
  });

  it("returns default for unknown status", () => {
    expect(statusColor("unknown_status")).toBe("default");
  });
});

describe("generateStoreUrl", () => {
  it("generates URL from slug", () => {
    const result = generateStoreUrl("gadgethub-ng");
    expect(result).toContain("/s/gadgethub-ng");
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd veridrop-web && npx vitest run src/lib/__tests__/utils.test.ts`
Expected: All 12+ tests pass.

---

### Task 3: Test StatusBadge Component

- [ ] **Step 1: Read the component**

Read `src/components/status-badge.tsx` to understand props and rendering.

- [ ] **Step 2: Write tests**

Create `src/components/__tests__/StatusBadge.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../status-badge";

describe("StatusBadge", () => {
  it("renders pending status", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("renders delivered status", () => {
    render(<StatusBadge status="delivered" />);
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });

  it("renders disputed status", () => {
    render(<StatusBadge status="disputed" />);
    expect(screen.getByText("disputed")).toBeInTheDocument();
  });

  it("applies correct color class for status", () => {
    const { container } = render(<StatusBadge status="delivered" />);
    expect(container.firstChild).toHaveClass("bg-emerald");
  });
});
```

- [ ] **Step 3: Run tests**

Run: `cd veridrop-web && npx vitest run src/components/__tests__/StatusBadge.test.tsx`
Expected: All tests pass.

---

### Task 4: Test StatCard Component

- [ ] **Step 1: Read the component**

Read `src/components/stat-card.tsx` to understand props.

- [ ] **Step 2: Write tests**

Create `src/components/__tests__/StatCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Active Orders" value="18" />);
    expect(screen.getByText("Active Orders")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("renders change text", () => {
    render(<StatCard label="Revenue" value="₦1M" change="+12%" changeType="up" />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(<StatCard label="Orders" value="5" icon="📦" />);
    expect(screen.getByText("📦")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests**

Run: `cd veridrop-web && npx vitest run src/components/__tests__/StatCard.test.tsx`
Expected: All tests pass.

---

### Task 5: Test ThemeToggle Component

- [ ] **Step 1: Read the component**

Read `src/components/ThemeToggle.tsx` to understand behavior.

- [ ] **Step 2: Write tests**

Create `src/components/__tests__/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";

describe("ThemeToggle", () => {
  it("renders a button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests**

Run: `cd veridrop-web && npx vitest run src/components/__tests__/ThemeToggle.test.tsx`
Expected: Tests pass (button exists).

---

### Task 6: Add test:ci Script + Final Verification

- [ ] **Step 1: Add CI script**

In `package.json`, add to scripts:

```json
"test:ci": "vitest run --reporter=verbose"
```

- [ ] **Step 2: Full test suite run**

Run: `cd veridrop-web && npx vitest run`
Expected: All test files found and passing.

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build, no regressions.
