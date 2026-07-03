import Link from "next/link";
import { getSession } from "@/lib/server/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-black/5 bg-white p-5 shadow-soft lg:sticky lg:top-40 dark:border-white/10 dark:bg-white/5">
          <div className="mb-5 flex items-center gap-3 border-b border-black/5 pb-5 dark:border-white/10">
            <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-extrabold text-white" aria-hidden>
              {session?.name?.charAt(0).toUpperCase() ?? "🐾"}
            </span>
            <div className="min-w-0">
              <p className="truncate font-extrabold">{session?.name ?? "Visitante"}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{session?.email}</p>
            </div>
          </div>
          <nav aria-label="Menu da conta" className="flex flex-col gap-1">
            {[
              { href: "/conta", label: "Meu perfil", emoji: "👤" },
              { href: "/conta/pedidos", label: "Meus pedidos", emoji: "📦" },
              { href: "/conta/favoritos", label: "Favoritos", emoji: "❤️" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition hover:bg-brand-50 dark:hover:bg-white/5"
              >
                <span aria-hidden>{item.emoji}</span> {item.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
