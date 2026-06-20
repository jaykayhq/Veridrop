/* eslint-disable */
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { seedDatabase } from "@/lib/api/seed";

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
    seedDatabase();
    setMounted(true);
    const stored = localStorage.getItem("veridrop-sidebar-collapsed");
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("veridrop-sidebar-collapsed", String(collapsed));
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
        className={cn(
          "flex-1 flex flex-col relative z-10 transition-all duration-300",
          collapsed ? "md:ml-[var(--sidebar-collapsed-width)]" : "md:ml-[var(--sidebar-width)]"
        )}
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

