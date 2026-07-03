"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

const STORAGE_KEY = "qps_popup_dismissed";
const SHOW_DELAY_MS = 12_000;

/**
 * Pop-up inteligente de captura de leads: aparece após 12s de navegação
 * ou intenção de saída (mouse saindo pela parte superior). Uma vez fechado,
 * não volta a aparecer por 7 dias.
 */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;

    let shown = false;
    const show = () => {
      if (!shown) {
        shown = true;
        setOpen(true);
      }
    };

    const timer = setTimeout(show, SHOW_DELAY_MS);
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 4) show();
    };
    document.addEventListener("mouseleave", onExitIntent);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onExitIntent);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 32 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="Ganhe 10% de desconto"
            className="fixed left-1/2 top-1/2 z-[90] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] bg-white shadow-lift dark:bg-[#12190f]"
          >
            <div className="paw-pattern relative bg-gradient-to-br from-fire-500 to-fire-700 px-8 pb-14 pt-8 text-center text-white">
              <button
                onClick={dismiss}
                aria-label="Fechar"
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30"
              >
                <X className="size-4" aria-hidden />
              </button>
              <motion.span
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="inline-block text-5xl"
                aria-hidden
              >
                🎁
              </motion.span>
              <h2 className="font-display mt-3 text-2xl font-extrabold leading-tight">
                Ganhe <span className="text-sun-300">10% OFF</span> na primeira compra!
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Cadastre-se e receba o cupom no seu e-mail agora mesmo.
              </p>
            </div>
            <div className="-mt-6 rounded-t-[2rem] bg-white px-8 pb-8 pt-6 dark:bg-[#12190f]">
              <NewsletterForm source="popup" onSuccess={() => setTimeout(dismiss, 2500)} />
              <button
                onClick={dismiss}
                className="mt-3 w-full text-center text-xs font-semibold text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
              >
                Não, obrigado. Prefiro pagar o preço cheio 😢
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
