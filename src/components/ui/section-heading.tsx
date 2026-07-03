import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  hrefLabel = "Ver tudo",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <span className="mb-2 inline-block rounded-full bg-brand-100 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-700 dark:bg-brand-900 dark:text-brand-200">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-gray-500 md:text-base dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
        >
          {hrefLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      )}
    </div>
  );
}
