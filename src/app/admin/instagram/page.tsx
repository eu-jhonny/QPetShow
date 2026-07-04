"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Camera as InstaIcon, ImagePlus, Trash2, Upload, Link2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Photo { id: string; image: string; href: string; order: number; }

export default function AdminInstagramPage() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image: "", href: "https://instagram.com/qpetshop.oficial" });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/instagram");
      const data = await res.json();
      if (res.ok) setPhotos(data.photos);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload?folder=instagram", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, image: data.url }));
      toast("Imagem enviada!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro no upload", "error");
    } finally { setUploading(false); }
  }

  async function add() {
    if (!form.image) { toast("Envie ou cole uma imagem", "error"); return; }
    const res = await fetch("/api/admin/instagram", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { toast(data.error, "error"); return; }
    toast("Foto adicionada!");
    setForm({ image: "", href: "https://instagram.com/qpetshop.oficial" });
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remover esta foto?")) return;
    await fetch(`/api/admin/instagram?id=${id}`, { method: "DELETE" });
    toast("Foto removida"); load();
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold">Instagram</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fotos oficiais exibidas na página inicial (seção “Siga @qpetshop.oficial”).</p>
      </header>

      <section className="mb-8 rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold"><InstaIcon className="size-5 text-brand-500" aria-hidden /> Adicionar foto</h2>
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-brand-400 hover:text-brand-500 disabled:opacity-60 dark:border-white/15">
              {form.image ? (
                <Image src={form.image} alt="Prévia" width={160} height={160} className="size-full rounded-xl object-cover" />
              ) : uploading ? (
                <Upload className="size-6 animate-pulse" aria-hidden />
              ) : (
                <><ImagePlus className="size-6" aria-hidden /><span className="text-xs font-bold">Escolher foto</span></>
              )}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-bold">Ou cole a URL da imagem</span>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="h-11 w-full rounded-xl border-2 border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5" />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-bold">Link ao clicar (post ou perfil)</span>
              <input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="h-11 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5" />
            </label>
            <button onClick={add} className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-extrabold text-white transition hover:bg-brand-600">
              <ImagePlus className="size-4" aria-hidden /> Adicionar
            </button>
            <p className="text-[11px] text-gray-400">Dica: salve a foto do seu post no Instagram e envie aqui. Ideal quadrada (1080×1080).</p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-gray-200 py-12 text-center dark:border-white/15">
          <InstaIcon className="size-8 text-gray-300" aria-hidden />
          <p className="text-sm text-gray-500">Nenhuma foto ainda. Adicione as fotos oficiais acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-2xl">
              <Image src={p.image} alt="" fill sizes="160px" className="object-cover" />
              <button onClick={() => remove(p.id)} aria-label="Remover" className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
