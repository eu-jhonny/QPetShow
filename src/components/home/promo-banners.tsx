"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandIcon, type IconKey } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

const banners: {
  href: string;
  title: string;
  subtitle: string;
  discount: string;
  icon: IconKey;
  bg: string;
  badge: string;
}[] = [
  {
    href: "/categorias/antipulgas",
    title: "Antipulgas",
    subtitle: "Bravecto, NexGard e Scalibor",
    discount: "até 25% OFF",
    icon: "shield",
    bg: "from-[#12290e] to-[#1e4a16]",
    badge: "bg-brand-400 text-ink",
  },
  {
    href: "/categorias/areia-tapetes",
    title: "Areia & Tapetes",
    subtitle: "Pipicat, Zee.Pad e Tapeco",
    discount: "até 40% OFF",
    icon: "layers",
    bg: "from-brand-600 to-emerald-700",
    badge: "bg-sun-400 text-ink",
  },
  {
    href: "/categorias/saches-petiscos",
    title: "Sachês & Petiscos",
    subtitle: "Finotrato, Golden e PetProb",
    discount: "até 14% OFF",
    icon: "drumstick",
    bg: "from-sun-500 to-orange-600",
    badge: "bg-ink text-white",
  },
];

export function PromoBanners() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {banners.map((banner, i) => (
        <motion.div
          key={banner.href}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <Link
            href={banner.href}
            className={cn(
              "paw-pattern group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
              banner.bg
            )}
          >
            <BrandIcon
              name={banner.icon}
              className="absolute -bottom-3 -right-2 size-32 text-white/15 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12"
            />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-extrabold text-white drop-shadow">{banner.title}</h3>
              <p className="text-sm font-medium text-white/80">{banner.subtitle}</p>
            </div>
            <span className={cn("relative z-10 w-fit rounded-full px-4 py-1.5 text-sm font-extrabold uppercase", banner.badge)}>
              {banner.discount}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
