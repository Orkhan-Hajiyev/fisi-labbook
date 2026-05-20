"use client";

import { useEffect, useState } from "react";
import { Bug, AlertCircle, Search as SearchIcon, Lightbulb, Target, Tag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import type { FisiTroubleshootingCase } from "@/lib/types";

type DifficultyConfig = { label: string; className: string };

function getDifficultyConfig(d: string | null): DifficultyConfig {
  switch (d?.toLowerCase()) {
    case "leicht":
    case "easy":
      return { label: "Leicht", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
    case "mittel":
    case "medium":
      return { label: "Mittel", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
    case "schwer":
    case "hard":
      return { label: "Schwer", className: "bg-red-500/15 text-red-400 border-red-500/20" };
    default:
      return { label: d ?? "—", className: "bg-white/5 text-slate-400 border-white/10" };
  }
}

function Step({
  icon: Icon,
  label,
  value,
  accent = "slate",
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
  accent?: string;
}) {
  if (!value) return null;
  const colors: Record<string, string> = {
    slate: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  };
  const cls = colors[accent] ?? colors.slate;
  return (
    <div className="flex gap-3">
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${cls}`}>
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

export default function FehleranalysePage() {
  const [cases, setCases] = useState<FisiTroubleshootingCase[]>([]);
  const [loading, setLoading] = useState(!supabaseConfigMissing);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_troubleshooting_cases")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(true);
        else setCases(data ?? []);
        setLoading(false);
      });
  }, []);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      <PageHeader
        icon={Bug}
        title="Fehleranalyse"
        description="Strukturierte Troubleshooting-Fälle: Problem, Prüfung, Ursache, Lösung"
      />

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && cases.length === 0 && (
        <EmptyState
          title="Keine Fehleranalysen vorhanden"
          description="Es wurden noch keine Troubleshooting-Fälle angelegt."
        />
      )}
      {!loading && !error && cases.length > 0 && (
        <div className="space-y-5">
          {cases.map((c) => {
            const diff = getDifficultyConfig(c.difficulty);
            return (
              <div
                key={c.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-5"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                    {c.category && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <Tag size={10} />
                        {c.category}
                      </span>
                    )}
                  </div>
                  {c.difficulty && (
                    <span
                      className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border ${diff.className}`}
                    >
                      {diff.label}
                    </span>
                  )}
                </div>

                {/* Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Step icon={AlertCircle} label="Symptome" value={c.symptoms} accent="amber" />
                  <Step icon={SearchIcon} label="Prüfschritte" value={c.checks} accent="blue" />
                  <Step icon={Lightbulb} label="Ursache" value={c.root_cause} accent="slate" />
                  <Step icon={Target} label="Lösung" value={c.solution} accent="emerald" />
                </div>

                {/* Result */}
                {c.result && (
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-4 py-3">
                    <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">
                      Ergebnis
                    </p>
                    <p className="text-xs text-emerald-300 leading-relaxed">{c.result}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
