"use client";

import { useEffect, useState, useMemo } from "react";
import { Server, Network, Globe, Cpu, Plus, Search, X, Edit2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import SystemForm, { type SystemFormData } from "@/components/SystemForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiSystem, FisiUserSystem, FisiUserLab } from "@/lib/types";

// ── helpers ───────────────────────────────────────────────────────────────

type Notif = { type: "success" | "error"; message: string };

function normalizeServices(services: string[] | string | null): string[] {
  if (!services) return [];
  if (Array.isArray(services)) return services;
  try { const p = JSON.parse(services); if (Array.isArray(p)) return p; } catch {}
  return services.split(",").map((s) => s.trim()).filter(Boolean);
}

function NetRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon size={12} className="text-slate-600 shrink-0" />
      <span className="text-[11px] text-slate-500 w-20 shrink-0">{label}</span>
      <code className="text-xs text-cyan-300 font-mono bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded">{value}</code>
    </div>
  );
}

// ── UserSystemCard ────────────────────────────────────────────────────────

function UserSystemCard({
  system, userLabs, onEdit, onDelete,
}: { system: FisiUserSystem; userLabs: FisiUserLab[]; onEdit: (s: FisiUserSystem) => void; onDelete: (id: string) => Promise<void> }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const services = normalizeServices(system.services);
  const lab = userLabs.find((l) => l.id === system.lab_id);

  async function handleDelete() {
    setDeleting(true);
    await onDelete(system.id);
    setDeleting(false);
    setConfirmDelete(false);
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-3 flex flex-col">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
          <Server size={16} className="text-cyan-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white font-mono truncate">{system.hostname}</h3>
          {system.role && <p className="text-xs text-slate-500">{system.role}</p>}
        </div>
        {system.os && (
          <span className="ml-auto shrink-0 text-[11px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-md flex items-center gap-1.5">
            <Cpu size={10} />{system.os}
          </span>
        )}
      </div>

      {(system.ip_address || system.gateway || system.dns || system.domain_name) && (
        <div className="rounded-lg bg-[#0a0c10] border border-white/5 px-4 py-2 divide-y divide-white/5">
          <NetRow icon={Network} label="IP-Adresse" value={system.ip_address} />
          <NetRow icon={Globe} label="Gateway" value={system.gateway} />
          <NetRow icon={Globe} label="DNS" value={system.dns} />
          <NetRow icon={Globe} label="Domäne" value={system.domain_name} />
        </div>
      )}

      {services.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {services.map((s, i) => (
            <span key={i} className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}

      {system.notes && <p className="text-xs text-slate-400 leading-relaxed">{system.notes}</p>}
      {lab && <p className="text-[11px] text-slate-600">Labor: {lab.title}</p>}

      <div className="flex items-center justify-end pt-2 border-t border-white/5 mt-auto">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-red-400"><AlertCircle size={10} />Wirklich löschen?</span>
            <button onClick={handleDelete} disabled={deleting}
              className="text-[11px] font-semibold text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors">
              {deleting ? "…" : "Ja"}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">Nein</button>
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <button onClick={() => onEdit(system)}
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-all">
              <Edit2 size={11} />Bearbeiten
            </button>
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all">
              <Trash2 size={11} />Löschen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function SystemePage() {
  const { user } = useAuth();

  const [systems,  setSystems]  = useState<FisiSystem[]>([]);
  const [loading,  setLoading]  = useState(!supabaseConfigMissing);
  const [error,    setError]    = useState(false);

  const [userSystems,      setUserSystems]      = useState<FisiUserSystem[] | null>(null);
  const [userSystemsError, setUserSystemsError] = useState(false);
  const [userLabs,         setUserLabs]         = useState<FisiUserLab[]>([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editSystem,     setEditSystem]     = useState<FisiUserSystem | null>(null);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [notif,          setNotif]         = useState<Notif | null>(null);

  const userSystemsLoading = !!user && userSystems === null && !userSystemsError;

  const filteredUserSystems = useMemo(() => {
    if (!userSystems) return [];
    const q = searchQuery.toLowerCase();
    return userSystems.filter((s) =>
      !q || s.hostname.toLowerCase().includes(q) ||
      (s.os ?? "").toLowerCase().includes(q) ||
      (s.role ?? "").toLowerCase().includes(q) ||
      (s.ip_address ?? "").includes(q)
    );
  }, [userSystems, searchQuery]);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase.from("fisi_systems").select("*").order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(true); else setSystems(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("fisi_user_systems").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setUserSystemsError(true); setUserSystems([]); }
        else setUserSystems((data as FisiUserSystem[]) ?? []);
      });
    supabase.from("fisi_user_labs").select("*").eq("user_id", user.id).order("title", { ascending: true })
      .then(({ data }) => { setUserLabs((data as FisiUserLab[]) ?? []); });
  }, [user]);

  function showNotif(type: Notif["type"], message: string) {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 4000);
  }

  async function handleCreate(data: SystemFormData): Promise<void> {
    const { data: created, error: err } = await supabase!
      .from("fisi_user_systems")
      .insert({ user_id: user!.id, ...data, lab_id: data.lab_id || null, services: data.services || null })
      .select().single();
    if (err) throw new Error(err.message);
    setUserSystems((prev) => [created as FisiUserSystem, ...(prev ?? [])]);
    setShowCreateForm(false);
    showNotif("success", "System wurde erstellt.");
  }

  async function handleUpdate(data: SystemFormData): Promise<void> {
    const { data: updated, error: err } = await supabase!
      .from("fisi_user_systems")
      .update({ ...data, lab_id: data.lab_id || null, services: data.services || null })
      .eq("id", editSystem!.id).select().single();
    if (err) throw new Error(err.message);
    setUserSystems((prev) => (prev ?? []).map((s) => (s.id === editSystem!.id ? (updated as FisiUserSystem) : s)));
    setEditSystem(null);
    showNotif("success", "System wurde aktualisiert.");
  }

  async function handleDelete(id: string): Promise<void> {
    const { error: err } = await supabase!.from("fisi_user_systems").delete().eq("id", id);
    if (err) { showNotif("error", "Fehler beim Löschen."); return; }
    setUserSystems((prev) => (prev ?? []).filter((s) => s.id !== id));
    showNotif("success", "System wurde gelöscht.");
  }

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      {notif && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium max-w-xs ${
          notif.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {notif.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {notif.message}
        </div>
      )}

      <PageHeader icon={Server} title="Systeme" description="Infrastruktur- und Systemdokumentation verwalten" />

      {user && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meine Systeme</h2>
            <button onClick={() => { setShowCreateForm(true); setEditSystem(null); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
              <Plus size={13} />Neues System
            </button>
          </div>

          {userSystems && userSystems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-0">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Systeme durchsuchen…"
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {showCreateForm && (
            <div className="mb-4">
              <SystemForm userLabs={userLabs} onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {userSystemsLoading && <LoadingState text="Meine Systeme werden geladen…" />}
          {!userSystemsLoading && userSystemsError && (
            <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-5 text-center mb-6">
              <p className="text-sm text-red-400">Fehler beim Laden der Systeme.</p>
            </div>
          )}
          {!userSystemsLoading && !userSystemsError && userSystems !== null && userSystems.length === 0 && !showCreateForm && (
            <EmptyPersonalState
              title="Noch keine eigenen Systeme vorhanden"
              description="Dokumentieren Sie Ihre Laborumgebung, Hostnames, IP-Adressen und Dienste."
              buttonLabel="Erstes System erstellen"
              onAction={() => setShowCreateForm(true)}
            />
          )}
          {!userSystemsLoading && !userSystemsError && filteredUserSystems.length === 0 && (userSystems?.length ?? 0) > 0 && (
            <EmptyState title="Keine Treffer" description="Kein System entspricht dem Suchbegriff." />
          )}
          {!userSystemsLoading && !userSystemsError && filteredUserSystems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
              {filteredUserSystems.map((sys) => (
                <UserSystemCard key={sys.id} system={sys} userLabs={userLabs}
                  onEdit={(s) => { setEditSystem(s); setShowCreateForm(false); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ReferenceSection title="Demo-Systeme">
        {loading && <LoadingState />}
        {error && <ErrorState />}
        {!loading && !error && systems.length === 0 && (
          <EmptyState title="Keine Demo-Systeme vorhanden" description="Es wurden noch keine Beispiel-Systeme angelegt." />
        )}
        {!loading && !error && systems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {systems.map((sys) => {
              const services = normalizeServices(sys.services);
              return (
                <div key={sys.id} className="rounded-xl border border-white/5 bg-white/[0.015] p-5 space-y-3 opacity-80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
                      <Server size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-300 font-mono">{sys.hostname}</h3>
                      {sys.role && <p className="text-xs text-slate-500">{sys.role}</p>}
                    </div>
                    {sys.os && (
                      <span className="ml-auto text-[11px] bg-white/5 border border-white/10 text-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                        <Cpu size={10} />{sys.os}
                      </span>
                    )}
                  </div>
                  <div className="rounded-lg bg-[#0a0c10] border border-white/5 px-4 py-2 divide-y divide-white/5">
                    <NetRow icon={Network} label="IP-Adresse" value={sys.ip_address} />
                    <NetRow icon={Globe} label="Gateway" value={sys.gateway} />
                    <NetRow icon={Globe} label="DNS" value={sys.dns} />
                    <NetRow icon={Globe} label="Domäne" value={sys.domain_name} />
                  </div>
                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {services.map((s, i) => (
                        <span key={i} className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ReferenceSection>

      {editSystem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-10 bg-black/70 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setEditSystem(null); }}>
          <div className="w-full max-w-2xl my-4">
            <SystemForm key={editSystem.id} system={editSystem} userLabs={userLabs} onSave={handleUpdate} onCancel={() => setEditSystem(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
