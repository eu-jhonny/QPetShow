"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/produtos", label: "Produtos", icon: LayoutGrid },
  { href: "/carrinho", label: "Carrinho", icon: ShoppingCart },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta", label: "Conta", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav
      aria-label="Navegação principal"
      className="glass fixed inset-x-0 bottom-0 z-50 border-t border-black/5 pb-[env(safe-area-inset-bottom)] md:hidden dark:border-white/10"
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href) && !(href === "/conta" && pathname.startsWith("/conta/favoritos"));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold transition-colors",
                  active ? "text-brand-600 dark:text-brand-300" : "text-gray-500 dark:text-gray-400"
                )}
              >
                <span className="relative">
                  <Icon className={cn("size-5.5 transition-transform", active && "scale-110")} aria-hidden />
                  {href === "/carrinho" && count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-fire-500 text-[9px] font-extrabold text-white">
                      {count}
                    </span>
                  )}
                </span>
                {label}
                {active && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-brand-500" aria-hidden />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
