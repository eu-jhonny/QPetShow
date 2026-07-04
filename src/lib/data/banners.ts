import type { HeroBanner } from "@/components/home/hero-carousel";

/**
 * Banners padrão (fallback). A fonte real e editável fica em
 * `src/lib/server/banners.ts` (gerenciável pelo painel /admin/banners).
 * As imagens estão em /public/banners.
 */
export const heroBanners: HeroBanner[] = [
  { id: "1", image: "/banners/areia-tapetes.webp", alt: "Areia & Tapetes com até 40% OFF", href: "/categorias/areia-tapetes" },
  { id: "2", image: "/banners/saches-petiscos.webp", alt: "Sachês & Petiscos com até 14% OFF", href: "/categorias/saches-petiscos" },
  { id: "3", image: "/banners/saches-petiscos-2.webp", alt: "Sachês & Petiscos premium", href: "/categorias/saches-petiscos" },
];
