"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Address {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

const empty = { label: "Casa", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" };

export function AddressBook() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/conta/enderecos");
    const data = await res.json();
    if (res.ok) setAddresses(data.addresses);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    setSaving(true);
    try {
      const res = await fetch("/api/conta/enderecos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast("Endereço salvo!");
      setForm(empty); setOpen(false); load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro", "error");
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    await fetch(`/api/conta/enderecos?id=${id}`, { method: "DELETE" });
    toast("Endereço removido"); load();
  }

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-extrabold">Meus endereços</h2>
        <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-brand-600">
          <Plus className="size-3.5" aria-hidden /> Adicionar
        </button>
      </div>

      {open && (
        <div className="mb-4 rounded-2xl border-2 border-dashed border-brand-200 p-4 dark:border-brand-800">
          <div className="grid grid-cols-2 gap-2">
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Nome (Casa, Trabalho)" className={inp} />
            <input value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} placeholder="CEP" className={inp} />
            <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Rua" className={`${inp} col-span-2`} />
            <input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="Número" className={inp} />
            <input value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} placeholder="Complemento" className={inp} />
            <input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} placeholder="Bairro" className={`${inp} col-span-2`} />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cidade" className={inp} />
            <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} placeholder="UF" maxLength={2} className={inp} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={add} disabled={saving} className="rounded-full bg-brand-500 px-5 py-2 text-xs font-extrabold text-white transition hover:bg-brand-600 disabled:opacity-60">{saving ? "Salvando…" : "Salvar endereço"}</button>
            <button onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-xs font-bold text-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="py-4 text-sm text-gray-500 dark:text-gray-400">Nenhum endereço salvo ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {addresses.map((a) => (
            <li key={a.id} className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden />
              <div className="flex-1 text-sm">
                <p className="font-bold">{a.label} {a.isDefault && <span className="ml-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold text-brand-700 dark:bg-brand-950 dark:text-brand-300">Padrão</span>}</p>
                <p className="text-gray-500 dark:text-gray-400">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ""} · {a.neighborhood}</p>
                <p className="text-gray-500 dark:text-gray-400">{a.city}/{a.state} · CEP {a.cep}</p>
              </div>
              <button onClick={() => remove(a.id)} aria-label="Remover" className="rounded-lg p-2 text-gray-400 transition hover:bg-fire-100 hover:text-fire-600 dark:hover:bg-fire-900/30">
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const inp = "h-10 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5";
