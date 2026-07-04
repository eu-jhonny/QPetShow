"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Save, Pencil, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

interface Profile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export function ProfileCard() {
  const { toast } = useToast();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/conta/perfil").then((r) => r.json()).then((d) => {
      if (d.user) { setProfile(d.user); setForm({ name: d.user.name, phone: d.user.phone ?? "" }); }
    });
  }, []);

  async function uploadAvatar(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/conta/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile((p) => (p ? { ...p, avatar: data.url } : p));
      toast("Foto atualizada!");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro no upload", "error");
    } finally { setUploading(false); }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/conta/perfil", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.user);
      setEditing(false);
      toast("Perfil atualizado!");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao salvar", "error");
    } finally { setSaving(false); }
  }

  if (!profile) return <div className="skeleton h-44 rounded-3xl" />;

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative">
          <div className="size-20 overflow-hidden rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center text-2xl font-extrabold text-white">{profile.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label="Trocar foto"
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft transition hover:bg-brand-600 disabled:opacity-60"
          >
            <Camera className={cn("size-4", uploading && "animate-pulse")} aria-hidden />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex flex-col gap-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="h-10 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefone (11) 90000-0000" className="h-10 rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5" />
              <div className="flex gap-2">
                <button onClick={save} disabled={saving} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-500 px-4 text-xs font-extrabold text-white transition hover:bg-brand-600 disabled:opacity-60">
                  <Save className="size-3.5" aria-hidden /> Salvar
                </button>
                <button onClick={() => { setEditing(false); setForm({ name: profile.name, phone: profile.phone ?? "" }); }} className="rounded-full px-4 text-xs font-bold text-gray-500">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-display text-xl font-extrabold">{profile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
              {profile.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{profile.phone}</p>}
              <button onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1.5 rounded-full border-2 border-gray-200 px-4 py-1.5 text-xs font-bold transition hover:border-brand-400 dark:border-white/15">
                <Pencil className="size-3.5" aria-hidden /> Editar dados
              </button>
            </>
          )}
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="size-4" aria-hidden /> Seus dados são protegidos conforme a LGPD.
      </p>
    </section>
  );
}
