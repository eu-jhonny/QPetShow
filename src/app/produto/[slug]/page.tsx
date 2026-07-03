import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { products, getProduct, getProductsByCategory } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { formatBRL, discountPercent, installments } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductImage } from "@/components/product/product-image";
import { BuyBox } from "@/components/product/buy-box";
import { ProductCarousel } from "@/components/home/product-carousel";
import { SectionHeading } from "@/components/ui/section-heading";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id);
  const discount = discountPercent(product.price, product.oldPrice);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.id,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-600">Início</Link> <span aria-hidden>›</span>{" "}
        {category && (
          <>
            <Link href={`/categorias/${category.slug}`} className="hover:text-brand-600">{category.name}</Link>{" "}
            <span aria-hidden>›</span>{" "}
          </>
        )}
        <span className="line-clamp-1 inline font-bold text-ink dark:text-white">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galeria */}
        <div className="relative">
          <div className="sticky top-40">
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
              {product.badge && <Badge variant={product.badge} />}
              {discount > 0 && <Badge variant="promo">-{discount}%</Badge>}
            </div>
            <ProductImage product={product} className="aspect-square w-full rounded-[2rem] shadow-soft" emojiClassName="text-[10rem]" priority />
          </div>
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-300">
              {product.brand}
            </span>
            <h1 className="font-display mt-1 text-2xl font-extrabold leading-tight md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {product.rating} · {product.reviews} avaliações
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
            {product.oldPrice && (
              <p className="text-sm font-semibold text-gray-400">
                De <span className="line-through">{formatBRL(product.oldPrice)}</span> por:
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-brand-600 dark:text-brand-300">
                {formatBRL(product.price)}
              </span>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-300">no PIX</span>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              ou {installments(product.price)} no cartão
            </p>
            <div className="mt-5">
              <BuyBox product={product} />
            </div>
          </div>

          {/* Benefícios */}
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { icon: Truck, text: "Frete grátis acima de R$ 199" },
              { icon: ShieldCheck, text: "Compra 100% segura" },
              { icon: RotateCcw, text: "Troca fácil em 7 dias" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-xs font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                <Icon className="size-4 shrink-0 text-brand-600 dark:text-brand-300" aria-hidden />
                {text}
              </li>
            ))}
          </ul>

          {/* Descrição */}
          <section aria-labelledby="descricao">
            <h2 id="descricao" className="font-display text-xl font-extrabold">Sobre o produto</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base dark:text-gray-300">
              {product.description}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 shrink-0 text-brand-500" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="pt-20" aria-labelledby="relacionados">
          <SectionHeading
            eyebrow="Você também pode gostar"
            title="Produtos relacionados"
            href={category ? `/categorias/${category.slug}` : "/produtos"}
          />
          <ProductCarousel products={related} autoScroll={false} />
        </section>
      )}
    </div>
  );
}
