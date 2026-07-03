"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/data/site";
import { RatingStars } from "@/components/ui/rating-stars";

export function Testimonials() {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-5">
      {testimonials.map((t, i) => (
        <motion.figure
          key={t.name}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className="flex w-[80%] shrink-0 snap-start flex-col gap-3 rounded-3xl border border-black/5 bg-white p-5 shadow-soft md:w-auto dark:border-white/10 dark:bg-white/5"
        >
          <RatingStars rating={t.rating} />
          <blockquote className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            “{t.text}”
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-extrabold text-white" aria-hidden>
              {t.avatar}
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink dark:text-white">{t.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.pet}</p>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
