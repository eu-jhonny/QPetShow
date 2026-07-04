import type { HeroBanner } from "@/components/home/hero-carousel";

export const heroBanners: HeroBanner[] = [
  {
    id: "1",
    image: "/images/banners/banner1.jpg",
    alt: "Promoções da QPet",
    href: "/produtos?promocao=true",
  },
  {
    id: "2",
    image: "/images/banners/banner2.jpg",
    alt: "Rações Premium",
    href: "/categoria/racoes",
  },
  {
    id: "3",
    image: "/images/banners/banner3.jpg",
    alt: "Banho e Tosa",
    href: "/servicos",
  },
];
