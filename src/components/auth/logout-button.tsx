"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-fire-600 transition hover:bg-fire-50 disabled:opacity-60 dark:text-fire-400 dark:hover:bg-fire-900/20"
    >
      <LogOut className="size-4" aria-hidden />
      {loading ? "Saindo..." : "Sair da conta"}
    </button>
  );
}
