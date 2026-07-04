"use client";

import { useEffect, useState, useCallback } from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { formatBRL, cn } from "@/lib/utils";

interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  minSubtotal?: number;
}

export default function AdminCuponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", minSubtotal: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) setCoupons(data.coupons);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code, type: form.type, value: Number(form.value), ...(form.minSubtotal ? { minSubtotal: Number(form.minSubtotal) } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast("Cupom criado!");
      setForm({ code: "", type: "percent", value: "", minSubtotal: "" });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro", "error");
    } finally { setSaving(false); }
  }

  async function toggle(c: Coupon) {
    await fetch("/api/admin/coupons", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: c.code, active: !c.active }) });
    load();
  }
  async function remove(c: Coupon) {
    if (!confirm(`Excluir cupom ${c.code}?`)) return;
    await fetch("/api/admin/coupons", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: c.code, remove: true }) });
    toast("Cupom excluído");
    load();
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold">Cupons</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Crie e gerencie códigos de desconto</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
          <h2 className="font-display mb-4 text-lg font-extrabold">Novo cupom</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm"><span className="font-bold">Código</span>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="EX: PET15" className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm"><span className="font-bold">Tipo</span>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                <option value="percent">Percentual (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm"><span className="font-bold">{form.type === "percent" ? "Desconto (%)" : "Desconto (R$)"}</span>
              <input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-sm"><span className="font-bold">Subtotal mínimo (opcional)</span>
              <input type="number" step="0.01" value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} className={inputCls} />
            </label>
            <button onClick={create} disabled={saving || !form.code || !form.value} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-extrabold text-white transition hover:bg-brand-600 disabled:opacity-50">
              <Plus className="size-4" aria-hidden /> Criar cupom
            </button>
          </div>
        </section>

        <section className="lg:col-span-2">
          {loading ? (
            <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
          ) : (
            <div className="flex flex-col gap-3">
              {coupons.map((c) => (
                <div key={c.code} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
                  <span className={cn("flex size-11 items-center justify-center rounded-xl", c.active ? "bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300" : "bg-gray-100 text-gray-400 dark:bg-white/10")}>
                    <Tag className="size-5" aria-hidden />
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-lg font-extrabold tracking-wide">{c.code}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {c.type === "percent" ? `${c.value}% de desconto` : `${formatBRL(c.value)} de desconto`}
                      {c.minSubtotal ? ` · mín. ${formatBRL(c.minSubtotal)}` : ""}
                    </p>
                  </div>
                  <button onClick={() => toggle(c)} className={cn("rounded-full px-3 py-1 text-xs font-extrabold", c.active ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300" : "bg-gray-100 text-gray-500 dark:bg-white/10")}>
                    {c.active ? "Ativo" : "Inativo"}
                  </button>
                  <button onClick={() => remove(c)} aria-label="Excluir" className="rounded-lg p-2 text-gray-400 transition hover:bg-fire-100 hover:text-fire-600 dark:hover:bg-fire-900/30">
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5";
