"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Landmark, QrCode, Lock, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { checkoutAddressSchema, type CheckoutAddressInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatBRL, cn } from "@/lib/utils";
import { storeInfo } from "@/lib/data/site";

const steps = [
  { id: 1, label: "Entrega" },
  { id: 2, label: "Pagamento" },
  { id: 3, label: "Confirmação" },
];

type PaymentMethod = "pix" | "cartao" | "boleto";

const emptyAddress: CheckoutAddressInput = {
  fullName: "", cep: "", street: "", number: "", complement: "",
  neighborhood: "", city: "", state: "", phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<CheckoutAddressInput>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddressInput, string>>>({});
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [placing, setPlacing] = useState(false);
  const [result, setResult] = useState<{
    code: string;
    status: string;
    pixQrCode?: string;
    boletoBarcode?: string;
  } | null>(null);

  const freeShipping = subtotal >= storeInfo.freeShippingMin;
  const shipping = freeShipping ? 0 : 19.9;
  const pixDiscount = payment === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - pixDiscount;

  if (hydrated && items.length === 0 && step < 3) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5" aria-hidden>
          <ShoppingBag className="size-10" />
        </span>
        <h1 className="font-display text-3xl font-extrabold">Nada por aqui ainda</h1>
        <p className="text-gray-500 dark:text-gray-400">Adicione produtos ao carrinho para finalizar a compra.</p>
        <Link href="/produtos" className="rounded-full bg-brand-500 px-8 py-3.5 font-extrabold text-white shadow-soft transition hover:bg-brand-600">
          Ver produtos
        </Link>
      </div>
    );
  }

  function set<K extends keyof CheckoutAddressInput>(key: K, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateAddress() {
    const parsed = checkoutAddressSchema.safeParse(address);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: typeof errors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CheckoutAddressInput;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  }

  async function placeOrder() {
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          address,
          paymentMethod: payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não foi possível concluir o pedido");
      setResult({
        code: data.order.code,
        status: data.order.status,
        pixQrCode: data.payment?.pixQrCode,
        boletoBarcode: data.payment?.boletoBarcode,
      });
      setStep(3);
      clear();
      toast("Pedido realizado com sucesso! 🎉");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro ao finalizar o pedido", "error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Indicador de etapas */}
      <nav aria-label="Etapas do checkout" className="mb-10">
        <ol className="flex items-center justify-center gap-2 md:gap-4">
          {steps.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300",
                    step > s.id
                      ? "bg-brand-500 text-white"
                      : step === s.id
                        ? "bg-brand-500 text-white ring-4 ring-brand-200 dark:ring-brand-900"
                        : "bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400"
                  )}
                  aria-current={step === s.id ? "step" : undefined}
                >
                  {step > s.id ? <Check className="size-4" aria-hidden /> : s.id}
                </span>
                <span className={cn("hidden text-sm font-bold sm:block", step >= s.id ? "text-ink dark:text-white" : "text-gray-400")}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span className={cn("h-0.5 w-8 rounded-full md:w-16", step > s.id ? "bg-brand-500" : "bg-gray-200 dark:bg-white/10")} aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        {/* Etapa 1 — Endereço */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="grid gap-8 lg:grid-cols-3"
          >
            <form
              className="flex flex-col gap-4 lg:col-span-2"
              onSubmit={(e) => { e.preventDefault(); if (validateAddress()) setStep(2); }}
              noValidate
            >
              <h1 className="font-display text-2xl font-extrabold">Endereço de entrega</h1>
              <Input label="Nome completo" value={address.fullName} onChange={(e) => set("fullName", e.target.value)} error={errors.fullName} autoComplete="name" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="CEP" value={address.cep} onChange={(e) => set("cep", e.target.value)} error={errors.cep} placeholder="00000-000" autoComplete="postal-code" inputMode="numeric" />
                <Input label="Telefone" value={address.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} placeholder="(11) 99999-9999" autoComplete="tel" inputMode="tel" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input label="Rua" value={address.street} onChange={(e) => set("street", e.target.value)} error={errors.street} autoComplete="address-line1" />
                </div>
                <Input label="Número" value={address.number} onChange={(e) => set("number", e.target.value)} error={errors.number} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Complemento (opcional)" value={address.complement ?? ""} onChange={(e) => set("complement", e.target.value)} />
                <Input label="Bairro" value={address.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} error={errors.neighborhood} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input label="Cidade" value={address.city} onChange={(e) => set("city", e.target.value)} error={errors.city} autoComplete="address-level2" />
                </div>
                <Input label="UF" value={address.state} onChange={(e) => set("state", e.target.value.toUpperCase())} error={errors.state} maxLength={2} placeholder="SP" />
              </div>
              <Button type="submit" size="lg" className="mt-2">Continuar para pagamento →</Button>
            </form>
            <OrderSummary subtotal={subtotal} shipping={shipping} pixDiscount={0} total={subtotal + shipping} itemsCount={items.length} />
          </motion.div>
        )}

        {/* Etapa 2 — Pagamento */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="grid gap-8 lg:grid-cols-3"
          >
            <div className="flex flex-col gap-4 lg:col-span-2">
              <button onClick={() => setStep(1)} className="flex w-fit items-center gap-1 text-sm font-bold text-gray-500 hover:text-brand-600">
                <ArrowLeft className="size-4" aria-hidden /> Voltar
              </button>
              <h1 className="font-display text-2xl font-extrabold">Forma de pagamento</h1>

              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Forma de pagamento">
                {[
                  { key: "pix" as const, icon: QrCode, title: "PIX", desc: "Aprovação imediata · 5% de desconto", highlight: "5% OFF" },
                  { key: "cartao" as const, icon: CreditCard, title: "Cartão de crédito", desc: "Em até 3x sem juros" },
                  { key: "boleto" as const, icon: Landmark, title: "Boleto bancário", desc: "Compensação em até 2 dias úteis" },
                ].map(({ key, icon: Icon, title, desc, highlight }) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={payment === key}
                    onClick={() => setPayment(key)}
                    className={cn(
                      "flex items-center gap-4 rounded-3xl border-2 p-5 text-left transition-all",
                      payment === key
                        ? "border-brand-500 bg-brand-50 shadow-soft dark:bg-brand-950"
                        : "border-gray-200 hover:border-brand-300 dark:border-white/15"
                    )}
                  >
                    <span className={cn("flex size-12 items-center justify-center rounded-2xl", payment === key ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-white/10")}>
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-extrabold">
                        {title}
                        {highlight && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-extrabold text-white">{highlight}</span>}
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">{desc}</span>
                    </span>
                    <span className={cn("size-5 rounded-full border-2", payment === key ? "border-brand-500 bg-brand-500 ring-2 ring-inset ring-white" : "border-gray-300")} aria-hidden />
                  </button>
                ))}
              </div>

              {payment === "cartao" && (
                <div className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
                  <Input label="Número do cartão" placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="cc-number" />
                  <Input label="Nome impresso no cartão" autoComplete="cc-name" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Validade" placeholder="MM/AA" autoComplete="cc-exp" />
                    <Input label="CVV" placeholder="123" maxLength={4} inputMode="numeric" autoComplete="cc-csc" />
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Lock className="size-3.5" aria-hidden /> Seus dados de cartão são criptografados e nunca armazenados.
                  </p>
                </div>
              )}

              <Button size="lg" loading={placing} onClick={placeOrder} className="mt-2">
                {placing ? "Processando pagamento..." : `Pagar ${formatBRL(total)}`}
              </Button>
            </div>
            <OrderSummary subtotal={subtotal} shipping={shipping} pixDiscount={pixDiscount} total={total} itemsCount={items.length} />
          </motion.div>
        )}

        {/* Etapa 3 — Confirmação */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex max-w-lg flex-col items-center gap-6 py-10 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="flex size-24 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
              aria-hidden
            >
              <Check className="size-12" strokeWidth={3} />
            </motion.span>
            <div>
              <h1 className="font-display text-3xl font-extrabold">
                {payment === "cartao" ? "Pagamento aprovado!" : "Pedido recebido!"}
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Pedido <strong className="text-ink dark:text-white">#{result?.code}</strong> registrado.
                Enviamos a confirmação e o acompanhamento para o seu e-mail.
              </p>
            </div>

            {/* Instruções de pagamento PIX */}
            {result?.pixQrCode && (
              <div className="w-full rounded-3xl border-2 border-brand-200 bg-brand-50 p-6 text-left dark:border-brand-800 dark:bg-brand-950/40">
                <p className="flex items-center gap-2 font-extrabold text-brand-700 dark:text-brand-300">
                  <QrCode className="size-5" aria-hidden /> Pague com PIX para liberar o envio
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Copie o código abaixo e cole no app do seu banco:</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-xl bg-white px-3 py-2.5 text-xs font-mono dark:bg-black/30">{result.pixQrCode}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(result.pixQrCode!); toast("Código PIX copiado!"); }}
                    className="shrink-0 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-600"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            {/* Instruções de boleto */}
            {result?.boletoBarcode && (
              <div className="w-full rounded-3xl border-2 border-sun-300 bg-sun-50 p-6 text-left dark:border-sun-700 dark:bg-sun-900/20">
                <p className="flex items-center gap-2 font-extrabold text-sun-800 dark:text-sun-300">
                  <Landmark className="size-5" aria-hidden /> Boleto gerado
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Linha digitável (vence em 2 dias úteis):</p>
                <code className="mt-2 block break-all rounded-xl bg-white px-3 py-2.5 text-xs font-mono dark:bg-black/30">{result.boletoBarcode}</code>
              </div>
            )}
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Link href="/conta/pedidos" className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-brand-500 font-extrabold text-brand-600 transition hover:bg-brand-50 dark:text-brand-300">
                Acompanhar pedido
              </Link>
              <Link href="/produtos" className="flex h-12 flex-1 items-center justify-center rounded-full bg-brand-500 font-extrabold text-white shadow-soft transition hover:bg-brand-600">
                Continuar comprando
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderSummary({
  subtotal, shipping, pixDiscount, total, itemsCount,
}: {
  subtotal: number; shipping: number; pixDiscount: number; total: number; itemsCount: number;
}) {
  return (
    <aside className="h-fit rounded-3xl border border-black/5 bg-white p-6 shadow-soft lg:sticky lg:top-40 dark:border-white/10 dark:bg-white/5" aria-label="Resumo do pedido">
      <h2 className="font-display text-lg font-extrabold">Resumo do pedido</h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500 dark:text-gray-400">Itens ({itemsCount})</dt>
          <dd className="font-bold">{formatBRL(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500 dark:text-gray-400">Frete</dt>
          <dd className="font-bold">{shipping === 0 ? <span className="text-brand-600 dark:text-brand-300">Grátis</span> : formatBRL(shipping)}</dd>
        </div>
        {pixDiscount > 0 && (
          <div className="flex justify-between text-brand-600 dark:text-brand-300">
            <dt>Desconto PIX (5%)</dt>
            <dd className="font-bold">-{formatBRL(pixDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-black/5 pt-3 dark:border-white/10">
          <dt className="font-extrabold">Total</dt>
          <dd className="font-display text-xl font-extrabold text-brand-600 dark:text-brand-300">{formatBRL(total)}</dd>
        </div>
      </dl>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <Lock className="size-3" aria-hidden /> Ambiente seguro com criptografia SSL
      </p>
    </aside>
  );
}
