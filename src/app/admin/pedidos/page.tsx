"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Package, MapPin, User, Clock, Search, Mail, StickyNote, Printer, Truck } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { formatBRL, cn } from "@/lib/utils";

type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado";

interface Order {
  id: string;
  code: string;
  customer: { name: string; email: string; phone: string };
  address: { street: string; number: string; neighborhood: string; city: string; state: string; cep: string };
  items: { name: string; brand: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  trackingCode?: string;
  adminNote?: string;
  timeline: { status: OrderStatus; at: string }[];
  createdAt: string;
}

const statusLabels: Record<OrderStatus, string> = {
  pendente: "Aguardando pagamento", pago: "Pago", enviado: "Enviado", entregue: "Entregue", cancelado: "Cancelado",
};
const statusColors: Record<OrderStatus, string> = {
  pendente: "bg-sun-100 text-sun-800 dark:bg-sun-900/40 dark:text-sun-300",
  pago: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  enviado: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  entregue: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelado: "bg-fire-100 text-fire-700 dark:bg-fire-900/40 dark:text-fire-300",
};
const nextActions: Record<OrderStatus, { status: OrderStatus; label: string }[]> = {
  pendente: [{ status: "pago", label: "Confirmar pagamento" }, { status: "cancelado", label: "Cancelar" }],
  pago: [{ status: "enviado", label: "Marcar como enviado" }, { status: "cancelado", label: "Cancelar" }],
  enviado: [{ status: "entregue", label: "Marcar como entregue" }],
  entregue: [],
  cancelado: [],
};

const FILTERS: (OrderStatus | "todos")[] = ["todos", "pendente", "pago", "enviado", "entregue", "cancelado"];

export default function AdminPedidosPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [tracking, setTracking] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openOrder(o: Order) {
    setSelected(o);
    setTracking(o.trackingCode ?? "");
    setNote(o.adminNote ?? "");
  }

  async function updateStatus(order: Order, status: OrderStatus) {
    if (status === "cancelado" && !confirm(`Cancelar o pedido #${order.code}?`)) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(status === "enviado" && tracking.trim() ? { trackingCode: tracking.trim() } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
      setSelected(data.order);
      toast(`Pedido #${order.code}: ${statusLabels[status]}${status === "pago" || status === "enviado" ? " · e-mail enviado ao cliente" : ""}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao atualizar", "error");
    } finally {
      setUpdating(false);
    }
  }

  async function resendEmail(order: Order) {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "resend" }) });
      const data = await res.json();
      toast(data.ok ? "E-mail de confirmação reenviado!" : `Falha no envio: ${data.error ?? "verifique o Resend"}`, data.ok ? "success" : "error");
    } finally { setBusy(false); }
  }

  async function saveNote(order: Order) {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "note", note }) });
      const data = await res.json();
      if (res.ok) { setSelected(data.order); setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o))); toast("Nota salva"); }
    } finally { setBusy(false); }
  }

  const q = query.trim().toLowerCase();
  const filtered = orders
    .filter((o) => filter === "todos" || o.status === filter)
    .filter((o) => !q || o.code.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q));
  const pendingCount = orders.filter((o) => o.status === "pendente").length;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {orders.length} pedidos · {pendingCount} aguardando ação
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2 text-sm font-bold transition hover:border-brand-400 dark:border-white/15"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} aria-hidden /> Atualizar
        </button>
      </header>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código, cliente ou e-mail…"
          className="h-11 w-full rounded-full border-2 border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5"
        />
      </div>

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-bold capitalize transition",
              filter === f ? "bg-brand-500 text-white" : "bg-black/5 text-gray-600 hover:bg-black/10 dark:bg-white/10 dark:text-gray-300"
            )}
          >
            {f === "todos" ? "Todos" : statusLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando pedidos…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <Package className="size-10 text-gray-300" aria-hidden />
          <p className="font-bold">Nenhum pedido {filter !== "todos" ? `com status "${statusLabels[filter as OrderStatus]}"` : "ainda"}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Os pedidos aparecem aqui automaticamente quando os clientes compram.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 dark:border-white/10">
              <tr className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="hidden px-5 py-3 sm:table-cell">Data</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => openOrder(o)}
                  className="cursor-pointer transition hover:bg-brand-50/50 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-3.5 font-extrabold">#{o.code}</td>
                  <td className="px-5 py-3.5">
                    <span className="block font-semibold">{o.customer.name}</span>
                    <span className="block text-xs text-gray-400">{o.customer.email}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-gray-500 sm:table-cell dark:text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-3.5 font-bold">{formatBRL(o.total)}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-3 py-1 text-[11px] font-extrabold", statusColors[o.status])}>
                      {statusLabels[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer de detalhe */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-lift dark:bg-[#0d1410]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold">Pedido #{selected.code}</h2>
                <button onClick={() => setSelected(null)} aria-label="Fechar" className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <span className={cn("w-fit rounded-full px-3 py-1 text-xs font-extrabold", statusColors[selected.status])}>
                {statusLabels[selected.status]}
              </span>

              <div className="mt-5 space-y-4 text-sm">
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="flex items-center gap-2 font-bold"><User className="size-4 text-brand-500" aria-hidden /> Cliente</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{selected.customer.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{selected.customer.email}</p>
                  <p className="text-gray-500 dark:text-gray-400">{selected.customer.phone}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="flex items-center gap-2 font-bold"><MapPin className="size-4 text-brand-500" aria-hidden /> Entrega</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {selected.address.street}, {selected.address.number} — {selected.address.neighborhood}<br />
                    {selected.address.city}/{selected.address.state} · CEP {selected.address.cep}
                  </p>
                  {selected.trackingCode && <p className="mt-2 font-bold text-brand-600 dark:text-brand-300">Rastreio: {selected.trackingCode}</p>}
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="flex items-center gap-2 font-bold"><Package className="size-4 text-brand-500" aria-hidden /> Itens</p>
                  <ul className="mt-2 space-y-1">
                    {selected.items.map((it, i) => (
                      <li key={i} className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>{it.quantity}× {it.name}</span>
                        <span className="font-semibold">{formatBRL(it.price * it.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-1 border-t border-black/5 pt-3 dark:border-white/10">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatBRL(selected.subtotal)}</span></div>
                    {selected.discount > 0 && <div className="flex justify-between text-brand-600"><span>Desconto</span><span>-{formatBRL(selected.discount)}</span></div>}
                    <div className="flex justify-between text-gray-500"><span>Frete</span><span>{selected.shipping === 0 ? "Grátis" : formatBRL(selected.shipping)}</span></div>
                    <div className="flex justify-between font-extrabold"><span>Total</span><span className="text-brand-600 dark:text-brand-300">{formatBRL(selected.total)}</span></div>
                    <p className="pt-1 text-xs text-gray-400">Pagamento: {selected.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="flex items-center gap-2 font-bold"><Clock className="size-4 text-brand-500" aria-hidden /> Histórico</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {selected.timeline.map((t, i) => (
                      <li key={i}>{statusLabels[t.status]} — {new Date(t.at).toLocaleString("pt-BR")}</li>
                    ))}
                  </ul>
                </div>

                {/* Código de rastreio (ao enviar) */}
                {(selected.status === "pago" || selected.status === "enviado") && (
                  <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                    <label className="flex items-center gap-2 font-bold"><Truck className="size-4 text-brand-500" aria-hidden /> Código de rastreio</label>
                    <input
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      placeholder="Ex: BR123456789BR (deixe vazio p/ gerar)"
                      className="mt-2 h-10 w-full rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-black/20"
                    />
                  </div>
                )}

                {/* Nota interna */}
                <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                  <label className="flex items-center gap-2 font-bold"><StickyNote className="size-4 text-brand-500" aria-hidden /> Nota interna</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Anotações do pedido (não visível ao cliente)"
                    className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white p-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-black/20"
                  />
                  <button onClick={() => saveNote(selected)} disabled={busy} className="mt-2 rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold text-white transition hover:bg-black disabled:opacity-60 dark:bg-white dark:text-ink">
                    Salvar nota
                  </button>
                </div>
              </div>

              {/* Ações de status */}
              {nextActions[selected.status].length > 0 && (
                <div className="mt-6 flex flex-col gap-2">
                  {nextActions[selected.status].map((action) => (
                    <button
                      key={action.status}
                      disabled={updating}
                      onClick={() => updateStatus(selected, action.status)}
                      className={cn(
                        "h-11 rounded-full text-sm font-extrabold transition disabled:opacity-60",
                        action.status === "cancelado"
                          ? "border-2 border-fire-300 text-fire-600 hover:bg-fire-50 dark:text-fire-400"
                          : "bg-brand-500 text-white hover:bg-brand-600"
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Ações extras */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => resendEmail(selected)} disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-gray-200 text-sm font-bold transition hover:border-brand-400 disabled:opacity-60 dark:border-white/15">
                  <Mail className="size-4" aria-hidden /> Reenviar e-mail
                </button>
                <button onClick={() => window.print()} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-gray-200 text-sm font-bold transition hover:border-brand-400 dark:border-white/15">
                  <Printer className="size-4" aria-hidden /> Imprimir
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
