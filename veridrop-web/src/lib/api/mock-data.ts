// TODO: Replace this entire file with real database queries (PostgreSQL via Prisma)
// TODO: Add proper error handling, validation, and pagination

export const NOW = "2026-06-13T12:00:00.000Z";

export const MOCK_USERS = [
  { _id: "usr_001", email: "vendor@example.com", name: "Amara Okafor", role: "vendor", business: "GadgetHub NG", slug: "gadgethub-ng", kycStatus: "active", status: "active", phone: "08012345678", createdAt: "2026-04-15T10:00:00.000Z" },
  { _id: "usr_002", email: "admin@veridrop.com", name: "Admin User", role: "admin", kycStatus: "active", status: "active", createdAt: "2026-03-01T08:00:00.000Z" },
  { _id: "usr_003", email: "buyer@example.com", name: "Tunde Adebayo", role: "buyer", kycStatus: "active", status: "active", createdAt: "2026-05-01T09:00:00.000Z" },
  { _id: "usr_004", email: "chidi@email.com", name: "Chidi Eze", role: "inspector", kycStatus: "active", status: "active", createdAt: "2026-05-10T11:00:00.000Z" },
  { _id: "usr_005", email: "grace@email.com", name: "Grace Okonkwo", role: "inspector", kycStatus: "active", status: "active", createdAt: "2026-05-10T11:30:00.000Z" },
  { _id: "usr_006", email: "blessing@email.com", name: "Blessing John", role: "rider", kycStatus: "active", status: "active", createdAt: "2026-06-01T12:00:00.000Z" },
  { _id: "usr_007", email: "emeka@techplus.ng", name: "Emeka Nwosu", role: "vendor", business: "TechPlus NG", slug: "techplus-ng", kycStatus: "pending", status: "pending", createdAt: "2026-06-12T14:00:00.000Z" },
  { _id: "usr_008", email: "samuel@email.com", name: "Samuel Ade", role: "rider", kycStatus: "active", status: "active", createdAt: "2026-05-20T15:00:00.000Z" },
];

export const MOCK_PRODUCTS = [
  { _id: "prd_001", vendorId: "usr_001", name: "iPhone 15 Pro", category: "Electronics", price: 245000, stock: 12, description: "Latest Apple smartphone with A17 Pro chip", status: "active", sales: 34, createdAt: "2026-05-01T10:00:00.000Z" },
  { _id: "prd_002", vendorId: "usr_001", name: "MacBook Air M3", category: "Electronics", price: 520000, stock: 3, description: "Apple's thinnest laptop with M3 chip", status: "active", sales: 22, createdAt: "2026-05-02T10:00:00.000Z" },
  { _id: "prd_003", vendorId: "usr_001", name: "Gucci GG Marmont Bag", category: "Fashion", price: 89500, stock: 5, description: "Luxury handbag", status: "active", sales: 18, createdAt: "2026-05-03T10:00:00.000Z" },
  { _id: "prd_004", vendorId: "usr_001", name: "Nike Air Max 90", category: "Fashion", price: 34200, stock: 28, description: "Classic sneakers", status: "active", sales: 56, createdAt: "2026-05-04T10:00:00.000Z" },
  { _id: "prd_005", vendorId: "usr_001", name: "iPad Pro 12.9", category: "Electronics", price: 189000, stock: 8, description: "Apple's most powerful tablet", status: "active", sales: 15, createdAt: "2026-05-05T10:00:00.000Z" },
  { _id: "prd_006", vendorId: "usr_001", name: "AirPods Pro 2", category: "Accessories", price: 45000, stock: 25, description: "Wireless earbuds with ANC", status: "active", sales: 67, createdAt: "2026-05-06T10:00:00.000Z" },
  { _id: "prd_007", vendorId: "usr_001", name: "Samsung Galaxy S25", category: "Electronics", price: 156000, stock: 0, description: "Flagship Android smartphone", status: "inactive", sales: 41, createdAt: "2026-05-07T10:00:00.000Z" },
  { _id: "prd_008", vendorId: "usr_001", name: "Dell XPS 15", category: "Electronics", price: 312000, stock: 0, description: "Premium Windows laptop", status: "inactive", sales: 15, createdAt: "2026-05-08T10:00:00.000Z" },
  { _id: "prd_009", vendorId: "usr_001", name: "PS5 Digital Edition", category: "Electronics", price: 445000, stock: 4, description: "Sony gaming console", status: "active", sales: 12, createdAt: "2026-05-09T10:00:00.000Z" },
];

export const MOCK_ORDERS = [
  { _id: "ord_001", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_001", productName: "iPhone 15 Pro", amount: 245000, status: "locked", inspectorId: "usr_004", escrowId: "esc_001", createdAt: "2026-06-13T08:00:00.000Z" },
  { _id: "ord_002", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_003", productName: "Gucci Bag", amount: 89500, status: "passed", inspectorId: "usr_005", escrowId: "esc_002", createdAt: "2026-06-13T09:00:00.000Z" },
  { _id: "ord_003", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_002", productName: "MacBook Air", amount: 520000, status: "disputed", inspectorId: "usr_004", escrowId: "esc_003", createdAt: "2026-06-12T10:00:00.000Z" },
  { _id: "ord_004", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_004", productName: "Nike Air Max", amount: 34200, status: "delivered", inspectorId: "usr_006", escrowId: "esc_004", createdAt: "2026-06-12T11:00:00.000Z" },
  { _id: "ord_005", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_007", productName: "Samsung S25", amount: 156000, status: "refunded", inspectorId: "usr_005", escrowId: "esc_005", createdAt: "2026-06-11T12:00:00.000Z" },
  { _id: "ord_006", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_009", productName: "PS5", amount: 445000, status: "in_transit", inspectorId: "usr_004", escrowId: "esc_006", createdAt: "2026-06-11T13:00:00.000Z" },
  { _id: "ord_007", buyerId: "usr_003", vendorId: "usr_001", productId: "prd_005", productName: "iPad Pro", amount: 189000, status: "pending", createdAt: "2026-06-10T14:00:00.000Z" },
];

export const MOCK_ESCROWS = [
  { _id: "esc_001", orderId: "ord_001", amount: 245000, status: "locked", buyerId: "usr_003", vendorId: "usr_001", createdAt: "2026-06-13T08:00:00.000Z" },
  { _id: "esc_002", orderId: "ord_002", amount: 89500, status: "locked", buyerId: "usr_003", vendorId: "usr_001", createdAt: "2026-06-13T09:00:00.000Z" },
  { _id: "esc_003", orderId: "ord_003", amount: 520000, status: "locked", buyerId: "usr_003", vendorId: "usr_001", createdAt: "2026-06-12T10:00:00.000Z" },
  { _id: "esc_004", orderId: "ord_004", amount: 34200, status: "released", buyerId: "usr_003", vendorId: "usr_001", createdAt: "2026-06-12T11:00:00.000Z" },
  { _id: "esc_005", orderId: "ord_005", amount: 156000, status: "refunded", buyerId: "usr_003", vendorId: "usr_001", createdAt: "2026-06-11T12:00:00.000Z" },
  { _id: "esc_006", orderId: "ord_006", amount: 445000, status: "locked", buyerId: "usr_003", vendorId: "usr_001", createdAt: "2026-06-11T13:00:00.000Z" },
];

export const MOCK_INSPECTIONS = [
  { _id: "ins_001", orderId: "ord_001", inspectorId: "usr_004", status: "passed", photos: [], notes: "Product matches listing", createdAt: "2026-06-13T09:00:00.000Z", completedAt: "2026-06-13T09:30:00.000Z" },
  { _id: "ins_002", orderId: "ord_002", inspectorId: "usr_005", status: "passed", photos: [], notes: "Authentic product", createdAt: "2026-06-13T10:00:00.000Z", completedAt: "2026-06-13T10:25:00.000Z" },
  { _id: "ins_003", orderId: "ord_003", inspectorId: "usr_004", status: "failed", photos: [], notes: "Screen damage detected", failedReason: "product_mismatch", createdAt: "2026-06-12T11:00:00.000Z", completedAt: "2026-06-12T11:20:00.000Z" },
];

export const MOCK_DISPATCH_COMPANIES = [
  { _id: "dc_001", name: "SwiftLogix", vendorId: "usr_001", status: "connected", activeRiders: 12, deliveriesToday: 45, onboarding: false, coverage: ["Lagos", "Abuja"], createdAt: "2026-04-01T10:00:00.000Z" },
  { _id: "dc_002", name: "GoLorry NG", vendorId: "usr_001", status: "available", activeRiders: 0, deliveriesToday: 0, onboarding: false, coverage: ["Lagos"], createdAt: "2026-05-01T10:00:00.000Z" },
  { _id: "dc_003", name: "RedStar Express", vendorId: "usr_001", status: "pending", activeRiders: 0, deliveriesToday: 0, onboarding: true, coverage: [], createdAt: "2026-06-01T10:00:00.000Z" },
];

export const MOCK_RIDERS = [
  { _id: "rid_001", companyId: "dc_001", name: "Emeka Nwosu", phone: "08012345678", status: "available", activeDeliveries: 0, totalDeliveries: 89, createdAt: "2026-04-10T10:00:00.000Z" },
  { _id: "rid_002", companyId: "dc_001", name: "Fatima Yusuf", phone: "08087654321", status: "available", activeDeliveries: 1, totalDeliveries: 67, createdAt: "2026-04-11T10:00:00.000Z" },
  { _id: "rid_003", companyId: "dc_001", name: "Tunde Bakare", phone: "08055556666", status: "available", activeDeliveries: 0, totalDeliveries: 45, createdAt: "2026-04-12T10:00:00.000Z" },
];

export const MOCK_DISPUTES = [
  { _id: "dsp_001", orderId: "ord_003", buyerId: "usr_003", vendorId: "usr_001", amount: 520000, reason: "Product mismatch - screen damage not disclosed", status: "review", resolution: "", filedAt: "2026-06-12T12:00:00.000Z", resolvedAt: null as unknown as undefined },
];

export const MOCK_NOTIFICATIONS = [
  { _id: "not_001", userId: "usr_001", title: "New Order", message: "Order ORD-007 for iPad Pro is pending", type: "order", read: false, createdAt: "2026-06-13T10:00:00.000Z" },
  { _id: "not_002", userId: "usr_001", title: "Inspection Passed", message: "iPhone 15 Pro (ORD-001) passed inspection", type: "inspection", read: false, createdAt: "2026-06-13T09:30:00.000Z" },
  { _id: "not_003", userId: "usr_001", title: "Delivery Confirmed", message: "Nike Air Max (ORD-004) delivered successfully", type: "delivery", read: true, createdAt: "2026-06-12T14:00:00.000Z" },
];

// TODO: Replace with real async DB queries
export function delay(ms = 100) {
  return new Promise((r) => setTimeout(r, ms));
}
