"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoIcon } from "@/components/Logo";

const Icons = {
  overview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  orders: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  products: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
  storefront: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>,
  balance: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  inspectors: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  dispatch: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  transactions: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  disputes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  approvals: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
};

const vendorLinks = [
  { href: "/vendor", label: "Overview", icon: Icons.overview },
  { href: "/vendor/orders", label: "Orders", icon: Icons.orders },
  { href: "/vendor/products", label: "Products", icon: Icons.products },
  { href: "/vendor/store", label: "Storefront", icon: Icons.storefront },
  { href: "/vendor/balance", label: "Balance", icon: Icons.balance },
  { href: "/vendor/inspectors", label: "Inspectors", icon: Icons.inspectors },
  { href: "/vendor/dispatch", label: "Dispatch", icon: Icons.dispatch },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: Icons.overview },
  { href: "/admin/users", label: "Users", icon: Icons.users },
  { href: "/admin/transactions", label: "Transactions", icon: Icons.transactions },
  { href: "/admin/disputes", label: "Disputes", icon: Icons.disputes },
  { href: "/admin/approvals", label: "Approvals", icon: Icons.approvals },
  { href: "/admin/stores", label: "Stores", icon: Icons.storefront },
  { href: "/admin/dispatch", label: "Dispatch", icon: Icons.dispatch },
];

export function Navbar({ role }: { role: "vendor" | "admin" }) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : vendorLinks;

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-center pointer-events-none">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto glass pointer-events-auto px-4 py-2 rounded-full border border-white/10 shadow-lg dark:shadow-black/50">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link href={`/${role}`} className="flex items-center gap-2">
            <LogoIcon size={24} />
            <div className="logo-wordmark leading-none hidden md:block text-lg">
              <span className="text-[#0a54a6] dark:text-[#0a54a6]">Veri</span>
              <span className="text-[#00bda6]">drop</span>
            </div>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 hidden md:block mx-2"></div>
          <span className="text-[10px] text-brand-muted uppercase tracking-widest font-semibold hidden md:block">
            {role === "admin" ? "Admin" : "Vendor"}
          </span>
        </div>

        {/* Navigation Pills */}
        <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar mx-4">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-[#00bda6]/10 text-[#00bda6] shadow-[inset_0_0_0_1px_rgba(0,189,166,0.2)]"
                    : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                )}
              >
                <span className={cn("transition-colors", active ? "text-[#00bda6]" : "text-brand-muted")}>
                  {link.icon}
                </span>
                <span className="hidden lg:block">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile & Theme */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-brand-text text-xs border border-white/10 font-bold shadow-sm">
            {role === "admin" ? "A" : "V"}
          </div>
        </div>
      </div>
    </header>
  );
}
