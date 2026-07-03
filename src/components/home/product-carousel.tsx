"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

/**
 * Carrossel de produtos com rolagem automática (pausa no hover/touch),
 * setas de navegação e rolagem por gesto no mobile.
 */
export function ProductCarousel({
  products,
  autoScroll = true,
  className,
}: {
  products: Product[];
  autoScroll?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoScroll || paused) return;
    const track = trackRef.current;
    if (!track) return;

    const interval = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [autoScroll, paused]);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * (trackRef.current.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <div
      className={cn("group/carousel relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23.5%]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollBy(-1)}
        aria-label="Produtos anteriores"
        className="absolute -left-3 top-[38%] z-10 hidden size-11 items-center justify-center rounded-full border border-black/5 bg-white shadow-lift transition-all hover:scale-110 md:flex dark:border-white/10 dark:bg-[#1a2417] dark:text-white"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Próximos produtos"
        className="absolute -right-3 top-[38%] z-10 hidden size-11 items-center justify-center rounded-full border border-black/5 bg-white shadow-lift transition-all hover:scale-110 md:flex dark:border-white/10 dark:bg-[#1a2417] dark:text-white"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
