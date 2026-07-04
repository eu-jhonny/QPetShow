"use client";

import { useEffect, useState, useCallback } from "react";
import { Target, Download } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  email: string;
  name?: string;
  source: string;
  status?: "novo" | "contatado" | "convertido";
  createdAt: string;
}

const statusColors: Record<string, string> = {
  novo: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  contatado: "bg-sun-100 text-sun-800 dark:bg-sun-900/40 dark:text-sun-300",
  convertido: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
};

export default function AdminLeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (res.ok) setLeads(data.leads);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: Lead["status"]) {
    const res = await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      toast("Lead atualizado");
    }
  }

  function exportCsv() {
    const rows = [["email", "nome", "origem", "status", "data"], ...leads.map((l) => [l.email, l.name ?? "", l.source, l.status ?? "novo", l.createdAt])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "leads-qpetshop.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const bySource = leads.reduce<Record<string, number>>((acc, l) => { acc[l.source] = (acc[l.source] ?? 0) + 1; return acc; }, {});

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Leads</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{leads.length} contatos capturados</p>
        </div>
        {leads.length > 0 && (
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2 text-sm font-bold transition hover:border-brand-400 dark:border-white/15">
            <Download className="size-4" aria-hidden /> Exportar CSV
          </button>
        )}
      </header>

      {Object.keys(bySource).length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {Object.entries(bySource).map(([src, count]) => (
            <span key={src} className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold capitalize dark:bg-white/10">
              {src}: {count}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <Target className="size-10 text-gray-300" aria-hidden />
          <p className="font-bold">Nenhum lead ainda</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Os cadastros da newsletter e do pop-up aparecem aqui.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 dark:border-white/10">
              <tr className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                <th className="px-5 py-3">E-mail</th>
                <th className="hidden px-5 py-3 sm:table-cell">Origem</th>
                <th className="hidden px-5 py-3 md:table-cell">Data</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {leads.map((l) => (
                <tr key={l.id} className="transition hover:bg-brand-50/40 dark:hover:bg-white/5">
                  <td className="px-5 py-3 font-semibold">{l.email}{l.name && <span className="block text-xs text-gray-400">{l.name}</span>}</td>
                  <td className="hidden px-5 py-3 capitalize text-gray-500 sm:table-cell dark:text-gray-400">{l.source}</td>
                  <td className="hidden px-5 py-3 text-gray-500 md:table-cell dark:text-gray-400">{new Date(l.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-5 py-3">
                    <select
                      value={l.status ?? "novo"}
                      onChange={(e) => setStatus(l.id, e.target.value as Lead["status"])}
                      className={cn("rounded-full border-0 px-3 py-1 text-xs font-extrabold focus:outline-none", statusColors[l.status ?? "novo"])}
                    >
                      <option value="novo">Novo</option>
                      <option value="contatado">Contatado</option>
                      <option value="convertido">Convertido</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
