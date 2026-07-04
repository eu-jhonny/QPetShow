"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Tag, Target, MessageSquare, LogOut, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/cupons", label: "Cupons", icon: Tag },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="lg:w-60 lg:shrink-0">
      <div className="lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-ink to-black p-4 text-white">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500 font-extrabold">
            {adminName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">Painel Admin</p>
            <p className="truncate text-xs text-white/60">{adminName}</p>
          </div>
        </div>

        <nav aria-label="Menu do admin" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition",
                  active
                    ? "bg-brand-500 text-white shadow-soft"
                    : "text-gray-600 hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-white/5"
                )}
              >
                <Icon className="size-4.5" aria-hidden />
                {label}
              </Link>
            );
          })}
          <div className="my-2 hidden h-px bg-black/5 lg:block dark:bg-white/10" />
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <Store className="size-4.5" aria-hidden />
            Ver loja
          </Link>
          <button
            onClick={logout}
            className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-fire-600 transition hover:bg-fire-50 dark:text-fire-400 dark:hover:bg-fire-900/20"
          >
            <LogOut className="size-4.5" aria-hidden />
            Sair
          </button>
        </nav>
      </div>
    </aside>
  );
}
