"use client";

import { useEffect, useState, useMemo } from "react";
import { Terminal, Search, Monitor, Tag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import type { FisiCommand } from "@/lib/types";

function InlineCode({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-[#0a0c10] border border-white/5 px-4 py-3 text-sm text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default function BefehlePageContent() {
  const [commands, setCommands] = useState<FisiCommand[]>([]);
  const [loading, setLoading] = useState(!supabaseConfigMissing);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_commands")
      .select("*")
      .order("category", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(true);
        else setCommands(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.command.toLowerCase().includes(q) ||
        (c.platform ?? "").toLowerCase().includes(q) ||
        (c.category ?? "").toLowerCase().includes(q) ||
        (c.purpose ?? "").toLowerCase().includes(q)
    );
  }, [commands, query]);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      <PageHeader
        icon={Terminal}
        title="Befehle"
        description="Administrativer Befehlsreferenz mit Beispielen und Anwendungsfällen"
      />

      {/* Search bar */}
      <div className="mb-6 relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Befehl, Plattform oder Kategorie suchen..."
          className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
        />
        {query && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">
            {filtered.length} Treffer
          </span>
        )}
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && commands.length === 0 && (
        <EmptyState title="Keine Befehle vorhanden" description="Es wurden noch keine Befehle angelegt." />
      )}
      {!loading && !error && commands.length > 0 && filtered.length === 0 && (
        <EmptyState
          title="Keine Treffer"
          description={`Kein Befehl gefunden für "${query}".`}
        />
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((cmd) => (
            <div
              key={cmd.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-lg">
                  <Terminal size={13} className="text-emerald-400" />
                  <code className="text-sm font-mono font-semibold text-emerald-300">{cmd.command}</code>
                </div>
                {cmd.platform && (
                  <span className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2.5 py-1 rounded-lg">
                    <Monitor size={10} />
                    {cmd.platform}
                  </span>
                )}
                {cmd.category && (
                  <span className="flex items-center gap-1 text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2.5 py-1 rounded-lg">
                    <Tag size={10} />
                    {cmd.category}
                  </span>
                )}
              </div>

              {/* Purpose */}
              {cmd.purpose && (
                <p className="text-sm text-slate-300 leading-relaxed">{cmd.purpose}</p>
              )}

              {/* Example */}
              {cmd.example && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Beispiel</p>
                  <InlineCode>{cmd.example}</InlineCode>
                </div>
              )}

              {/* Use case & notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cmd.typical_use_case && (
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Typischer Anwendungsfall
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{cmd.typical_use_case}</p>
                  </div>
                )}
                {cmd.notes && (
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Notizen
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{cmd.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
