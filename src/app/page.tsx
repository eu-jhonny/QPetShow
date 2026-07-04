import { heroBanners } from "@/lib/data/banners";
import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductCarousel } from "@/components/home/product-carousel";
import { PromoBanners } from "@/components/home/promo-banners";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { Testimonials } from "@/components/home/testimonials";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { NewsletterForm } from "@/components/leads/newsletter-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredProducts, promoProducts, newProducts } from "@/lib/data/products";
import { faqItems, storeInfo } from "@/lib/data/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QPet Shop — Carinho Q faz a diferença",
  description:
    "Loja virtual da QPet Shop: antipulgas com até 25% OFF, areia e tapetes com até 40% OFF, sachês e petiscos, rações premium e muito mais. Frete grátis acima de R$ 199!",
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel banners={heroBanners} />

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 pt-14" aria-labelledby="categorias">
        <SectionHeading
          eyebrow="Navegue por categoria"
          title="O que seu pet precisa hoje?"
          href="/produtos"
        />
        <CategoryGrid />
      </section>

      {/* Mais vendidos */}
      <section className="mx-auto max-w-7xl px-4 pt-16" aria-labelledby="mais-vendidos">
        <SectionHeading
          eyebrow="Favoritos dos tutores"
          title="Mais vendidos"
          subtitle="Os produtos que os pets (e os tutores) mais amam"
          href="/produtos"
        />
        <ProductCarousel products={featuredProducts} />
      </section>

      {/* Banners promocionais */}
      <section className="mx-auto max-w-7xl px-4 pt-16" aria-label="Promoções em destaque">
        <PromoBanners />
      </section>

      {/* Ofertas */}
      <section className="relative mt-16 bg-gradient-to-br from-fire-500 to-fire-700 py-14" aria-labelledby="ofertas">
        <div className="paw-pattern absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur">
                Ofertas do dia
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
                Ofertas imperdíveis
              </h2>
            </div>
            <Link
              href="/produtos?filtro=promocao"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-extrabold text-fire-600 shadow-lift transition hover:scale-105"
            >
              Ver todas →
            </Link>
          </div>
          <ProductCarousel products={promoProducts.slice(0, 10)} />
        </div>
      </section>

      {/* Novidades */}
      <section className="mx-auto max-w-7xl px-4 pt-16" aria-labelledby="novidades">
        <SectionHeading
          eyebrow="Acabou de chegar"
          title="Novidades"
          subtitle="As últimas novidades para deixar seu pet ainda mais feliz"
          href="/produtos?filtro=novidades"
        />
        <ProductCarousel products={newProducts} autoScroll={false} />
      </section>

      {/* Marcas */}
      <section className="mt-16" aria-label="Marcas parceiras">
        <BrandMarquee />
      </section>

      {/* Avaliações */}
      <section className="mx-auto max-w-7xl px-4 pt-16" aria-labelledby="avaliacoes">
        <SectionHeading
          eyebrow="Quem compra, recomenda"
          title="Tutores felizes, pets mais felizes ainda"
          align="center"
        />
        <Testimonials />
      </section>

      {/* Instagram */}
      <section className="mx-auto max-w-7xl px-4 pt-16" aria-labelledby="instagram">
        <SectionHeading
          eyebrow="Instagram"
          title={`Siga ${storeInfo.instagram}`}
          subtitle="Bastidores, dicas e muita fofura na sua timeline"
          align="center"
        />
        <InstagramGrid />
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pt-16" aria-labelledby="newsletter">
        <div className="paw-pattern relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-12 text-center shadow-lift md:px-16">
          <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
            Ganhe <span className="text-sun-300">10% OFF</span> na primeira compra
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85 md:text-base">
            Cadastre-se na nossa newsletter e receba cupons exclusivos, ofertas antecipadas e dicas de especialistas.
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-3xl bg-white/95 p-4 text-left shadow-lift backdrop-blur dark:bg-[#12190f]/95">
            <NewsletterForm source="home" />
          </div>
        </div>
      </section>

      {/* FAQ resumido */}
      <section className="mx-auto max-w-3xl px-4 pt-16" aria-labelledby="faq">
        <SectionHeading
          eyebrow="Dúvidas"
          title="Perguntas frequentes"
          align="center"
          href="/faq"
          hrefLabel="Ver todas as dúvidas"
        />
        <FaqAccordion items={faqItems.slice(0, 4)} />
      </section>
    </>
  );
}
