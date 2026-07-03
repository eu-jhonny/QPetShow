"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, hint, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-bold text-ink dark:text-white">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-12 w-full rounded-2xl border-2 bg-white px-4 text-sm font-medium transition-colors",
          "placeholder:text-gray-400 dark:bg-white/5 dark:text-white",
          error
            ? "border-fire-400 focus:border-fire-500"
            : "border-gray-200 focus:border-brand-500 dark:border-white/15 dark:focus:border-brand-400",
          "focus:outline-none",
          className
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-semibold text-fire-600 dark:text-fire-400">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
});
