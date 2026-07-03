import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "sun";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-soft hover:bg-brand-600 active:scale-[0.98] hover:shadow-lift",
  secondary:
    "bg-ink text-white hover:bg-black active:scale-[0.98] dark:bg-white dark:text-ink dark:hover:bg-gray-100",
  outline:
    "border-2 border-brand-500 text-brand-600 hover:bg-brand-50 active:scale-[0.98] dark:text-brand-300 dark:hover:bg-brand-950",
  ghost: "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
  danger: "bg-fire-500 text-white shadow-soft hover:bg-fire-600 active:scale-[0.98]",
  sun: "bg-sun-500 text-ink shadow-soft hover:bg-sun-400 active:scale-[0.98] font-extrabold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
  icon: "size-11",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
