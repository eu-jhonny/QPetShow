import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getAdminSession } from "@/lib/server/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?de=/admin");

  const admin = await getAdminSession();
  if (!admin) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-5xl" aria-hidden>🔒</span>
        <h1 className="font-display text-2xl font-extrabold">Acesso restrito</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Sua conta ({session.email}) não tem permissão de administrador. Adicione seu e-mail em
          <code className="mx-1 rounded bg-black/5 px-1 dark:bg-white/10">ADMIN_EMAILS</code> no arquivo .env.
        </p>
        <Link href="/" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600">
          Voltar à loja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <AdminSidebar adminName={admin.name} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
