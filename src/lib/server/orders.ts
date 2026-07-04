import { readCollection, writeCollection } from "./store";

export type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pendente: "Aguardando pagamento",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const orderStatusFlow: OrderStatus[] = ["pendente", "pago", "enviado", "entregue"];

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  code: string;
  userId: string | null;
  customer: OrderCustomer;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: "pix" | "cartao" | "boleto";
  status: OrderStatus;
  trackingCode?: string;
  adminNote?: string;
  timeline: { status: OrderStatus; at: string }[];
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "orders";

function generateCode() {
  return `QPS-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function listOrders(): Promise<Order[]> {
  const orders = await readCollection<Order>(COLLECTION);
  return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await readCollection<Order>(COLLECTION);
  return orders.find((o) => o.id === id || o.code === id) ?? null;
}

export async function listOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await listOrders();
  return orders.filter((o) => o.userId === userId);
}

export async function listOrdersByEmail(email: string): Promise<Order[]> {
  const orders = await listOrders();
  return orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
}

export async function createOrder(
  input: Omit<Order, "id" | "code" | "status" | "timeline" | "createdAt" | "updatedAt"> & {
    status?: OrderStatus;
  }
): Promise<Order> {
  const orders = await readCollection<Order>(COLLECTION);
  const now = new Date().toISOString();
  const status = input.status ?? "pendente";
  const order: Order = {
    ...input,
    id: crypto.randomUUID(),
    code: generateCode(),
    status,
    timeline: [{ status, at: now }],
    createdAt: now,
    updatedAt: now,
  };
  orders.push(order);
  await writeCollection(COLLECTION, orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingCode?: string
): Promise<Order | null> {
  const orders = await readCollection<Order>(COLLECTION);
  const idx = orders.findIndex((o) => o.id === id || o.code === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  orders[idx] = {
    ...orders[idx],
    status,
    trackingCode: trackingCode ?? orders[idx].trackingCode,
    timeline: [...orders[idx].timeline, { status, at: now }],
    updatedAt: now,
  };
  await writeCollection(COLLECTION, orders);
  return orders[idx];
}

/** Atualiza campos avulsos do pedido (ex.: nota do admin, rastreio) sem mudar status. */
export async function updateOrderFields(
  id: string,
  patch: Partial<Pick<Order, "adminNote" | "trackingCode">>
): Promise<Order | null> {
  const orders = await readCollection<Order>(COLLECTION);
  const idx = orders.findIndex((o) => o.id === id || o.code === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeCollection(COLLECTION, orders);
  return orders[idx];
}

/** Métricas agregadas para o dashboard do admin. */
export async function orderStats() {
  const orders = await listOrders();
  const paid = orders.filter((o) => o.status !== "cancelado" && o.status !== "pendente");
  const revenue = paid.reduce((acc, o) => acc + o.total, 0);
  const pending = orders.filter((o) => o.status === "pendente").length;
  const ticket = paid.length ? revenue / paid.length : 0;
  return { total: orders.length, revenue, pending, ticket, paidCount: paid.length };
}
