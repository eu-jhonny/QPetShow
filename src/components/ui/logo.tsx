import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo oficial da QPet Shop (imagem completa em /public/logo.png, fundo transparente).
 * Para trocar a arte, basta substituir o arquivo public/logo.png.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="QPet Shop — página inicial" className={cn("group inline-flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="QPet Shop — Carinho Q faz a diferença"
        width={956}
        height={368}
        priority
        className={cn(
          "w-auto object-contain transition-transform duration-300 group-hover:scale-105",
          compact ? "h-11" : "h-14"
        )}
      />
    </Link>
  );
}

/** Logo em destaque (páginas de erro etc.). */
export function LogoFull({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="QPet Shop — Carinho Q faz a diferença"
      width={956}
      height={368}
      priority
      className={cn("h-auto w-full max-w-xs object-contain", className)}
    />
  );
}
