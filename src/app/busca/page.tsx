import type { Metadata } from "next";
import { searchProducts } from "@/lib/data/products";
import { ProductListing } from "@/components/product/product-listing";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Busca",
  robots: { index: false },
};

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-600">Início</Link> <span aria-hidden>›</span>{" "}
        <span className="font-bold text-ink dark:text-white">Busca</span>
      </nav>

      <h1 className="font-display mb-2 text-3xl font-extrabold md:text-4xl">
        Resultados para “{q}”
      </h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        {results.length === 0
          ? "Nenhum produto encontrado. Que tal explorar as categorias?"
          : `Encontramos ${results.length} ${results.length === 1 ? "produto" : "produtos"} para você.`}
      </p>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-[2rem] border-2 border-dashed border-gray-200 py-20 text-center dark:border-white/15">
          <span className="text-7xl" aria-hidden>🐕‍🦺</span>
          <div>
            <p className="font-display text-2xl font-extrabold">Farejamos por todo lado...</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Não achamos nada com esse nome. Tente outra palavra ou navegue pelas categorias.
            </p>
          </div>
          <Link
            href="/produtos"
            className="rounded-full bg-brand-500 px-8 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-600 hover:shadow-lift"
          >
            Ver todos os produtos
          </Link>
        </div>
      ) : (
        <ProductListing products={results} />
      )}
    </div>
  );
}
