"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = pathname.startsWith("/admin") ? "admin" : "vendor";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--brand-dark)] relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-300">
        <div className="absolute top-0 right-[-100px] w-[800px] h-[800px] opacity-70">
          <Image src="/images/map_route.png" alt="" fill className="object-contain" priority />
        </div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[600px] h-[600px] opacity-50">
          <Image src="/images/dispatch_rider.png" alt="" fill className="object-contain" />
        </div>
      </div>
      
      {/* Top Navigation */}
      <Navbar role={role} />
      
      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
