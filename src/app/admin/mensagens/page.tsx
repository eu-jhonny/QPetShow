"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Mail, Phone, Check } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: "aberta" | "respondida";
  createdAt: string;
}

export default function AdminMensagensPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (res.ok) setMessages(data.messages);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markAnswered(m: Message) {
    await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, status: "respondida" }) });
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: "respondida" } : x)));
    toast("Marcada como respondida");
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold">Mensagens</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{messages.length} mensagens de contato</p>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <MessageSquare className="size-10 text-gray-300" aria-hidden />
          <p className="font-bold">Nenhuma mensagem ainda</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">As mensagens do formulário de contato aparecem aqui.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <article key={m.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-extrabold">{m.subject}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Mail className="size-3.5" aria-hidden /> {m.email}</span>
                    {m.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" aria-hidden /> {m.phone}</span>}
                    <span>{new Date(m.createdAt).toLocaleString("pt-BR")}</span>
                  </p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-[11px] font-extrabold", m.status === "respondida" ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300" : "bg-sun-100 text-sun-800 dark:bg-sun-900/40 dark:text-sun-300")}>
                  {m.status === "respondida" ? "Respondida" : "Aberta"}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-200">
                {m.message}
              </p>
              <div className="mt-3 flex gap-2">
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-brand-600">
                  <Mail className="size-3.5" aria-hidden /> Responder por e-mail
                </a>
                {m.status !== "respondida" && (
                  <button onClick={() => markAnswered(m)} className="inline-flex items-center gap-1.5 rounded-full border-2 border-gray-200 px-4 py-2 text-xs font-bold transition hover:border-brand-400 dark:border-white/15">
                    <Check className="size-3.5" aria-hidden /> Marcar respondida
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
