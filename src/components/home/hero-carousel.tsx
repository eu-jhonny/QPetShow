"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroBanner {
  id: string;
  image: string;
  alt: string;
  href: string;
}

const AUTO_MS = 6000;

export function HeroCarousel({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = banners.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => go(1), AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, go, index, count]);

  if (count === 0) return null;
  const banner = banners[index];

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques e promoções"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative mx-auto max-w-7xl px-4 pt-4"
    >
      <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
        <div className="relative aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Link href={banner.href} aria-label={banner.alt} className="block size-full">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Slide anterior"
              className="absolute left-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition hover:bg-white/40 md:flex"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próximo slide"
              className="absolute right-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition hover:bg-white/40 md:flex"
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Slides">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir para banner ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
