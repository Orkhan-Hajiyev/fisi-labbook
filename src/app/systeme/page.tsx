"use client";

import { useEffect, useState } from "react";
import { Server, Network, Globe, Cpu } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import type { FisiSystem } from "@/lib/types";

function normalizeServices(services: string[] | string | null): string[] {
  if (!services) return [];
  if (Array.isArray(services)) return services;
  try {
    const parsed = JSON.parse(services);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [services];
}

function NetField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon size={12} className="text-slate-600 shrink-0" />
      <span className="text-[11px] text-slate-500 w-20 shrink-0">{label}</span>
      <code className="text-xs text-cyan-300 font-mono bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded">
        {value}
      </code>
    </div>
  );
}

export default function SystemePage() {
  const [systems, setSystems] = useState<FisiSystem[]>([]);
  const [loading, setLoading] = useState(!supabaseConfigMissing);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_systems")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(true);
        else setSystems(data ?? []);
        setLoading(false);
      });
  }, []);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      <PageHeader
        icon={Server}
        title="Systeme"
        description="Infrastruktur- und Systemdokumentation der Laborumgebungen"
      />

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && systems.length === 0 && (
        <EmptyState
          title="Keine Systeme vorhanden"
          description="Es wurden noch keine System-Einträge angelegt."
        />
      )}
      {!loading && !error && systems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {systems.map((sys) => {
            const services = normalizeServices(sys.services);
            return (
              <div
                key={sys.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
                    <Server size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">{sys.hostname}</h3>
                    {sys.role && <p className="text-xs text-slate-500">{sys.role}</p>}
                  </div>
                  {sys.os && (
                    <span className="ml-auto text-[11px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                      <Cpu size={10} />
                      {sys.os}
                    </span>
                  )}
                </div>

                {/* Network info */}
                <div className="rounded-lg bg-[#0a0c10] border border-white/5 px-4 py-2 divide-y divide-white/5">
                  <NetField icon={Network} label="IP-Adresse" value={sys.ip_address} />
                  <NetField icon={Globe} label="Gateway" value={sys.gateway} />
                  <NetField icon={Globe} label="DNS" value={sys.dns} />
                  <NetField icon={Globe} label="Domäne" value={sys.domain_name} />
                </div>

                {/* Services */}
                {services.length > 0 && (
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                      Dienste
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {services.map((s, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {sys.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {sys.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
