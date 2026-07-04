"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, Pencil, Package, Save, Upload, ImagePlus } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { categories } from "@/lib/data/categories";
import { formatBRL, cn } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  description: string;
  badge?: string;
  image?: string;
  icon?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
}

const ICONS = [
  "dog", "cat", "shield", "layers", "drumstick", "toy", "bone", "pill",
  "beef", "bed", "paw", "droplets", "bath", "sparkles", "zap", "utensils",
];

const ICON_LABELS: Record<string, string> = {
  dog: "Cachorro", cat: "Gato", shield: "Proteção", layers: "Camadas/Areia",
  drumstick: "Sachê/Petisco", toy: "Brinquedo", bone: "Osso/Acessório", pill: "Remédio",
  beef: "Carne/Bifinho", bed: "Cama", paw: "Patinha", droplets: "Água/Higiene",
  bath: "Banho", sparkles: "Novidade", zap: "Energia", utensils: "Comedouro",
};

const emptyForm = {
  name: "", brand: "", category: "cachorros", price: "", oldPrice: "", stock: "",
  description: "", badge: "", image: "", icon: "paw", features: "", rating: "5", reviews: "0",
};

export default function AdminProdutosPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload?folder=products", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, image: data.url }));
      toast("Imagem enviada!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro no upload", "error");
    } finally {
      setUploading(false);
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      stock: String(p.stock), description: p.description, badge: p.badge ?? "", image: p.image ?? "",
      icon: p.icon ?? "paw", features: (p.features ?? []).join("\n"),
      rating: String(p.rating ?? 5), reviews: String(p.reviews ?? 0),
    });
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      const features = form.features.split("\n").map((f) => f.trim()).filter(Boolean);
      const payload = {
        name: form.name, brand: form.brand, category: form.category,
        price: Number(form.price), stock: Number(form.stock),
        description: form.description,
        icon: form.icon,
        features,
        rating: Number(form.rating) || 5,
        reviews: Number(form.reviews) || 0,
        ...(form.oldPrice ? { oldPrice: Number(form.oldPrice) } : {}),
        ...(form.badge ? { badge: form.badge } : {}),
        ...(form.image ? { image: form.image } : {}),
      };
      const res = editing
        ? await fetch(`/api/admin/products/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast(editing ? "Produto atualizado!" : "Produto criado!");
      setModalOpen(false);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao salvar", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) { toast("Produto excluído"); load(); }
    else toast("Erro ao excluir", "error");
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Produtos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{products.length} produtos no catálogo</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-600">
          <Plus className="size-4" aria-hidden /> Novo produto
        </button>
      </header>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produto…"
        className="mb-5 h-11 w-full max-w-sm rounded-full border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5"
      />

      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 dark:border-white/10">
              <tr className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                <th className="px-5 py-3">Produto</th>
                <th className="hidden px-5 py-3 md:table-cell">Categoria</th>
                <th className="px-5 py-3">Preço</th>
                <th className="px-5 py-3">Estoque</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {filtered.map((p) => (
                <tr key={p.id} className="transition hover:bg-brand-50/40 dark:hover:bg-white/5">
                  <td className="px-5 py-3">
                    <span className="block font-bold">{p.name}</span>
                    <span className="block text-xs text-gray-400">{p.brand}</span>
                  </td>
                  <td className="hidden px-5 py-3 capitalize text-gray-500 md:table-cell dark:text-gray-400">{p.category}</td>
                  <td className="px-5 py-3 font-bold">{formatBRL(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", p.stock < 30 ? "bg-fire-100 text-fire-700 dark:bg-fire-900/40 dark:text-fire-300" : "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300")}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} aria-label="Editar" className="rounded-lg p-2 text-gray-500 transition hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-white/10">
                        <Pencil className="size-4" aria-hidden />
                      </button>
                      <button onClick={() => remove(p)} aria-label="Excluir" className="rounded-lg p-2 text-gray-500 transition hover:bg-fire-100 hover:text-fire-600 dark:hover:bg-fire-900/30">
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Package className="size-8 text-gray-300" aria-hidden />
              <p className="text-sm text-gray-500">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[80] max-h-[88vh] w-[94%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-lift dark:bg-[#0d1410]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold">{editing ? "Editar produto" : "Novo produto"}</h2>
                <button onClick={() => setModalOpen(false)} aria-label="Fechar" className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"><X className="size-5" aria-hidden /></button>
              </div>
              <div className="flex flex-col gap-3">
                <Field label="Nome"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Marca"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputCls} /></Field>
                  <Field label="Categoria">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                      {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Preço (R$)"><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} /></Field>
                  <Field label="Preço antigo"><input type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className={inputCls} /></Field>
                  <Field label="Estoque"><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls} /></Field>
                </div>
                <Field label="Selo (opcional)">
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputCls}>
                    <option value="">Nenhum</option>
                    <option value="promo">Promoção</option>
                    <option value="novo">Novo</option>
                    <option value="mais-vendido">Mais vendido</option>
                  </select>
                </Field>
                <Field label="Imagem do produto (opcional)">
                  <div className="flex items-start gap-3">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-brand-400 hover:text-brand-500 disabled:opacity-60 dark:border-white/15"
                    >
                      {form.image ? (
                        <Image src={form.image} alt="Prévia" width={80} height={80} className="size-full rounded-lg object-cover" />
                      ) : uploading ? (
                        <Upload className="size-5 animate-pulse" aria-hidden />
                      ) : (
                        <ImagePlus className="size-5" aria-hidden />
                      )}
                    </button>
                    <div className="flex-1">
                      <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Envie um arquivo ou cole uma URL" className={inputCls} />
                      <p className="mt-1 text-[11px] text-gray-400">Clique no quadrado para enviar do computador.</p>
                    </div>
                  </div>
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Ícone (sem foto)">
                    <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls}>
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ICON_LABELS[ic] ?? ic}</option>)}
                    </select>
                  </Field>
                  <Field label="Avaliação (0-5)"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={inputCls} /></Field>
                  <Field label="Nº avaliações"><input type="number" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} className={inputCls} /></Field>
                </div>
                <Field label="Descrição"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={cn(inputCls, "h-auto py-2")} /></Field>
                <Field label="Características (uma por linha)">
                  <textarea rows={4} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder={"Ex:\nProteção por 12 semanas\nDose única mastigável"} className={cn(inputCls, "h-auto py-2")} />
                </Field>
                <button onClick={save} disabled={saving} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-extrabold text-white transition hover:bg-brand-600 disabled:opacity-60">
                  <Save className="size-4" aria-hidden /> {saving ? "Salvando…" : "Salvar produto"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-bold">{label}</span>
      {children}
    </label>
  );
}
