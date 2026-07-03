import type { Metadata } from "next";
import { getSession } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Minha conta",
  robots: { index: false },
};

export default async function ContaPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Olá, {session?.name?.split(" ")[0]}! 🐾</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Gerencie seus dados, pedidos e favoritos por aqui.</p>
      </div>

      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5" aria-labelledby="dados">
        <h2 id="dados" className="font-display text-xl font-extrabold">Dados pessoais</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
            <dt className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Nome</dt>
            <dd className="mt-1 font-bold">{session?.name}</dd>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
            <dt className="text-xs font-extrabold uppercase tracking-widest text-gray-400">E-mail</dt>
            <dd className="mt-1 font-bold">{session?.email}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-gray-400">
          🔒 Seus dados são protegidos conforme a LGPD. Para alterar ou excluir seus dados, fale com nosso suporte.
        </p>
      </section>

      <section className="rounded-3xl border border-black/5 bg-gradient-to-br from-brand-50 to-sun-50 p-6 dark:border-white/10 dark:from-brand-950 dark:to-brand-900" aria-labelledby="beneficios">
        <h2 id="beneficios" className="font-display text-xl font-extrabold">Seus benefícios 🎁</h2>
        <ul className="mt-3 grid gap-3 text-sm font-semibold sm:grid-cols-3">
          <li className="rounded-2xl bg-white/80 p-4 dark:bg-black/20">🚚 Frete grátis acima de R$ 199</li>
          <li className="rounded-2xl bg-white/80 p-4 dark:bg-black/20">💚 5% OFF em todo pagamento via PIX</li>
          <li className="rounded-2xl bg-white/80 p-4 dark:bg-black/20">🎂 Cupom especial no mês do seu pet</li>
        </ul>
      </section>
    </div>
  );
}
