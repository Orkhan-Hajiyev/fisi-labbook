"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FlaskConical, Calendar, CheckCircle2, Clock, Archive, Circle,
  Plus, Search, X, Edit2, Trash2, AlertCircle, CheckCircle, Copy, Lock,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import LabForm, { type LabFormData } from "@/components/LabForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiLab, FisiUserLab } from "@/lib/types";

// ── helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  planned:     { label: "Geplant",        cls: "bg-slate-500/15 text-slate-400 border-slate-500/20",   icon: <Circle size={10} /> },
  in_progress: { label: "In Bearbeitung", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20",      icon: <Clock size={10} /> },
  completed:   { label: "Abgeschlossen",  cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 size={10} /> },
  archived:    { label: "Archiviert",     cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",   icon: <Archive size={10} /> },
};

function getStatusCfg(s: string | null) {
  return STATUS_CFG[s ?? ""] ?? { label: s ?? "—", cls: "bg-white/5 text-slate-400 border-white/10", icon: <Circle size={10} /> };
}

type Notif = { type: "success" | "error"; message: string };

// ── UserLabCard ───────────────────────────────────────────────────────────

function UserLabCard({
  lab, onEdit, onDelete,
}: { lab: FisiUserLab; onEdit: (l: FisiUserLab) => void; onDelete: (id: string) => Promise<void> }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const status = getStatusCfg(lab.status);

  async function handleDelete() {
    setDeleting(true);
    await onDelete(lab.id);
    setDeleting(false);
    setConfirmDelete(false);
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-3 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-white leading-snug">{lab.title}</h3>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.cls}`}>
          {status.icon}{status.label}
        </span>
      </div>

      {(lab.topic || lab.environment) && (
        <div className="flex flex-wrap gap-2">
          {lab.topic && (
            <span className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2 py-0.5 rounded-md">{lab.topic}</span>
          )}
          {lab.environment && (
            <span className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2 py-0.5 rounded-md">{lab.environment}</span>
          )}
        </div>
      )}

      {lab.goal && <p className="text-xs text-slate-400 leading-relaxed">{lab.goal}</p>}
      {lab.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{lab.description}</p>}

      {(lab.started_at || lab.completed_at) && (
        <div className="flex flex-wrap gap-4">
          {lab.started_at && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={11} />Start: {formatDate(lab.started_at)}
            </div>
          )}
          {lab.completed_at && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 size={11} />Abschluss: {formatDate(lab.completed_at)}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end pt-2 border-t border-white/5 mt-auto">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-red-400"><AlertCircle size={10} />Wirklich löschen?</span>
            <button onClick={handleDelete} disabled={deleting}
              className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
              {deleting ? "…" : "Ja"}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">Nein</button>
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <button onClick={() => onEdit(lab)}
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

// ── DemoLabCard ───────────────────────────────────────────────────────────

function DemoLabCard({ lab, user, onCopied }: { lab: FisiLab; user: ReturnType<typeof useAuth>["user"]; onCopied: (msg: string) => void }) {
  const status = getStatusCfg(lab.status);
  const [copying, setCopying] = useState(false);

  async function handleCopy() {
    if (!user || !supabase) return;
    setCopying(true);
    const { error: err } = await supabase.from("fisi_user_labs").insert({
      user_id: user.id,
      title: lab.title,
      topic: lab.topic,
      environment: lab.environment,
      goal: lab.goal,
      description: lab.description,
      status: lab.status,
      started_at: lab.started_at,
      completed_at: lab.completed_at,
    });
    setCopying(false);
    if (err) { onCopied("Fehler beim Übernehmen."); return; }
    onCopied("Vorlage wurde in Ihren persönlichen Arbeitsbereich übernommen.");
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.015] p-5 space-y-3 opacity-80">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-300 leading-snug">{lab.title}</h3>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.cls}`}>
          {status.icon}{status.label}
        </span>
      </div>
      {(lab.topic || lab.environment) && (
        <div className="flex flex-wrap gap-2">
          {lab.topic && <span className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2 py-0.5 rounded-md">{lab.topic}</span>}
          {lab.environment && <span className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2 py-0.5 rounded-md">{lab.environment}</span>}
        </div>
      )}
      {lab.goal && <p className="text-xs text-slate-500 leading-relaxed">{lab.goal}</p>}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[10px] text-slate-700 uppercase tracking-wider font-medium">Demo</span>
        {user ? (
          <button onClick={handleCopy} disabled={copying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/35 text-xs font-medium text-blue-400 hover:text-blue-300 transition-all disabled:opacity-50">
            <Copy size={11} />
            {copying ? "Wird übernommen…" : "Als Vorlage übernehmen"}
          </button>
        ) : (
          <button disabled className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 text-[11px] text-slate-600 cursor-not-allowed">
            <Lock size={11} />
            Anmeldung erforderlich
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function LaborePage() {
  const { user } = useAuth();

  const [labs,      setLabs]      = useState<FisiLab[]>([]);
  const [loading,   setLoading]   = useState(!supabaseConfigMissing);
  const [error,     setError]     = useState(false);

  const [userLabs,      setUserLabs]      = useState<FisiUserLab[] | null>(null);
  const [userLabsError, setUserLabsError] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editLab,        setEditLab]        = useState<FisiUserLab | null>(null);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [filterStatus,   setFilterStatus]  = useState("");
  const [notif,          setNotif]         = useState<Notif | null>(null);

  const userLabsLoading = !!user && userLabs === null && !userLabsError;

  const filteredUserLabs = useMemo(() => {
    if (!userLabs) return [];
    return userLabs.filter((lab) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || lab.title.toLowerCase().includes(q) || (lab.topic ?? "").toLowerCase().includes(q);
      return matchesSearch && (!filterStatus || lab.status === filterStatus);
    });
  }, [userLabs, searchQuery, filterStatus]);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase.from("fisi_labs").select("*").order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(true); else setLabs(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("fisi_user_labs").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setUserLabsError(true); setUserLabs([]); }
        else setUserLabs((data as FisiUserLab[]) ?? []);
      });
  }, [user]);

  function showNotif(type: Notif["type"], message: string) {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 4000);
  }

  async function handleCreate(data: LabFormData): Promise<void> {
    const { data: created, error: err } = await supabase!
      .from("fisi_user_labs")
      .insert({ user_id: user!.id, ...data, started_at: data.started_at || null, completed_at: data.completed_at || null })
      .select().single();
    if (err) throw new Error(err.message);
    setUserLabs((prev) => [created as FisiUserLab, ...(prev ?? [])]);
    setShowCreateForm(false);
    showNotif("success", "Labor wurde erstellt.");
  }

  async function handleUpdate(data: LabFormData): Promise<void> {
    const { data: updated, error: err } = await supabase!
      .from("fisi_user_labs")
      .update({ ...data, started_at: data.started_at || null, completed_at: data.completed_at || null })
      .eq("id", editLab!.id).select().single();
    if (err) throw new Error(err.message);
    setUserLabs((prev) => (prev ?? []).map((l) => (l.id === editLab!.id ? (updated as FisiUserLab) : l)));
    setEditLab(null);
    showNotif("success", "Labor wurde aktualisiert.");
  }

  async function handleDelete(id: string): Promise<void> {
    const { error: err } = await supabase!.from("fisi_user_labs").delete().eq("id", id);
    if (err) { showNotif("error", "Fehler beim Löschen."); return; }
    setUserLabs((prev) => (prev ?? []).filter((l) => l.id !== id));
    showNotif("success", "Labor wurde gelöscht.");
  }

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  const selectCls = "text-xs px-3 py-1.5 rounded-lg bg-[#0d0f14] border border-white/10 text-slate-400 focus:outline-none focus:border-blue-500/30 cursor-pointer transition-all";

  return (
    <div>
      {/* Toast */}
      {notif && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium max-w-xs ${
          notif.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {notif.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {notif.message}
        </div>
      )}

      <PageHeader icon={FlaskConical} title="Labore" description="IT-Laborumgebungen dokumentieren und verwalten" />

      {/* User workspace */}
      {user && (
        <div>
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meine Labore</h2>
            <button
              onClick={() => { setShowCreateForm(true); setEditLab(null); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
            >
              <Plus size={13} />Neues Labor
            </button>
          </div>

          {/* Search + filter */}
          {userLabs && userLabs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-0">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Labore durchsuchen…"
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                    <X size={12} />
                  </button>
                )}
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls}>
                <option value="">Alle Status</option>
                <option value="planned">Geplant</option>
                <option value="in_progress">In Bearbeitung</option>
                <option value="completed">Abgeschlossen</option>
                <option value="archived">Archiviert</option>
              </select>
            </div>
          )}

          {/* Create form */}
          {showCreateForm && (
            <div className="mb-4">
              <LabForm onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {/* States */}
          {userLabsLoading && <LoadingState text="Meine Labore werden geladen…" />}
          {!userLabsLoading && userLabsError && (
            <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-5 text-center mb-6">
              <p className="text-sm text-red-400">Fehler beim Laden der Labore.</p>
            </div>
          )}
          {!userLabsLoading && !userLabsError && userLabs !== null && userLabs.length === 0 && !showCreateForm && (
            <EmptyPersonalState
              title="Noch keine eigenen Labore vorhanden"
              description="Erstellen Sie Ihr erstes Labor, um Ihre Systemintegration-Praxis zu dokumentieren."
              buttonLabel="Erstes Labor erstellen"
              onAction={() => setShowCreateForm(true)}
            />
          )}
          {!userLabsLoading && !userLabsError && filteredUserLabs.length === 0 && (userLabs?.length ?? 0) > 0 && (
            <EmptyState title="Keine Treffer" description="Kein Labor entspricht den aktuellen Suchkriterien." />
          )}
          {!userLabsLoading && !userLabsError && filteredUserLabs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
              {filteredUserLabs.map((lab) => (
                <UserLabCard key={lab.id} lab={lab}
                  onEdit={(l) => { setEditLab(l); setShowCreateForm(false); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reference section */}
      <ReferenceSection title="Demo-Labore">
        {loading && <LoadingState />}
        {error && <ErrorState />}
        {!loading && !error && labs.length === 0 && (
          <EmptyState title="Keine Demo-Labore vorhanden" description="Es wurden noch keine Beispiel-Labore angelegt." />
        )}
        {!loading && !error && labs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {labs.map((lab) => (
              <DemoLabCard key={lab.id} lab={lab} user={user}
                onCopied={(msg) => showNotif("success", msg)} />
            ))}
          </div>
        )}
      </ReferenceSection>

      {/* Edit modal */}
      {editLab && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-10 bg-black/70 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setEditLab(null); }}>
          <div className="w-full max-w-2xl my-4">
            <LabForm key={editLab.id} lab={editLab} onSave={handleUpdate} onCancel={() => setEditLab(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
