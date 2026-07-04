"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Upload, ArrowUp, ArrowDown, Eye, EyeOff, Link2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  image: string;
  alt: string;
  href: string;
  active: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image: "", alt: "", href: "/produtos?filtro=promocao" });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (res.ok) setBanners(data.banners);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload?folder=banners", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, image: data.url }));
      toast("Imagem enviada!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro no upload", "error");
    } finally { setUploading(false); }
  }

  async function addBanner() {
    if (!form.image || !form.alt) { toast("Envie a imagem e escreva a descrição", "error"); return; }
    const res = await fetch("/api/admin/banners", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { toast(data.error, "error"); return; }
    toast("Banner adicionado!");
    setForm({ image: "", alt: "", href: "/produtos?filtro=promocao" });
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  async function patch(id: string, patch: Partial<Banner>) {
    await fetch("/api/admin/banners", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
    load();
  }
  async function move(b: Banner, dir: -1 | 1) {
    const sorted = [...banners].sort((a, c) => a.order - c.order);
    const i = sorted.findIndex((x) => x.id === b.id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    await patch(b.id, { order: sorted[j].order });
    await patch(sorted[j].id, { order: b.order });
  }
  async function remove(b: Banner) {
    if (!confirm("Remover este banner?")) return;
    await fetch(`/api/admin/banners?id=${b.id}`, { method: "DELETE" });
    toast("Banner removido");
    load();
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold">Banners</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie os banners do carrossel da página inicial.</p>
      </header>

      {/* Adicionar */}
      <section className="mb-8 rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h2 className="font-display mb-4 text-lg font-extrabold">Adicionar banner</h2>
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-brand-400 hover:text-brand-500 disabled:opacity-60 dark:border-white/15"
            >
              {form.image ? (
                <Image src={form.image} alt="Prévia" width={320} height={180} className="size-full rounded-xl object-cover" />
              ) : uploading ? (
                <><Upload className="size-7 animate-pulse" aria-hidden /> Enviando…</>
              ) : (
                <><ImagePlus className="size-7" aria-hidden /> <span className="text-xs font-bold">Escolher imagem</span></>
              )}
            </button>
            <p className="mt-1 text-center text-[11px] text-gray-400">Ideal: 2560×1440 (16:9)</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-bold">Ou cole a URL da imagem</span>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://... ou /banners/arquivo.webp" className="h-11 w-full rounded-xl border-2 border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-bold">Descrição (acessibilidade)</span>
              <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} placeholder="Ex: Antipulgas com até 25% OFF" className="h-11 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-bold">Link ao clicar</span>
              <select value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="h-11 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5">
                <option value="/produtos?filtro=promocao">Ofertas</option>
                <option value="/produtos">Todos os produtos</option>
                {categories.map((c) => <option key={c.slug} value={`/categorias/${c.slug}`}>{c.name}</option>)}
              </select>
            </label>
            <button onClick={addBanner} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-extrabold text-white transition hover:bg-brand-600">
              <ImagePlus className="size-4" aria-hidden /> Adicionar banner
            </button>
          </div>
        </div>
      </section>

      {/* Lista */}
      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
      ) : (
        <div className="flex flex-col gap-4">
          {banners.sort((a, b) => a.order - b.order).map((b, i) => (
            <div key={b.id} className={cn("flex flex-col gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-soft sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5", !b.active && "opacity-60")}>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:w-56">
                <Image src={b.image} alt={b.alt} fill sizes="224px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{b.alt}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Link: {b.href}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => move(b, -1)} disabled={i === 0} aria-label="Subir" className="rounded-lg p-2 text-gray-500 transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"><ArrowUp className="size-4" aria-hidden /></button>
                <button onClick={() => move(b, 1)} disabled={i === banners.length - 1} aria-label="Descer" className="rounded-lg p-2 text-gray-500 transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"><ArrowDown className="size-4" aria-hidden /></button>
                <button onClick={() => patch(b.id, { active: !b.active })} aria-label={b.active ? "Ocultar" : "Mostrar"} className="rounded-lg p-2 text-gray-500 transition hover:bg-black/5 dark:hover:bg-white/10">
                  {b.active ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
                </button>
                <button onClick={() => remove(b)} aria-label="Remover" className="rounded-lg p-2 text-gray-500 transition hover:bg-fire-100 hover:text-fire-600 dark:hover:bg-fire-900/30"><Trash2 className="size-4" aria-hidden /></button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-gray-200 py-12 text-center dark:border-white/15">
              <ImagePlus className="size-8 text-gray-300" aria-hidden />
              <p className="text-sm text-gray-500">Nenhum banner. Adicione o primeiro acima.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
