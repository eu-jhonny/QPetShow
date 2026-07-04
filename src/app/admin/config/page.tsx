"use client";

import { useEffect, useState } from "react";
import { Save, Store, Mail, Truck } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Settings {
  name: string; slogan: string; whatsapp: string; email: string; address: string;
  instagram: string; instagramUrl: string; freeShippingMin: number; emailFrom: string; emailAdmin: string;
}

export default function AdminConfigPage() {
  const { toast } = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setS(d.settings));
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, freeShippingMin: Number(s.freeShippingMin) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast("Configurações salvas!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao salvar", "error");
    } finally { setSaving(false); }
  }

  if (!s) return <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>;

  const set = (k: keyof Settings, v: string | number) => setS({ ...s, [k]: v });

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Dados da loja usados no site e nos e-mails.</p>
      </header>

      <div className="flex max-w-2xl flex-col gap-6">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold"><Store className="size-5 text-brand-500" aria-hidden /> Loja</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome"><input value={s.name} onChange={(e) => set("name", e.target.value)} className={inp} /></Field>
            <Field label="Slogan"><input value={s.slogan} onChange={(e) => set("slogan", e.target.value)} className={inp} /></Field>
            <Field label="WhatsApp"><input value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inp} /></Field>
            <Field label="E-mail de contato"><input value={s.email} onChange={(e) => set("email", e.target.value)} className={inp} /></Field>
            <div className="sm:col-span-2"><Field label="Endereço"><input value={s.address} onChange={(e) => set("address", e.target.value)} className={inp} /></Field></div>
            <Field label="Instagram (@)"><input value={s.instagram} onChange={(e) => set("instagram", e.target.value)} className={inp} /></Field>
            <Field label="URL do Instagram"><input value={s.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inp} /></Field>
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold"><Truck className="size-5 text-brand-500" aria-hidden /> Frete</h2>
          <Field label="Frete grátis a partir de (R$)">
            <input type="number" value={s.freeShippingMin} onChange={(e) => set("freeShippingMin", e.target.value)} className={inp} />
          </Field>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold"><Mail className="size-5 text-brand-500" aria-hidden /> E-mails</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Remetente (EMAIL_FROM)"><input value={s.emailFrom} onChange={(e) => set("emailFrom", e.target.value)} className={inp} /></Field>
            <Field label="Recebe avisos (admin)"><input value={s.emailAdmin} onChange={(e) => set("emailAdmin", e.target.value)} className={inp} /></Field>
          </div>
          <p className="mt-2 text-xs text-gray-400">Para enviar e-mails a clientes reais, verifique um domínio no Resend e use um remetente do seu domínio (ver GUIA-PRODUCAO.md).</p>
        </section>

        <button onClick={save} disabled={saving} className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-brand-500 px-8 text-sm font-extrabold text-white transition hover:bg-brand-600 disabled:opacity-60">
          <Save className="size-4" aria-hidden /> {saving ? "Salvando…" : "Salvar configurações"}
        </button>
      </div>
    </div>
  );
}

const inp = "h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1 text-sm"><span className="font-bold">{label}</span>{children}</label>;
}
