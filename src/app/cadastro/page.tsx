"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/validators";
import { useToast } from "@/components/providers/toast-provider";

type Fields = "name" | "email" | "password" | "confirmPassword" | "consent";

export default function CadastroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", consent: false });
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Fields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não foi possível criar a conta");
      toast("Conta criada com sucesso! Bem-vindo(a) 🎉");
      router.push("/conta");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao cadastrar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Criar conta" subtitle="Rápido, grátis e cheio de vantagens 🎁">
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nome completo"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          hint="Mínimo 8 caracteres, com maiúscula, minúscula e número"
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />
        <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-0.5 size-4 shrink-0 accent-brand-500"
          />
          <span>
            Li e aceito os <Link href="/politicas" className="font-bold text-brand-600 underline dark:text-brand-300">termos de uso e a política de privacidade</Link>, conforme a LGPD.
          </span>
        </label>
        {errors.consent && <p role="alert" className="text-xs font-semibold text-fire-600">{errors.consent}</p>}
        <Button type="submit" size="lg" loading={loading}>Criar minha conta</Button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Já tem conta?{" "}
        <Link href="/login" className="font-extrabold text-brand-600 hover:underline dark:text-brand-300">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
