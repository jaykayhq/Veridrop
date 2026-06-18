export type Role = "buyer" | "vendor" | "inspector" | "rider" | "admin";

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
  business?: string;
  slug?: string;
  kycStatus: "pending" | "active" | "rejected";
  status: "active" | "pending" | "rejected";
  createdAt: string;
}

export interface Product {
  _id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  sales: number;
  createdAt: string;
}

export type OrderStatus = "pending" | "locked" | "passed" | "failed" | "in_transit" | "delivered" | "disputed" | "refunded";

export interface Order {
  _id: string;
  buyerId: string;
  vendorId: string;
  productId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  inspectorId?: string;
  escrowId?: string;
  qrSealId?: string;
  dispatchId?: string;
  riderId?: string;
  trackingUrl?: string;
  createdAt: string;
}

export interface Escrow {
  _id: string;
  orderId: string;
  amount: number;
  status: "locked" | "released" | "refunded" | "partial";
  buyerId: string;
  vendorId: string;
  releasedAt?: string;
  createdAt: string;
}

export interface Inspection {
  _id: string;
  orderId: string;
  inspectorId: string;
  status: "pending" | "passed" | "failed";
  photos: string[];
  notes?: string;
  checklistResults?: Record<string, boolean>;
  failedReason?: string;
  createdAt: string;
  completedAt?: string;
}

export interface QRSeal {
  _id: string;
  serial: string;
  orderId: string;
  status: "active" | "scanned_pickup" | "scanned_delivery" | "tampered";
  custodyLog: CustodyEvent[];
  createdAt: string;
}

export interface CustodyEvent {
  userId: string;
  role: string;
  action: "pickup" | "transit" | "delivery";
  gps?: { lat: number; lng: number };
  timestamp: string;
}

export interface DispatchCompany {
  _id: string;
  name: string;
  vendorId: string;
  status: "available" | "pending" | "connected";
  activeRiders: number;
  deliveriesToday: number;
  onboarding: boolean;
  coverage?: string[];
  createdAt: string;
}

export interface Rider {
  _id: string;
  companyId: string;
  name: string;
  phone: string;
  status: "available" | "on_delivery" | "offline";
  activeDeliveries: number;
  totalDeliveries: number;
  createdAt: string;
}

export interface Dispute {
  _id: string;
  orderId: string;
  buyerId: string;
  vendorId: string;
  amount: number;
  reason: string;
  status: "pending" | "review" | "resolved" | "rejected";
  resolution?: string;
  filedAt: string;
  resolvedAt?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "inspection" | "delivery" | "dispute" | "system";
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}
