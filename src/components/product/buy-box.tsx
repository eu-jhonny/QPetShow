"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useToast } from "@/components/providers/toast-provider";

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const favorite = isFavorite(product.id);

  function add() {
    addItem(product, quantity);
    toast(`${quantity}x adicionado ao carrinho 🛒`);
  }

  function buyNow() {
    addItem(product, quantity);
    router.push("/carrinho");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border-2 border-gray-200 dark:border-white/15">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
            className="flex size-11 items-center justify-center rounded-l-full transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <span className="w-10 text-center text-sm font-extrabold" aria-live="polite">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            aria-label="Aumentar quantidade"
            className="flex size-11 items-center justify-center rounded-r-full transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {product.stock > 10 ? "✅ Em estoque" : `⚠️ Últimas ${product.stock} unidades`}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={buyNow}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-base font-extrabold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-lift active:scale-[0.98]"
        >
          <Zap className="size-5" aria-hidden />
          Comprar agora
        </button>
        <button
          onClick={add}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full border-2 border-brand-500 px-8 text-base font-extrabold text-brand-600 transition-all hover:bg-brand-50 active:scale-[0.98] dark:text-brand-300 dark:hover:bg-brand-950"
        >
          <ShoppingCart className="size-5" aria-hidden />
          Adicionar
        </button>
        <button
          onClick={() => {
            toggleFavorite(product.id);
            toast(favorite ? "Removido dos favoritos" : "Adicionado aos favoritos ❤️", "info");
          }}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorite}
          className="flex size-13 shrink-0 items-center justify-center self-center rounded-full border-2 border-gray-200 transition-all hover:scale-105 hover:border-fire-300 dark:border-white/15"
        >
          <Heart className={cn("size-5", favorite ? "fill-fire-500 text-fire-500" : "text-gray-400")} aria-hidden />
        </button>
      </div>
    </div>
  );
}
