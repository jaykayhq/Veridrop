import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import CartContent from "./cart-content";

export default async function CartPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-xl font-semibold mb-6">Shopping Cart</h1>
        <CartContent storeId={storeId} />
      </div>
    </div>
  );
}
