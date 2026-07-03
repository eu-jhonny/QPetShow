"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 shadow-lift dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo compact />
          <div>
            <h1 className="font-display text-2xl font-extrabold">{title}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
