"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchProducts, type Product } from "@/lib/data/products";
import { formatBRL, cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/product-image";

export function SearchBar({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const found = searchProducts(query).slice(0, 5);
      setResults(found);
      setOpen(query.trim().length > 1);
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit} role="search" aria-label="Buscar produtos">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && setOpen(true)}
            placeholder="Busque ração, antipulgas, brinquedos..."
            aria-label="Buscar produtos"
            className="h-12 w-full rounded-full border-2 border-gray-200 bg-white pl-12 pr-12 text-sm font-medium transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setOpen(false); }}
              aria-label="Limpar busca"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lift dark:border-white/10 dark:bg-[#12190f]">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <span className="text-3xl" aria-hidden>🔍</span>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Nenhum produto encontrado para “{query}”
              </p>
            </div>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/produto/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-brand-50 dark:hover:bg-white/5"
                  >
                    <ProductImage product={p} className="size-12 shrink-0" emojiClassName="text-2xl" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink dark:text-white">{p.name}</p>
                      <p className="text-xs font-semibold text-brand-600 dark:text-brand-300">{formatBRL(p.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-black/5 dark:border-white/10">
                <button
                  onClick={submit}
                  className="w-full px-4 py-3 text-center text-sm font-bold text-brand-600 transition hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-white/5"
                >
                  Ver todos os resultados →
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
