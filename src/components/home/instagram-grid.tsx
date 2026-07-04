"use client";

import { motion } from "framer-motion";
import { Camera, Heart } from "lucide-react";
import { BrandIcon, type IconKey } from "@/lib/icon-map";
import { storeInfo } from "@/lib/data/site";
import { cn } from "@/lib/utils";

const posts: { icon: IconKey; gradient: string; likes: string }[] = [
  { icon: "dog", gradient: "from-sun-300 to-orange-400", likes: "1,2 mil" },
  { icon: "cat", gradient: "from-fire-300 to-rose-400", likes: "984" },
  { icon: "bone", gradient: "from-brand-300 to-emerald-400", likes: "756" },
  { icon: "bath", gradient: "from-sky-300 to-cyan-400", likes: "1,5 mil" },
  { icon: "toy", gradient: "from-violet-300 to-purple-400", likes: "643" },
  { icon: "paw", gradient: "from-amber-300 to-yellow-400", likes: "2,1 mil" },
];

export function InstagramGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {posts.map((post, i) => (
        <motion.a
          key={i}
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Post do Instagram ${storeInfo.instagram} com ${post.likes} curtidas`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className={cn(
            "paw-pattern group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br shadow-soft",
            post.gradient
          )}
        >
          <BrandIcon name={post.icon} className="size-12 text-white/90 transition-transform duration-500 group-hover:scale-125" />
          <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 text-sm font-extrabold text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Heart className="size-4 fill-current" aria-hidden /> {post.likes}
          </span>
          <Camera className="absolute right-2 top-2 size-4 text-white/70" aria-hidden />
        </motion.a>
      ))}
    </div>
  );
}
