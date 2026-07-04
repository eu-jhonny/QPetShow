"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { OrderNotifications } from "./order-notifications";

export function AdminTopbar({ adminName }: { adminName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-ink to-[#0b0d10] text-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Painel QPet Shop">
          <Image src="/logo.png" alt="QPet Shop" width={956} height={368} className="h-9 w-auto object-contain" priority />
          <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest sm:inline">Admin</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <OrderNotifications />
          <div className="hidden text-white sm:block"><ThemeToggle /></div>
          <Link
            href="/"
            className="ml-1 hidden items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20 sm:flex"
          >
            <ExternalLink className="size-4" aria-hidden /> Ver loja
          </Link>
          <span className="ml-1 flex size-9 items-center justify-center rounded-full bg-brand-500 text-sm font-extrabold" aria-hidden>
            {adminName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
