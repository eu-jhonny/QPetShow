"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Volume2, VolumeX } from "lucide-react";
import { cn, formatBRL } from "@/lib/utils";

interface OrderLite {
  id: string;
  code: string;
  total: number;
  customer: { name: string };
  createdAt: string;
}

const POLL_MS = 12_000;
const SEEN_KEY = "qps_admin_seen_orders";

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const notes = [880, 1174.7];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.42);
    });
  } catch {
    // áudio bloqueado — segue sem som
  }
}

export function OrderNotifications() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [popup, setPopup] = useState<OrderLite | null>(null);
  const [muted, setMuted] = useState(false);
  const knownIds = useRef<Set<string> | null>(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    setMuted(localStorage.getItem("qps_admin_muted") === "1");
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const orders: OrderLite[] = data.orders ?? [];
      const ids = new Set(orders.map((o) => o.id));

      if (knownIds.current === null) {
        // primeira carga: estabelece a base, sem alertar
        knownIds.current = ids;
        const seen = Number(localStorage.getItem(SEEN_KEY) ?? orders.length);
        setCount(Math.max(0, orders.length - seen));
        firstLoad.current = false;
        return;
      }

      const newOnes = orders.filter((o) => !knownIds.current!.has(o.id));
      if (newOnes.length > 0) {
        knownIds.current = ids;
        setCount((c) => c + newOnes.length);
        setPopup(newOnes[0]);
        if (!muted) beep();
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🛎️ Novo pedido na QPet Shop!", {
            body: `${newOnes[0].customer.name} — ${formatBRL(newOnes[0].total)}`,
          });
        }
        setTimeout(() => setPopup(null), 8000);
      }
    } catch {
      // ignora falhas de rede
    }
  }, [muted]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  function openOrders() {
    setCount(0);
    localStorage.setItem(SEEN_KEY, String(knownIds.current?.size ?? 0));
    router.push("/admin/pedidos");
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    localStorage.setItem("qps_admin_muted", next ? "1" : "0");
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Silenciar"}
          className="flex size-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10"
        >
          {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
        </button>
        <button
          onClick={openOrders}
          aria-label={`Pedidos${count > 0 ? ` (${count} novos)` : ""}`}
          className="relative flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
        >
          <Bell className={cn("size-5", count > 0 && "animate-[wiggle_0.5s_ease-in-out_infinite]")} aria-hidden />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-fire-500 px-1 text-[10px] font-extrabold text-white">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Alerta destacado de novo pedido */}
      <AnimatePresence>
        {popup && (
          <motion.button
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            onClick={openOrders}
            className="fixed right-4 top-20 z-[200] flex items-center gap-3 rounded-2xl border-2 border-brand-400 bg-white px-5 py-4 text-left shadow-lift dark:bg-[#12190f]"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Bell className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-display text-base font-extrabold">Novo pedido! 🛎️</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {popup.customer.name} · <strong className="text-brand-600 dark:text-brand-300">{formatBRL(popup.total)}</strong>
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
