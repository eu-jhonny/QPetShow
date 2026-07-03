import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  reviews,
  size = "sm",
  className,
}: {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const starSize = size === "sm" ? "size-3.5" : "size-5";

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Avaliação ${rating} de 5`}>
      <div className="flex text-sun-500" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} className={cn(starSize, "fill-current")} />;
          if (i === full && hasHalf)
            return (
              <span key={i} className="relative">
                <Star className={cn(starSize, "text-gray-300 dark:text-white/20")} />
                <StarHalf className={cn(starSize, "absolute inset-0 fill-current")} />
              </span>
            );
          return <Star key={i} className={cn(starSize, "text-gray-300 dark:text-white/20")} />;
        })}
      </div>
      {reviews !== undefined && (
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">({reviews})</span>
      )}
    </div>
  );
}
