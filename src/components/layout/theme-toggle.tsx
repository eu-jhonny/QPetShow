"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("qps_theme", next ? "dark" : "light");
  }

  if (!mounted) return <div className="size-11" aria-hidden />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="flex size-11 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
    >
      {dark ? <Sun className="size-5 text-sun-400" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}
