"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  cta: { label: string; href: string };
  discount?: string;
  bg: string;
  emojis: string[];
  accent: string;
}

const slides: Slide[] = [
  {
    id: "inauguracao",
    eyebrow: "🎉 Inauguração",
    title: (
      <>
        Inauguração da <span className="text-sun-300">Loja Virtual</span> da QPet Shop!
      </>
    ),
    subtitle: "Carinho Q faz a diferença. Ofertas especiais de lançamento em todo o site!",
    cta: { label: "Aproveitar ofertas", href: "/produtos?filtro=promocao" },
    bg: "from-fire-500 via-fire-600 to-fire-700",
    emojis: ["🐶", "🐱", "🎈", "🎊"],
    accent: "bg-sun-500 text-ink",
  },
  {
    id: "antipulgas",
    eyebrow: "🛡️ Máxima proteção",
    title: (
      <>
        Antipulgas com até <span className="text-brand-300">25% OFF</span>
      </>
    ),
    subtitle: "Bravecto, NexGard e Scalibor — elimina pulgas, proteção prolongada e fácil aplicação.",
    cta: { label: "Proteger meu pet", href: "/categorias/antipulgas" },
    bg: "from-[#0c1f0a] via-[#143312] to-[#0c1f0a]",
    emojis: ["🛡️", "🐕", "🦟", "✅"],
    accent: "bg-brand-500 text-white",
  },
  {
    id: "areia-tapetes",
    eyebrow: "🧻 Higiene premium",
    title: (
      <>
        Areia & Tapetes com até <span className="text-sun-300">40% OFF</span>
      </>
    ),
    subtitle: "Pipicat, Zee.Pad e Tapeco — controle de odores e máxima absorção para o dia a dia.",
    cta: { label: "Ver higiene", href: "/categorias/areia-tapetes" },
    bg: "from-brand-600 via-brand-700 to-emerald-800",
    emojis: ["🐱", "🧻", "✨", "💧"],
    accent: "bg-sun-500 text-ink",
  },
  {
    id: "saches",
    eyebrow: "🍖 Sabores irresistíveis",
    title: (
      <>
        Sachês & Petiscos com até <span className="text-fire-300">14% OFF</span>
      </>
    ),
    subtitle: "Finotrato, Golden Gourmet e PetProb — recompensas deliciosas e nutritivas.",
    cta: { label: "Ver sabores", href: "/categorias/saches-petiscos" },
    bg: "from-sun-500 via-orange-500 to-fire-500",
    emojis: ["🍗", "🐶", "😻", "🥩"],
    accent: "bg-ink text-white",
  },
];

const AUTO_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => go(1), AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, go, index]);

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques e promoções"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative mx-auto max-w-7xl px-4 pt-4"
    >
      <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn("paw-pattern relative bg-gradient-to-br", slide.bg)}
          >
            <div className="relative z-10 flex min-h-[420px] flex-col items-start justify-center gap-5 px-8 py-14 md:min-h-[480px] md:px-16 lg:max-w-[62%]">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn("rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest", slide.accent)}
              >
                {slide.eyebrow}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl font-extrabold leading-[1.05] text-white drop-shadow-md md:text-6xl"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-lg text-base font-medium text-white/90 md:text-lg"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href={slide.cta.href}
                  className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-8 text-base font-extrabold text-ink shadow-lift transition-all duration-200 hover:scale-105 hover:bg-sun-100 active:scale-100"
                >
                  {slide.cta.label} →
                </Link>
              </motion.div>
            </div>

            {/* Emojis decorativos flutuantes */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block" aria-hidden>
              {slide.emojis.map((emoji, i) => (
                <motion.span
                  key={`${slide.id}-${i}`}
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                  className="absolute text-7xl drop-shadow-2xl"
                  style={{
                    top: `${14 + (i % 2) * 42}%`,
                    right: `${8 + (i % 3) * 22}%`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                >
                  <span className="animate-float inline-block" style={{ animationDelay: `${i * 0.7}s` }}>
                    {emoji}
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controles */}
        <button
          onClick={() => go(-1)}
          aria-label="Slide anterior"
          className="absolute left-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/35 md:flex"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Próximo slide"
          className="absolute right-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/35 md:flex"
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
