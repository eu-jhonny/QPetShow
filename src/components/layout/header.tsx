"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, ShoppingCart, Truck, User, X, ChevronDown, Flame, Package, Newspaper, MessageCircle, HelpCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { BrandIcon } from "@/lib/icon-map";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";
import { categories } from "@/lib/data/categories";
import { storeInfo } from "@/lib/data/site";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorites-provider";
import { cn, formatBRL } from "@/lib/utils";

export function Header() {
  const { count } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra de promoção */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-bold md:text-sm">
          <Truck className="size-4 shrink-0" aria-hidden />
          <span>
            Frete <span className="text-sun-300">GRÁTIS</span> em compras acima de {formatBRL(storeInfo.freeShippingMin)} · 5% OFF no PIX
          </span>
        </div>
      </div>

      {/* Barra principal */}
      <div className={cn("glass transition-shadow duration-300", scrolled && "shadow-soft")}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex size-11 items-center justify-center rounded-full transition hover:bg-black/5 lg:hidden dark:hover:bg-white/10"
          >
            <Menu className="size-6" aria-hidden />
          </button>

          <Logo className="shrink-0" />

          <div className="hidden flex-1 md:block">
            <SearchBar />
          </div>

          <nav className="ml-auto flex items-center gap-1" aria-label="Ações da conta">
            <ThemeToggle />
            <Link
              href="/conta"
              aria-label="Minha conta"
              className="hidden size-11 items-center justify-center rounded-full transition hover:bg-black/5 sm:flex dark:hover:bg-white/10"
            >
              <User className="size-5" aria-hidden />
            </Link>
            <Link
              href="/conta/favoritos"
              aria-label={`Favoritos (${favorites.length})`}
              className="relative hidden size-11 items-center justify-center rounded-full transition hover:bg-black/5 sm:flex dark:hover:bg-white/10"
            >
              <Heart className="size-5" aria-hidden />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-fire-500 text-[10px] font-extrabold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/carrinho"
              aria-label={`Carrinho (${count} itens)`}
              className="relative flex size-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-lift"
            >
              <ShoppingCart className="size-5" aria-hidden />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-sun-500 text-[10px] font-extrabold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </nav>
        </div>

        {/* Busca mobile */}
        <div className="px-4 pb-3 md:hidden">
          <SearchBar />
        </div>

        {/* Menu de categorias desktop */}
        <nav aria-label="Categorias" className="hidden border-t border-black/5 lg:block dark:border-white/10">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
            <div className="group relative">
              <button className="flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold transition hover:text-brand-600 dark:hover:text-brand-300">
                Todas as categorias
                <ChevronDown className="size-4 transition-transform group-hover:rotate-180" aria-hidden />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-[560px] translate-y-2 rounded-3xl border border-black/5 bg-white p-4 opacity-0 shadow-lift transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-[#12190f]">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categorias/${cat.slug}`}
                      className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-brand-50 dark:hover:bg-white/5"
                    >
                      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", cat.gradient)} aria-hidden>
                        <BrandIcon name={cat.icon} className="size-5 text-white" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink dark:text-white">{cat.name}</p>
                        <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className="flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold transition hover:text-brand-600 dark:hover:text-brand-300"
              >
                <BrandIcon name={cat.icon} className="size-4" /> {cat.name}
              </Link>
            ))}
            <Link
              href="/produtos?filtro=promocao"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-fire-500 px-4 py-1.5 text-sm font-extrabold text-white transition hover:bg-fire-600"
            >
              <Flame className="size-4" aria-hidden /> Ofertas
            </Link>
          </div>
        </nav>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-5 lg:hidden dark:bg-[#0d1410]"
              role="dialog"
              aria-label="Menu de navegação"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo compact />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="flex size-11 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="size-6" aria-hidden />
                </button>
              </div>

              <nav aria-label="Categorias" className="flex flex-col gap-1">
                <p className="mb-1 px-2 text-xs font-extrabold uppercase tracking-widest text-gray-400">Categorias</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categorias/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-brand-50 dark:hover:bg-white/5"
                  >
                    <span className={cn("flex size-9 items-center justify-center rounded-xl bg-gradient-to-br", cat.gradient)} aria-hidden>
                      <BrandIcon name={cat.icon} className="size-5 text-white" />
                    </span>
                    <span className="text-sm font-bold">{cat.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-1 border-t border-black/5 pt-4 dark:border-white/10">
                {[
                  { href: "/conta", label: "Minha conta", icon: User },
                  { href: "/conta/pedidos", label: "Meus pedidos", icon: Package },
                  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
                  { href: "/blog", label: "Blog", icon: Newspaper },
                  { href: "/contato", label: "Fale conosco", icon: MessageCircle },
                  { href: "/faq", label: "Dúvidas frequentes", icon: HelpCircle },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition hover:bg-brand-50 dark:hover:bg-white/5"
                  >
                    <item.icon className="size-4 text-brand-500" aria-hidden />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
