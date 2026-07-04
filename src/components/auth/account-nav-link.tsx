"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = { user: User, package: Package, heart: Heart };

export function AccountNavLink({
  href,
  label,
  icon,
  exact = false,
}: {
  href: string;
  label: string;
  icon: keyof typeof icons;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  const Icon = icons[icon];

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition",
        active ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-white/5"
      )}
    >
      <Icon className="size-4" aria-hidden /> {label}
    </Link>
  );
}
