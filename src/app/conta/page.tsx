import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Percent, Gift, Package, Wallet, Clock, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/server/auth";
import { listOrdersByUser, listOrdersByEmail } from "@/lib/server/orders";
import { formatBRL } from "@/lib/utils";
import { ProfileCard } from "@/components/account/profile-card";
import { AddressBook } from "@/components/account/address-book";

export const metadata: Metadata = { title: "Minha conta", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const session = await getSession();

  const byUser = session ? await listOrdersByUser(session.sub) : [];
  const byEmail = session ? await listOrdersByEmail(session.email) : [];
  const orders = Array.from(new Map(byUser.concat(byEmail).map((o) => [o.id, o])).values());
  const spent = orders
    .filter((o) => o.status !== "cancelado" && o.status !== "pendente")
    .reduce((acc, o) => acc + o.total, 0);
  const lastOrder = orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

  const firstName = session?.name?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Olá, {firstName}!</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Gerencie seus dados, pedidos e favoritos por aqui.</p>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300"><Package className="size-5" aria-hidden /></span>
          <p className="font-display mt-3 text-2xl font-extrabold">{orders.length}</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">pedidos realizados</p>
        </div>
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-sun-100 text-sun-700 dark:bg-sun-900/40 dark:text-sun-300"><Wallet className="size-5" aria-hidden /></span>
          <p className="font-display mt-3 text-2xl font-extrabold">{formatBRL(spent)}</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">total em compras</p>
        </div>
        <Link href="/conta/pedidos" className="group flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-5 shadow-soft transition hover:shadow-lift dark:border-white/10 dark:bg-white/5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"><Clock className="size-5" aria-hidden /></span>
          <div className="mt-3">
            <p className="text-sm font-extrabold">{lastOrder ? `Pedido #${lastOrder.code}` : "Nenhum pedido"}</p>
            <p className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-300">
              Ver pedidos <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden />
            </p>
          </div>
        </Link>
      </div>

      <ProfileCard />

      <AddressBook />

      <section className="rounded-3xl border border-black/5 bg-gradient-to-br from-brand-50 to-sun-50 p-6 dark:border-white/10 dark:from-brand-950 dark:to-brand-900" aria-labelledby="beneficios">
        <h2 id="beneficios" className="font-display text-xl font-extrabold">Seus benefícios</h2>
        <ul className="mt-3 grid gap-3 text-sm font-semibold sm:grid-cols-3">
          <li className="flex items-center gap-2 rounded-2xl bg-white/80 p-4 dark:bg-black/20"><Truck className="size-5 text-brand-500" aria-hidden /> Frete grátis acima de R$ 199</li>
          <li className="flex items-center gap-2 rounded-2xl bg-white/80 p-4 dark:bg-black/20"><Percent className="size-5 text-brand-500" aria-hidden /> 5% OFF no PIX</li>
          <li className="flex items-center gap-2 rounded-2xl bg-white/80 p-4 dark:bg-black/20"><Gift className="size-5 text-brand-500" aria-hidden /> Cupom no mês do seu pet</li>
        </ul>
      </section>
    </div>
  );
}
