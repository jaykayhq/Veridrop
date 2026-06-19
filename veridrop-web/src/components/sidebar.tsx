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
        "flex flex-col h-full bg-sidebar shadow-md transition-all duration-300 overflow-hidden",
        collapsed && !hovered ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
      style={{ width: collapsed && !hovered ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 px-4 shrink-0",
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
                        ? "bg-brand-teal-light/10 text-brand-teal-light"
                        : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                    )}
                    title={link.label}
                  >
                    <span className={cn(
                      "shrink-0",
                      active ? "text-brand-teal-light" : "text-text-muted group-hover:text-text-primary transition-colors"
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
        "py-3 px-3 flex items-center gap-3 shrink-0",
        collapsed && !hovered ? "justify-center" : ""
      )}>
        <div className="h-8 w-8 rounded-full bg-brand-teal-light/20 flex items-center justify-center text-brand-teal-light text-xs font-bold shrink-0 border border-brand-teal-light/20">
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
        className="flex items-center justify-center h-10 text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shrink-0"
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
