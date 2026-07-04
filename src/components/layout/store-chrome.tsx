"use client";

import { usePathname } from "next/navigation";

/**
 * Oculta o conteúdo (chrome da loja) nas rotas /admin, que têm layout próprio.
 * Recebe os componentes já renderizados no servidor como children, então
 * funciona mesmo com Header/Footer assíncronos (server components).
 */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
