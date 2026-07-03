"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { cn, formatBRL, discountPercent, installments } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductImage } from "./product-image";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useToast } from "@/components/providers/toast-provider";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const discount = discountPercent(product.price, product.oldPrice);
  const favorite = isFavorite(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "group relative flex h-full flex-col rounded-3xl border border-black/5 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-1.5">
        {product.badge && <Badge variant={product.badge} />}
        {discount > 0 && <Badge variant="promo">-{discount}%</Badge>}
      </div>

      <button
        onClick={() => {
          toggleFavorite(product.id);
          toast(favorite ? "Removido dos favoritos" : "Adicionado aos favoritos ❤️", "info");
        }}
        aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={favorite}
        className="absolute right-6 top-6 z-10 rounded-full bg-white/90 p-2 shadow-soft transition-all hover:scale-110 dark:bg-black/50"
      >
        <Heart
          className={cn("size-4 transition-colors", favorite ? "fill-fire-500 text-fire-500" : "text-gray-400")}
          aria-hidden
        />
      </button>

      <Link href={`/produto/${product.slug}`} className="flex flex-1 flex-col" tabIndex={-1}>
        <ProductImage product={product} className="aspect-square w-full" />
        <div className="mt-4 flex flex-1 flex-col">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-300">
            {product.brand}
          </span>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
            {product.name}
          </h3>
          <RatingStars rating={product.rating} reviews={product.reviews} className="mt-2" />
          <div className="mt-3">
            {product.oldPrice && (
              <span className="text-xs font-semibold text-gray-400 line-through">
                {formatBRL(product.oldPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-extrabold text-ink dark:text-white">
                {formatBRL(product.price)}
              </span>
              <span className="text-[11px] font-bold text-brand-600 dark:text-brand-300">no PIX</span>
            </div>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              {installments(product.price)}
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => {
          addItem(product);
          toast("Adicionado ao carrinho 🛒");
        }}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:bg-brand-600 hover:shadow-lift active:scale-[0.98]"
      >
        <ShoppingCart className="size-4" aria-hidden />
        Adicionar
      </button>
    </motion.article>
  );
}
