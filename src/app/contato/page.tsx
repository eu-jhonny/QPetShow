"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { useToast } from "@/components/providers/toast-provider";
import { storeInfo } from "@/lib/data/site";

const empty: ContactInput = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContatoPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function set<K extends keyof ContactInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao enviar mensagem");
      }
      setSent(true);
      toast("Mensagem enviada! Responderemos em breve 💬");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao enviar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-display text-4xl font-extrabold">Fale com a gente 💬</h1>
        <p className="mx-auto mt-2 max-w-xl text-gray-500 dark:text-gray-400">
          Dúvidas, sugestões ou precisa de ajuda com um pedido? Nossa equipe responde rapidinho.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {[
            { icon: MessageCircle, title: "WhatsApp", text: storeInfo.whatsapp, extra: "Atendimento imediato" },
            { icon: Mail, title: "E-mail", text: storeInfo.email, extra: "Resposta em até 24h" },
            { icon: MapPin, title: "Loja física", text: storeInfo.address, extra: "Venha nos visitar!" },
            { icon: Clock, title: "Horário", text: "Seg a Sáb, 8h às 19h", extra: "Domingos: 9h às 13h" },
          ].map(({ icon: Icon, title, text, extra }) => (
            <div key={title} className="flex items-start gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-extrabold">{title}</h2>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{text}</p>
                <p className="text-xs text-gray-400">{extra}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft lg:col-span-3 dark:border-white/10 dark:bg-white/5">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
              <span className="text-6xl" aria-hidden>💌</span>
              <h2 className="font-display text-2xl font-extrabold">Mensagem recebida!</h2>
              <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Obrigado pelo contato. Nossa equipe responderá no e-mail informado em até 24 horas úteis.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nome" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} autoComplete="name" />
                <Input label="E-mail" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Telefone (opcional)" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} error={errors.phone} placeholder="(11) 99999-9999" autoComplete="tel" />
                <Input label="Assunto" value={form.subject} onChange={(e) => set("subject", e.target.value)} error={errors.subject} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="mensagem" className="text-sm font-bold">Mensagem</label>
                <textarea
                  id="mensagem"
                  rows={5}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 text-sm font-medium transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5"
                  placeholder="Como podemos ajudar você e seu pet?"
                />
                {errors.message && <p role="alert" className="text-xs font-semibold text-fire-600">{errors.message}</p>}
              </div>
              <Button type="submit" size="lg" loading={loading}>Enviar mensagem</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
