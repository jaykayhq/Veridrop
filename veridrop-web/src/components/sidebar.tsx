"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/Logo";

const Icons = {
  overview: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  storefront: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  ),
  balance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  inspectors: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  dispatch: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  transactions: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  disputes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  approvals: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  copy: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
};

interface NavLinkDef {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  links: NavLinkDef[];
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
      { href: "/vendor/analytics", label: "Analytics", icon: Icons.analytics },
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
  const [copied, setCopied] = useState(false);
  const [indicatorPos, setIndicatorPos] = useState<{ top: number; height: number } | null>(null);
  const linkRefs = useRef<Map<string, HTMLElement>>(new Map());
  const sidebarRef = useRef<HTMLElement>(null);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  // Find the active link indicator position
  useEffect(() => {
    for (const group of groups) {
      for (const link of group.links) {
        if (isActive(link.href)) {
          const el = linkRefs.current.get(link.href);
          if (el) {
            const parent = el.parentElement;
            if (parent) {
              const rect = parent.getBoundingClientRect();
              const sidebarRect = sidebarRef.current?.getBoundingClientRect();
              if (sidebarRect) {
                setIndicatorPos({
                  top: rect.top - sidebarRect.top,
                  height: rect.height,
                });
              }
            }
          }
          break;
        }
      }
    }
  }, [pathname, groups, isActive]);

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

  const copyStoreLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + `/s/${role === "admin" ? "" : "store-link"}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const sidebarContent = (
    <nav
      ref={sidebarRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-col h-full relative transition-all duration-300 overflow-hidden",
        collapsed && !hovered ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
      style={{
        width: collapsed && !hovered ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        background: "linear-gradient(180deg, rgba(13,13,13,0.98) 0%, rgba(10,10,10,0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      {/* Gradient border on the right edge */}
      <div className="absolute right-0 top-0 bottom-12 w-px bg-gradient-to-b from-transparent via-[#00bda6]/20 to-transparent pointer-events-none" />

      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 px-4 shrink-0 relative",
          collapsed && !hovered ? "justify-center px-0" : "gap-3"
        )}
      >
        <Link href={`/${role}`} className="flex items-center gap-3 shrink-0 group">
          <div className="relative shrink-0">
            <LogoIcon size={28} />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#00bda6]/20 to-[#0a54a6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </div>
          <span
            className={cn(
              "logo-wordmark text-lg whitespace-nowrap overflow-hidden transition-all duration-300",
              collapsed && !hovered ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <span className="text-[#0a54a6]">Veri</span>
            <span className="text-[#00bda6]">drop</span>
          </span>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 relative">
        {/* Active Indicator */}
        {indicatorPos && (
          <div
            className="absolute left-2 w-0.5 rounded-full bg-gradient-to-b from-[#00bda6] to-[#0a54a6] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_8px_rgba(0,189,166,0.5)]"
            style={{
              top: indicatorPos.top + 6,
              height: indicatorPos.height - 12,
            }}
          />
        )}

        {groups.map((group) => (
          <div key={group.label}>
            <div
              className={cn(
                "px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#666] transition-all duration-300",
                collapsed && !hovered ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
              )}
            >
              {group.label}
            </div>

            <div className="space-y-0.5">
              {group.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <div key={link.href} className="relative">
                    <Link
                      ref={(el) => {
                        if (el) linkRefs.current.set(link.href, el);
                      }}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        collapsed && !hovered ? "justify-center px-0" : "",
                        active
                          ? "text-[#00bda6]"
                          : "text-[#666] hover:text-[#e8e8e8] hover:bg-[rgba(255,255,255,0.03)]"
                      )}
                      title={link.label}
                    >
                      {/* Active background glow */}
                      {active && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00bda6]/8 to-transparent" />
                      )}

                      {/* Active dot */}
                      {active && (
                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00bda6] shadow-[0_0_6px_rgba(0,189,166,0.6)]" />
                      )}

                      <span
                        className={cn(
                          "shrink-0 relative z-10 transition-all duration-200",
                          active
                            ? "text-[#00bda6]"
                            : "text-[#666] group-hover:text-[#e8e8e8]",
                          active && "scale-110"
                        )}
                      >
                        {link.icon}
                      </span>
                      <span
                        className={cn(
                          "whitespace-nowrap overflow-hidden transition-all duration-300 relative z-10",
                          collapsed && !hovered ? "w-0 opacity-0" : "w-auto opacity-100"
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Store Link Quick Copy */}
      <div
        className={cn(
          "px-3 py-2 transition-all duration-300",
          collapsed && !hovered ? "h-0 opacity-0 overflow-hidden px-0" : "h-auto opacity-100"
        )}
      >
        <button
          onClick={copyStoreLink}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[10px] font-medium text-[#666] hover:text-[#00bda6] hover:bg-[rgba(0,189,166,0.06)] transition-all group"
        >
          <span className="shrink-0 group-hover:scale-110 transition-transform">
            {Icons.copy}
          </span>
          <span className="truncate">
            {copied ? "Link copied!" : "Copy store link"}
          </span>
        </button>
      </div>

      {/* User Section */}
      <div
        className={cn(
          "py-3 px-3 flex items-center gap-3 shrink-0 border-t border-[rgba(255,255,255,0.03)]",
          collapsed && !hovered ? "justify-center" : ""
        )}
      >
        <div className="relative shrink-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00bda6]/20 to-[#0a54a6]/20 flex items-center justify-center text-[#00bda6] text-xs font-bold border border-[#00bda6]/20">
            {role === "admin" ? "A" : "V"}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]">
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
          </div>
        </div>
        <div
          className={cn(
            "flex-1 min-w-0 transition-all duration-300",
            collapsed && !hovered ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          )}
        >
          <div className="text-sm font-medium text-[#e8e8e8] truncate">
            {role === "admin" ? "Admin User" : "Vendor Name"}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#00bda6] font-semibold flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#00bda6]" />
            {role === "admin" ? "Admin" : "Vendor"}
            <span className="text-[#666]">· Online</span>
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-9 text-[#666] hover:text-[#e8e8e8] hover:bg-[rgba(255,255,255,0.03)] transition-all shrink-0 relative group"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span className="group-hover:scale-110 transition-transform duration-200">
          {collapsed ? Icons.chevronRight : Icons.chevronLeft}
        </span>
      </button>
    </nav>
  );

  /* Mobile overlay */
  if (onMobileOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onMobileClose}
        />
        <div className="fixed inset-y-0 left-0 z-50 md:hidden">
          <div className="h-full shadow-2xl">{sidebarContent}</div>
        </div>
      </>
    );
  }

  return sidebarContent;
}
