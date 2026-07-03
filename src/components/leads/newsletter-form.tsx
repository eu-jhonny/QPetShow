"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { emailSchema } from "@/lib/validators";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  source,
  compact = false,
  onSuccess,
  className,
}: {
  source: "popup" | "footer" | "home" | "checkout";
  compact?: boolean;
  onSuccess?: () => void;
  className?: string;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    if (!consent) {
      setError("Aceite a política de privacidade para continuar");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, source, consent: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao cadastrar");
      setDone(true);
      setEmail("");
      toast("Cadastro realizado! Confira seu e-mail 💌");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={cn("flex items-center gap-3 rounded-2xl bg-brand-50 p-4 dark:bg-brand-950", className)}>
        <span className="text-2xl" aria-hidden>🎉</span>
        <p className="text-sm font-bold text-brand-700 dark:text-brand-200">
          Pronto! Seu cupom de boas-vindas chega em instantes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("flex flex-col gap-2.5", className)} aria-label="Cadastro na newsletter">
      <div className={cn("flex gap-2", compact && "flex-col sm:flex-row")}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          aria-label="E-mail para newsletter"
          aria-invalid={!!error}
          className="h-12 flex-1 rounded-full border-2 border-gray-200 bg-white px-5 text-sm font-medium transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-bold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-lift active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Enviando..." : (<><Send className="size-4" aria-hidden /> Quero!</>)}
        </button>
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-brand-500"
        />
        Aceito receber e-mails e concordo com a{" "}
        <a href="/politicas" className="font-bold text-brand-600 underline dark:text-brand-300">política de privacidade</a>
      </label>
      {error && (
        <p role="alert" className="text-xs font-semibold text-fire-600 dark:text-fire-400">{error}</p>
      )}
    </form>
  );
}
