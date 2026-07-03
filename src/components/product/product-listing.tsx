"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { ProductCard } from "./product-card";
import { cn, formatBRL } from "@/lib/utils";

type SortKey = "relevancia" | "menor-preco" | "maior-preco" | "avaliacao" | "descontos";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "relevancia", label: "Relevância" },
  { key: "menor-preco", label: "Menor preço" },
  { key: "maior-preco", label: "Maior preço" },
  { key: "avaliacao", label: "Melhor avaliados" },
  { key: "descontos", label: "Maiores descontos" },
];

const priceRanges = [
  { label: "Até R$ 30", min: 0, max: 30 },
  { label: "R$ 30 a R$ 100", min: 30, max: 100 },
  { label: "R$ 100 a R$ 200", min: 100, max: 200 },
  { label: "Acima de R$ 200", min: 200, max: Infinity },
];

export function ProductListing({
  products,
  showCategoryFilter = true,
  initialPromoOnly = false,
}: {
  products: Product[];
  showCategoryFilter?: boolean;
  initialPromoOnly?: boolean;
}) {
  const [sort, setSort] = useState<SortKey>(initialPromoOnly ? "descontos" : "relevancia");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [promoOnly, setPromoOnly] = useState(initialPromoOnly);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategories.length > 0) list = list.filter((p) => selectedCategories.includes(p.category));
    if (priceRange !== null) {
      const range = priceRanges[priceRange];
      list = list.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (promoOnly) list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);

    switch (sort) {
      case "menor-preco": list.sort((a, b) => a.price - b.price); break;
      case "maior-preco": list.sort((a, b) => b.price - a.price); break;
      case "avaliacao": list.sort((a, b) => b.rating - a.rating); break;
      case "descontos":
        list.sort((a, b) => {
          const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
          const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
          return db - da;
        });
        break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [products, selectedCategories, priceRange, promoOnly, sort]);

  const activeFilters =
    selectedCategories.length + (priceRange !== null ? 1 : 0) + (promoOnly ? 1 : 0);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  const filtersPanel = (
    <div className="flex flex-col gap-6">
      {showCategoryFilter && (
        <fieldset>
          <legend className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Categorias</legend>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <label key={cat.slug} className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="size-4 accent-brand-500"
                />
                {cat.emoji} {cat.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-400">Preço</legend>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range, i) => (
            <label key={range.label} className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
              <input
                type="radio"
                name="preco"
                checked={priceRange === i}
                onChange={() => setPriceRange(priceRange === i ? null : i)}
                onClick={() => priceRange === i && setPriceRange(null)}
                className="size-4 accent-brand-500"
              />
              {range.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-fire-50 p-3 text-sm font-extrabold text-fire-600 dark:bg-fire-900/30 dark:text-fire-300">
        <input
          type="checkbox"
          checked={promoOnly}
          onChange={(e) => setPromoOnly(e.target.checked)}
          className="size-4 accent-fire-500"
        />
        🔥 Somente promoções
      </label>

      {activeFilters > 0 && (
        <button
          onClick={() => { setSelectedCategories([]); setPriceRange(null); setPromoOnly(false); }}
          className="text-sm font-bold text-gray-500 underline transition hover:text-fire-500"
        >
          Limpar filtros ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      {/* Filtros desktop */}
      <aside className="hidden w-56 shrink-0 lg:block" aria-label="Filtros">
        <div className="sticky top-40 rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
          {filtersPanel}
        </div>
      </aside>

      <div className="flex-1">
        {/* Barra de ordenação */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-gray-200 px-4 text-sm font-bold lg:hidden dark:border-white/15"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros {activeFilters > 0 && `(${activeFilters})`}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Ordenar produtos"
              className="h-10 rounded-full border-2 border-gray-200 bg-white px-4 text-sm font-bold focus:border-brand-500 focus:outline-none dark:border-white/15 dark:bg-[#12190f] dark:text-white"
            >
              {sortOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grade */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center dark:border-white/15">
            <span className="text-6xl" aria-hidden>🐾</span>
            <div>
              <p className="font-display text-xl font-extrabold">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tente ajustar os filtros para ver mais opções.</p>
            </div>
            <button
              onClick={() => { setSelectedCategories([]); setPriceRange(null); setPromoOnly(false); }}
              className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Filtros mobile (bottom sheet) */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 pb-24 dark:bg-[#12190f]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold">Filtros</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Fechar filtros"
                className="rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {filtersPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 h-12 w-full rounded-full bg-brand-500 text-sm font-extrabold text-white"
            >
              Ver {filtered.length} produtos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
