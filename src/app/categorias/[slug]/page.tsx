import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductListing } from "@/components/product/product-listing";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description}. Compre ${category.name.toLowerCase()} com os melhores preços na QPet Shop.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = getProductsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <a href="/" className="hover:text-brand-600">Início</a> <span aria-hidden>›</span>{" "}
        <a href="/produtos" className="hover:text-brand-600">Produtos</a> <span aria-hidden>›</span>{" "}
        <span className="font-bold text-ink dark:text-white">{category.name}</span>
      </nav>

      <header className={cn("paw-pattern mb-10 flex items-center gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br p-8 shadow-lift md:p-10", category.gradient)}>
        <span className="text-6xl drop-shadow-lg md:text-7xl" aria-hidden>{category.emoji}</span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white drop-shadow md:text-5xl">{category.name}</h1>
          <p className="mt-1 text-sm font-medium text-white/85 md:text-base">{category.description}</p>
        </div>
      </header>

      <ProductListing products={items} showCategoryFilter={false} />
    </div>
  );
}
