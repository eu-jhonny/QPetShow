import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logo tipográfico QPet Shop — Q vermelho, Pet amarelo, Shop verde.
 * Substituir por <Image src="/logo.png" /> quando o arquivo oficial for adicionado em /public.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="QPet Shop — página inicial" className={cn("group inline-flex items-center gap-1", className)}>
      <span className="font-display text-3xl font-extrabold leading-none tracking-tight">
        <span className="text-fire-500 transition-transform duration-300 group-hover:scale-110 inline-block">Q</span>
        <span className="bg-gradient-to-b from-sun-400 to-orange-500 bg-clip-text text-transparent">Pet</span>
        <span className="bg-gradient-to-b from-brand-400 to-brand-600 bg-clip-text text-transparent">Shop</span>
        <span className="ml-0.5 text-lg" aria-hidden>🐾</span>
      </span>
      {!compact && (
        <span className="sr-only">Carinho Q faz a diferença</span>
      )}
    </Link>
  );
}
