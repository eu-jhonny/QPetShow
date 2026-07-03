"use client";

import Link from "next/link";
import { useFavorites } from "@/components/providers/favorites-provider";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function FavoritosPage() {
  const { favorites, hydrated } = useFavorites();
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Favoritos ❤️</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Os produtos que conquistaram você (e seu pet).</p>
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <span className="animate-float text-6xl" aria-hidden>💔</span>
          <div>
            <p className="font-display text-xl font-extrabold">Nenhum favorito ainda</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Toque no coração dos produtos que você ama para salvá-los aqui.
            </p>
          </div>
          <Link href="/produtos" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
