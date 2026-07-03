"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "@/lib/validators";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
    } finally {
      // Sempre mostra sucesso para não revelar se o e-mail existe (proteção contra enumeração)
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <AuthCard title="Recuperar senha" subtitle="Vamos te ajudar a voltar 🔑">
      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-5xl" aria-hidden>📬</span>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Se existir uma conta com <strong>{email}</strong>, você receberá um link de redefinição de senha em instantes. Verifique também a caixa de spam.
          </p>
          <Link href="/login" className="font-extrabold text-brand-600 hover:underline dark:text-brand-300">
            Voltar para o login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <Input
              label="E-mail cadastrado"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <Button type="submit" size="lg" loading={loading}>Enviar link de recuperação</Button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Lembrou a senha?{" "}
            <Link href="/login" className="font-extrabold text-brand-600 hover:underline dark:text-brand-300">
              Entrar
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
