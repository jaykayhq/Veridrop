import { db } from "./db";
import type { Product, Order, Dispute, DispatchCompany, User, Escrow } from "./types";

type EnrichedOrder = Order & { buyerName: string; vendorName: string };

async function enrichOrder(order: Order): Promise<EnrichedOrder> {
  const [buyer, vendor] = await Promise.all([
    db.users.findOne({ _id: order.buyerId }),
    db.users.findOne({ _id: order.vendorId }),
  ]);
  return { ...order, buyerName: (buyer as User)?.name || "Unknown", vendorName: (vendor as User)?.name || "Unknown" };
}

function calculatePassRate(orders: Order[]): number {
  const completed = orders.filter((o) => o.status === "passed" || o.status === "delivered");
  if (completed.length === 0) return 100;
  return Math.round((completed.length / Math.max(orders.length, 1)) * 100);
}

export async function getVendorDashboard(vendorId: string) {
  const orders = (await db.orders.find({ vendorId })) as Order[];
  const escrows = (await db.escrows.find({ vendorId })) as Escrow[];
  const activeOrders = orders.filter((o) => ["pending", "locked"].includes(o.status));
  const recent = await Promise.all(orders.slice(-5).reverse().map(enrichOrder));
  const monthlyVolume = orders
    .filter((o) => o.createdAt > new Date(Date.now() - 30 * 86400000).toISOString())
    .reduce((sum, o) => sum + o.amount, 0);
  return {
    activeOrders: activeOrders.length,
    escrowBalance: escrows.filter((e) => e.status === "locked").reduce((sum, e) => sum + e.amount, 0),
    monthlyVolume,
    passRate: calculatePassRate(orders),
    recentOrders: recent,
  };
}

export async function getVendorOrders(vendorId: string, status?: string) {
  const orders = (await db.orders.find({ vendorId })) as Order[];
  const filtered = status ? orders.filter((o) => o.status === status) : orders;
  return {
    total: filtered.length,
    orders: await Promise.all(filtered.reverse().map(enrichOrder)),
    statusCounts: {
      pending: orders.filter((o) => o.status === "pending").length,
      locked: orders.filter((o) => o.status === "locked").length,
      passed: orders.filter((o) => o.status === "passed").length,
      in_transit: orders.filter((o) => o.status === "in_transit").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      disputed: orders.filter((o) => o.status === "disputed").length,
      refunded: orders.filter((o) => o.status === "refunded").length,
    },
  };
}

export async function getVendorProducts(vendorId: string) {
  const products = (await db.products.find({ vendorId })) as Product[];
  return {
    activeListings: products.filter((p) => p.status === "active").length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    totalSales: products.reduce((sum, p) => sum + p.sales * p.price, 0),
    products: products.reverse(),
  };
}

export async function getVendorStore(userId: string) {
  const user = (await db.users.findOne({ _id: userId })) as User | null;
  return { slug: user?.slug || "", storeName: user?.business || "" };
}

export async function getVendorBalance(vendorId: string) {
  const orders = (await db.orders.find({ vendorId })) as Order[];
  let availableBalance = 0;
  let escrowLocked = 0;
  for (const order of orders) {
    if (order.status === "delivered") availableBalance += order.amount;
    else if (["pending", "locked", "passed", "in_transit"].includes(order.status)) escrowLocked += order.amount;
  }
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const securityReserve = Math.min(deliveredCount, 10) * 5000;
  return {
    availableBalance,
    escrowLocked,
    securityReserve,
    breakdown: {
      totalOrders: orders.length,
      deliveredOrders: deliveredCount,
      pendingAmount: escrowLocked,
      holdbackReserve: securityReserve,
      netAvailable: availableBalance - securityReserve,
    },
  };
}

export async function getVendorInspectors() {
  const allUsers = (await db.users.find({})) as User[];
  const inspectors = allUsers.filter((u) => u.role === "inspector");
  return {
    available: inspectors.filter((i) => i.status === "active").length,
    total: inspectors.length,
    inspectors,
  };
}

export async function getVendorDispatch(vendorId: string) {
  const companies = (await db.dispatchCompanies.find({ vendorId })) as DispatchCompany[];
  return {
    connected: companies.filter((c) => c.status === "connected").length,
    activeRiders: companies.reduce((sum, c) => sum + c.activeRiders, 0),
    deliveriesToday: companies.reduce((sum, c) => sum + c.deliveriesToday, 0),
    companies,
  };
}

export async function getAdminDashboard() {
  const [users, orders, escrows] = await Promise.all([
    db.users.find({}) as Promise<User[]>,
    db.orders.find({}) as Promise<Order[]>,
    db.escrows.find({}) as Promise<Escrow[]>,
  ]);
  const recent = await Promise.all(
    (orders as Order[]).slice(-5).reverse().map(enrichOrder)
  );
  const totalVolume = (orders as Order[]).reduce((sum, o) => sum + o.amount, 0);
  return {
    totalUsers: (users as User[]).length,
    activeOrders: (orders as Order[]).filter((o) => ["pending", "locked", "passed", "in_transit"].includes(o.status)).length,
    escrowVolume: totalVolume,
    disputeRate: orders.length > 0 ? ((orders as Order[]).filter((o) => o.status === "disputed").length / (orders as Order[]).length * 100).toFixed(1) + "%" : "0%",
    recentTransactions: recent,
  };
}

export async function getAdminUsers(role?: string, status?: string) {
  const allUsers = (await db.users.find({})) as User[];
  let filtered = allUsers;
  if (role) filtered = filtered.filter((u) => u.role === role);
  if (status) filtered = filtered.filter((u) => u.status === status);
  return { total: filtered.length, users: filtered };
}

export async function getAdminTransactions() {
  const orders = (await db.orders.find({})) as Order[];
  const enriched = await Promise.all(orders.reverse().map(enrichOrder));
  const totalVolume = orders.reduce((sum, o) => sum + o.amount, 0);
  return {
    totalVolume,
    activeEscrows: orders.filter((o) => ["pending", "locked", "passed", "in_transit"].includes(o.status)).length,
    avgAmount: orders.length > 0 ? Math.round(totalVolume / orders.length) : 0,
    transactions: enriched,
  };
}

export async function getAdminDisputes() {
  const disputes = (await db.disputes.find({})) as Dispute[];
  return {
    open: disputes.filter((d) => d.status === "pending").length,
    underReview: disputes.filter((d) => d.status === "review").length,
    avgResolutionTime: "—",
    disputes,
  };
}

export async function getAdminDispatch() {
  const companies = (await db.dispatchCompanies.find({})) as DispatchCompany[];
  return {
    totalCompanies: companies.length,
    activeCompanies: companies.filter((c) => c.status === "connected").length,
    totalRiders: companies.reduce((sum, c) => sum + c.activeRiders, 0),
    totalDeliveries: companies.reduce((sum, c) => sum + c.deliveriesToday, 0),
    companies,
  };
}

export async function getAdminStores() {
  const vendors = (await db.users.find({ role: "vendor" })) as User[];
  const allProducts = (await db.products.find({})) as Product[];
  const stores = vendors.map((v) => {
    const products = allProducts.filter((p) => p.vendorId === v._id);
    return {
      id: v._id,
      name: v.business || "Unnamed Store",
      slug: v.slug || "",
      owner: v.name,
      products: products.length,
      activeProducts: products.filter((p) => p.status === "active").length,
      status: v.status,
    };
  });
  return {
    totalStores: stores.length,
    activeStores: stores.filter((s) => s.status === "active").length,
    pendingStores: stores.filter((s) => s.status === "pending").length,
    totalProducts: allProducts.length,
    stores,
  };
}

export async function getAdminApprovals() {
  const allUsers = (await db.users.find({})) as User[];
  const pending = allUsers.filter((u) => u.status === "pending");
  return {
    pending: pending.length,
    vendors: pending.filter((u) => u.role === "vendor").length,
    inspectors: pending.filter((u) => u.role === "inspector").length,
    riders: pending.filter((u) => u.role === "rider").length,
    approvals: pending,
  };
}
