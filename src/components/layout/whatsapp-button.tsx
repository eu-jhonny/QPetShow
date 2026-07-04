"use client";

import { MessageCircle } from "lucide-react";
import { storeInfo } from "@/lib/data/site";

/** Botão flutuante do WhatsApp (apenas na loja; fica acima do menu mobile). */
export function WhatsAppButton() {
  const phone = storeInfo.whatsappDigits ?? storeInfo.whatsapp.replace(/\D/g, "").replace(/^/, "55");
  const message = encodeURIComponent("Olá! Vim pela loja da QPet Shop e gostaria de mais informações. 🐾");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-white shadow-lift transition-all hover:scale-105 hover:pr-5 md:bottom-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.5s]" aria-hidden />
      <MessageCircle className="relative size-6 shrink-0 fill-current" aria-hidden />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-extrabold transition-all duration-300 group-hover:max-w-[120px] md:inline">
        Fale conosco
      </span>
    </a>
  );
}
