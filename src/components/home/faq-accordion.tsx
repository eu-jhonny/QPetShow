"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            className={cn(
              "overflow-hidden rounded-3xl border transition-colors",
              open
                ? "border-brand-300 bg-brand-50/60 dark:border-brand-700 dark:bg-brand-950/40"
                : "border-black/5 bg-white dark:border-white/10 dark:bg-white/5"
            )}
          >
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="text-sm font-extrabold text-ink md:text-base dark:text-white">{item.question}</span>
              <ChevronDown
                className={cn("size-5 shrink-0 text-brand-500 transition-transform duration-300", open && "rotate-180")}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
