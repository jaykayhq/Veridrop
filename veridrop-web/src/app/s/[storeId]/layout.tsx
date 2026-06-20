import { CartProvider } from "@/components/storefront/CartProvider";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
