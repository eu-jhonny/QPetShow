import { cn } from "@/lib/utils";

type BadgeVariant = "promo" | "novo" | "mais-vendido" | "brand" | "neutral";

const styles: Record<BadgeVariant, string> = {
  promo: "bg-fire-500 text-white",
  novo: "bg-sky-500 text-white",
  "mais-vendido": "bg-sun-500 text-ink",
  brand: "bg-brand-500 text-white",
  neutral: "bg-black/8 text-ink dark:bg-white/15 dark:text-white",
};

const labels: Partial<Record<BadgeVariant, string>> = {
  promo: "Promoção",
  novo: "Novo",
  "mais-vendido": "Mais vendido",
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide",
        styles[variant],
        className
      )}
    >
      {children ?? labels[variant]}
    </span>
  );
}
