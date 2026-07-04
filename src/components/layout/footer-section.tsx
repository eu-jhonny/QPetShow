"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Coluna do rodapé: recolhível no mobile (economiza espaço),
 * sempre expandida no desktop (md+).
 */
export function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/5 py-2 md:border-none md:py-0 dark:border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-2 md:pointer-events-none md:py-0"
      >
        <h3 className="font-display text-base font-extrabold text-ink dark:text-white">{title}</h3>
        <ChevronDown className={cn("size-5 text-gray-400 transition-transform md:hidden", open && "rotate-180")} aria-hidden />
      </button>
      <div className={cn("flex-col gap-2.5 pb-2 md:!flex md:pb-0 md:pt-4", open ? "flex" : "hidden")}>
        {children}
      </div>
    </div>
  );
}
