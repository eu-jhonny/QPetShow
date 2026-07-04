"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, TicketPercent, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ProductImage } from "@/components/product/product-image";
import { formatBRL } from "@/lib/utils";
import { storeInfo } from "@/lib/data/site";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarrinhoPage() {
  const { items, subtotal, setQuantity, removeItem, hydrated } = useCart();
  const { toast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const freeShipping = subtotal - discount >= storeInfo.freeShippingMin;
  const shipping = items.length === 0 || freeShipping ? 0 : 19.9;
  const total = subtotal - discount + shipping;
  const missingForFreeShipping = storeInfo.freeShippingMin - (subtotal - discount);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "BEMVINDO10") {
      setAppliedCoupon("BEMVINDO10");
      toast("Cupom aplicado: 10% de desconto 🎉");
    } else {
      toast("Cupom inválido ou expirado", "error");
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {[1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-brand-100 text-brand-500 dark:bg-brand-950 dark:text-brand-300" aria-hidden>
          <ShoppingCart className="size-11" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold">Seu carrinho está vazio</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Que tal encontrar algo especial para o seu pet?
          </p>
        </div>
        <Link
          href="/produtos"
          className="inline-flex h-13 items-center gap-2 rounded-full bg-brand-500 px-8 text-base font-extrabold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-lift"
        >
          Explorar produtos <ArrowRight className="size-5" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display mb-8 text-3xl font-extrabold md:text-4xl">
        Carrinho <span className="text-gray-400 text-xl font-bold">({items.length} {items.length === 1 ? "item" : "itens"})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Itens */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {!freeShipping && missingForFreeShipping > 0 && (
            <div className="rounded-3xl bg-sun-100 p-4 text-sm font-bold text-sun-900 dark:bg-sun-900/30 dark:text-sun-200">
              🚚 Faltam <strong>{formatBRL(missingForFreeShipping)}</strong> para você ganhar <strong>frete grátis</strong>!
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/60 dark:bg-black/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sun-400 to-brand-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, ((subtotal - discount) / storeInfo.freeShippingMin) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {freeShipping && (
            <div className="rounded-3xl bg-brand-100 p-4 text-sm font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
              🎉 Parabéns! Você ganhou <strong>frete grátis</strong> nesta compra.
            </div>
          )}

          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <Link href={`/produto/${product.slug}`} className="shrink-0">
                <ProductImage product={product} className="size-24 md:size-28" iconClassName="size-10" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/produto/${product.slug}`} className="line-clamp-2 text-sm font-bold hover:text-brand-600 md:text-base">
                  {product.name}
                </Link>
                <span className="mt-0.5 text-xs font-semibold text-gray-400">{product.brand}</span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center rounded-full border-2 border-gray-200 dark:border-white/15">
                    <button
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      aria-label="Diminuir quantidade"
                      className="flex size-9 items-center justify-center rounded-l-full transition hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <Minus className="size-3.5" aria-hidden />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      aria-label="Aumentar quantidade"
                      className="flex size-9 items-center justify-center rounded-r-full transition hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <Plus className="size-3.5" aria-hidden />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-extrabold text-brand-600 dark:text-brand-300">
                      {formatBRL(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => { removeItem(product.id); toast("Item removido do carrinho", "info"); }}
                      aria-label={`Remover ${product.name}`}
                      className="rounded-full p-2 text-gray-400 transition hover:bg-fire-50 hover:text-fire-500 dark:hover:bg-fire-900/30"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <aside className="h-fit rounded-3xl border border-black/5 bg-white p-6 shadow-soft lg:sticky lg:top-40 dark:border-white/10 dark:bg-white/5" aria-label="Resumo do pedido">
          <h2 className="font-display text-xl font-extrabold">Resumo</h2>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <TicketPercent className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Cupom (ex: BEMVINDO10)"
                aria-label="Código do cupom"
                className="h-11 w-full rounded-full border-2 border-gray-200 bg-white pl-9 pr-3 text-xs font-bold uppercase focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5"
              />
            </div>
            <button
              onClick={applyCoupon}
              className="h-11 rounded-full bg-ink px-4 text-xs font-extrabold text-white transition hover:bg-black dark:bg-white dark:text-ink"
            >
              Aplicar
            </button>
          </div>

          <dl className="mt-5 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Subtotal</dt>
              <dd className="font-bold">{formatBRL(subtotal)}</dd>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-brand-600 dark:text-brand-300">
                <dt>Cupom {appliedCoupon}</dt>
                <dd className="font-bold">-{formatBRL(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Frete</dt>
              <dd className="font-bold">{shipping === 0 ? <span className="text-brand-600 dark:text-brand-300">Grátis</span> : formatBRL(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-3 text-base dark:border-white/10">
              <dt className="font-extrabold">Total</dt>
              <dd className="font-display text-xl font-extrabold text-brand-600 dark:text-brand-300">{formatBRL(total)}</dd>
            </div>
            <p className="text-xs text-gray-400">ou 3x de {formatBRL(total / 3)} sem juros</p>
          </dl>

          <Link
            href="/checkout"
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-base font-extrabold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-lift active:scale-[0.98]"
          >
            Finalizar compra <ArrowRight className="size-5" aria-hidden />
          </Link>
          <Link
            href="/produtos"
            className="mt-3 block text-center text-sm font-bold text-brand-600 hover:underline dark:text-brand-300"
          >
            Continuar comprando
          </Link>
          <p className="mt-4 text-center text-[11px] text-gray-400">
            🔒 Pagamento 100% seguro · Dados criptografados
          </p>
        </aside>
      </div>
    </div>
  );
}
