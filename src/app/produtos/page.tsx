import type { Metadata } from "next";
import { getCatalog } from "@/lib/server/catalog";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = {
  title: "Todos os produtos",
  description: "Explore rações, antipulgas, sachês, brinquedos e acessórios com os melhores preços.",
};

export const dynamic = "force-dynamic";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const { filtro } = await searchParams;
  const promoOnly = filtro === "promocao";
  const products = await getCatalog();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <a href="/" className="hover:text-brand-600">Início</a> <span aria-hidden>›</span>{" "}
        <span className="font-bold text-ink dark:text-white">Produtos</span>
      </nav>
      <h1 className="font-display mb-8 text-3xl font-extrabold md:text-4xl">
        {promoOnly ? "Ofertas e promoções" : "Todos os produtos"}
      </h1>
      <ProductListing products={products} initialPromoOnly={promoOnly} />
    </div>
  );
}
