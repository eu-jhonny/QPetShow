"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Heart } from "lucide-react";
import { storeInfo } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export interface InstagramItem {
  id: string;
  image: string;
  href: string;
}

export function InstagramGrid({ photos }: { photos: InstagramItem[] }) {
  // Sem fotos ainda: mostra um convite para seguir (sem tiles falsos).
  if (photos.length === 0) {
    return (
      <a
        href={storeInfo.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-brand-200 bg-brand-50/40 px-6 py-12 text-center transition hover:border-brand-400 dark:border-brand-800 dark:bg-brand-950/30"
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-400 text-white">
          <Camera className="size-7" aria-hidden />
        </span>
        <p className="font-display text-lg font-extrabold">Siga {storeInfo.instagram}</p>
        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
          Acompanhe novidades, promoções e muita fofura no nosso Instagram.
        </p>
        <span className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-extrabold text-white">Abrir Instagram</span>
      </a>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {photos.map((post, i) => (
        <motion.a
          key={post.id}
          href={post.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Post do Instagram ${storeInfo.instagram}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className={cn("group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl shadow-soft")}
        >
          <Image src={post.image} alt="" fill sizes="(max-width: 768px) 33vw, 16vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
          <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 text-sm font-extrabold text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Heart className="size-4 fill-current" aria-hidden /> Ver post
          </span>
          <Camera className="absolute right-2 top-2 size-4 text-white/80 drop-shadow" aria-hidden />
        </motion.a>
      ))}
    </div>
  );
}
