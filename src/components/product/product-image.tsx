import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data/products";
import Image from "next/image";

/**
 * Tile visual do produto. Usa foto real quando `product.image` existe
 * (colocar em /public/products), senão renderiza um tile ilustrado da marca.
 */
export function ProductImage({
  product,
  className,
  emojiClassName = "text-7xl",
  priority = false,
}: {
  product: Product;
  className?: string;
  emojiClassName?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl bg-white", className)}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={product.name}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
        product.gradient,
        className
      )}
    >
      <div className="paw-pattern absolute inset-0 opacity-60" aria-hidden />
      <span className={cn("relative drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6", emojiClassName)} aria-hidden>
        {product.emoji}
      </span>
      <span
        aria-hidden
        className="absolute bottom-2 right-3 font-display text-[10px] font-extrabold uppercase tracking-widest text-white/70"
      >
        {product.brand}
      </span>
    </div>
  );
}
