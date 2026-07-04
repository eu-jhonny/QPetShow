import { readCollection, writeCollection } from "./store";

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  minSubtotal?: number;
  createdAt: string;
}

const COLLECTION = "coupons";

const DEFAULTS: Coupon[] = [
  { code: "BEMVINDO10", type: "percent", value: 10, active: true, createdAt: new Date().toISOString() },
  { code: "FRETEGRATIS", type: "fixed", value: 19.9, active: true, minSubtotal: 99, createdAt: new Date().toISOString() },
];

export async function listCoupons(): Promise<Coupon[]> {
  const stored = await readCollection<Coupon>(COLLECTION);
  if (stored.length === 0) return DEFAULTS;
  return stored;
}

export async function saveCoupons(coupons: Coupon[]) {
  await writeCollection(COLLECTION, coupons);
}

export async function findCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  const coupons = await listCoupons();
  return coupons.find((c) => c.code === normalized && c.active) ?? null;
}

/** Calcula o desconto de um cupom sobre um subtotal. */
export function couponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
  if (coupon.type === "percent") return (subtotal * coupon.value) / 100;
  return Math.min(coupon.value, subtotal);
}
