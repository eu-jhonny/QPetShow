import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data/products";
import { BrandIcon } from "@/lib/icon-map";
import Image from "next/image";

/**
 * Tile visual do produto. Usa foto real quando `product.image` existe
 * (colocar em /public/products), senão renderiza um tile com ícone da marca.
 */
export function ProductImage({
  product,
  className,
  iconClassName = "size-20",
  priority = false,
}: {
  product: Product;
  className?: string;
  iconClassName?: string;
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
      <div className="paw-pattern absolute inset-0 opacity-40" aria-hidden />
      <BrandIcon
        name={product.icon}
        className={cn(
          "relative text-white/95 drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
          iconClassName
        )}
      />
      <span
        aria-hidden
        className="absolute bottom-2 right-3 font-display text-[10px] font-extrabold uppercase tracking-widest text-white/80"
      >
        {product.brand}
      </span>
    </div>
  );
}
