import { brands } from "@/lib/data/site";

/** Faixa de marcas com rolagem contínua (marquee CSS puro). */
export function BrandMarquee() {
  const doubled = [...brands, ...brands];
  return (
    <div className="overflow-hidden border-y border-black/5 bg-white py-6 dark:border-white/10 dark:bg-white/[0.03]" aria-label="Marcas parceiras">
      <div className="animate-marquee flex w-max items-center gap-12 hover:[animation-play-state:paused]">
        {doubled.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="font-display whitespace-nowrap text-2xl font-extrabold text-gray-300 transition-colors hover:text-brand-500 dark:text-white/20 dark:hover:text-brand-400"
            aria-hidden={i >= brands.length}
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
