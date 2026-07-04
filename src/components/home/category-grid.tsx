"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/data/categories";
import { BrandIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-8">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        >
          <Link
            href={`/categorias/${cat.slug}`}
            className="group flex flex-col items-center gap-3 rounded-3xl border border-black/5 bg-white p-4 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:border-white/10 dark:bg-white/5"
          >
            <span
              className={cn(
                "paw-pattern flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
                cat.gradient
              )}
              aria-hidden
            >
              <BrandIcon name={cat.icon} className="size-8 text-white drop-shadow" />
            </span>
            <span className="text-xs font-extrabold text-ink group-hover:text-brand-600 md:text-sm dark:text-white dark:group-hover:text-brand-300">
              {cat.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
