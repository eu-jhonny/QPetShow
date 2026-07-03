"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validators";
import { useToast } from "@/components/providers/toast-provider";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não foi possível entrar");
      toast(`Bem-vindo(a) de volta! 🐾`);
      router.push("/conta");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao entrar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Entrar na conta" subtitle="Que bom te ver de novo! 🐾">
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <Link href="/recuperar-senha" className="-mt-1 self-end text-xs font-bold text-brand-600 hover:underline dark:text-brand-300">
          Esqueci minha senha
        </Link>
        <Button type="submit" size="lg" loading={loading}>Entrar</Button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-extrabold text-brand-600 hover:underline dark:text-brand-300">
          Cadastre-se grátis
        </Link>
      </p>
    </AuthCard>
  );
}
