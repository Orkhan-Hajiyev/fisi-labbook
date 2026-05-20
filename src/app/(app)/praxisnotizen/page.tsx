"use client";

import { useEffect, useState, useMemo } from "react";
import {
  StickyNote,
  Plus,
  Search,
  X,
  Zap,
  Tag,
  CheckSquare,
  Flag,
  Link2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import NoteCard from "@/components/NoteCard";
import NoteForm, { type NoteFormData } from "@/components/NoteForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiUserNote } from "@/lib/types";

// ── Constants ─────────────────────────────────────────────────────────────

const STATUS_OPTS = [
  { value: "offen",          label: "Offen"          },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "erledigt",       label: "Erledigt"       },
  { value: "archiviert",     label: "Archiviert"     },
];

const PRIORITY_OPTS = [
  { value: "niedrig", label: "Niedrig" },
  { value: "mittel",  label: "Mittel"  },
  { value: "hoch",    label: "Hoch"    },
];

const CATEGORY_OPTS = [
  "Allgemein", "Labor", "Fehleranalyse", "Befehl",
  "Netzwerk", "Windows Server", "Linux", "Docker", "Praktikum", "Idee",
];

const FEATURE_CARDS = [
  { icon: Zap,         title: "Schnelle Notizen",           desc: "Technische Notizen und Beobachtungen schnell erfassen und speichern.",             accent: "blue"    },
  { icon: Tag,         title: "Tags und Kategorien",        desc: "Notizen mit Tags, Kategorien und Themenfeldern strukturieren.",                     accent: "violet"  },
  { icon: CheckSquare, title: "Aufgabenstatus",             desc: "Aufgaben und To-dos mit Status verfolgen: offen, in Bearbeitung, erledigt.",         accent: "emerald" },
  { icon: Flag,        title: "Priorität",                  desc: "Notizen nach Priorität (Niedrig / Mittel / Hoch) organisieren.",                    accent: "amber"   },
  { icon: Link2,       title: "Verknüpfung mit Laboren",    desc: "Notizen direkt mit Laboren, Systemen oder Fehleranalysen verknüpfen.",               accent: "cyan"    },
  { icon: Sparkles,    title: "Spätere KI-Zusammenfassung", desc: "Automatische Zusammenfassungen und Auswertungen durch KI-Integration.",             accent: "slate"   },
];

const accentMap: Record<string, string> = {
  blue:    "bg-blue-500/10 border-blue-500/15 text-blue-400",
  violet:  "bg-violet-500/10 border-violet-500/15 text-violet-400",
  emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400",
  amber:   "bg-amber-500/10 border-amber-500/15 text-amber-400",
  cyan:    "bg-cyan-500/10 border-cyan-500/15 text-cyan-400",
  slate:   "bg-slate-500/10 border-slate-500/15 text-slate-400",
};

const selectCls =
  "text-xs px-3 py-1.5 rounded-lg bg-[#0d0f14] border border-white/10 text-slate-400 focus:outline-none focus:border-blue-500/30 cursor-pointer transition-all";

// ── Types ─────────────────────────────────────────────────────────────────

interface Notif { type: "success" | "error"; message: string; }

// ── Public view (unauthenticated) ─────────────────────────────────────────

function PublicView() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={StickyNote}
        title="Praxisnotizen"
        description="Persönlicher Arbeitsbereich für technische Notizen und FISI-Dokumentation"
      />

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          Praxisnotizen ist als persönlicher Arbeitsbereich für technische Notizen,
          Tagesaufgaben, Troubleshooting-Ideen, Befehle, Tags und strukturierte
          FISI-Dokumentation vorgesehen.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          Zum Erstellen und Verwalten eigener Praxisnotizen ist ein kostenloses
          OrikOS-Konto erforderlich.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/registrieren"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-sm font-medium text-slate-300 hover:text-white transition-all"
          >
            Einloggen
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Funktionen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_CARDS.map(({ icon: Icon, title, desc, accent }) => (
            <div key={title} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${accentMap[accent]}`}>
                <Icon size={14} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function PraxisNotizenPage() {
  const { user, loading: authLoading } = useAuth();

  // Notes — null means "not yet fetched"; avoids synchronous setState in effects
  const [notes, setNotes] = useState<FisiUserNote[] | null>(null);
  const [notesError, setNotesError] = useState(false);

  // UI
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editNote,       setEditNote]       = useState<FisiUserNote | null>(null);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [filterStatus,   setFilterStatus]   = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [notif,          setNotif]          = useState<Notif | null>(null);

  // Derived: loading = user is set but notes haven't arrived yet
  const notesLoading = !!user && notes === null && !notesError;

  // ── Fetch notes when user is confirmed ────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("fisi_user_notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setNotesError(true);
          setNotes([]);
        } else {
          setNotes((data as FisiUserNote[]) ?? []);
        }
      });
  }, [user]);

  // ── Notification ───────────────────────────────────────────────────────
  function showNotif(type: Notif["type"], message: string) {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 4000);
  }

  // ── CRUD ───────────────────────────────────────────────────────────────
  async function handleCreate(data: NoteFormData): Promise<void> {
    const { data: created, error } = await supabase!
      .from("fisi_user_notes")
      .insert({
        user_id:      user!.id,
        title:        data.title,
        content:      data.content      || null,
        category:     data.category     || null,
        priority:     data.priority,
        status:       data.status,
        tags:         data.tags,
        related_area: data.related_area || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    setNotes((prev) => [created as FisiUserNote, ...(prev ?? [])]);
    setShowCreateForm(false);
    showNotif("success", "Notiz wurde erstellt.");
  }

  async function handleUpdate(data: NoteFormData): Promise<void> {
    const { data: updated, error } = await supabase!
      .from("fisi_user_notes")
      .update({
        title:        data.title,
        content:      data.content      || null,
        category:     data.category     || null,
        priority:     data.priority,
        status:       data.status,
        tags:         data.tags,
        related_area: data.related_area || null,
      })
      .eq("id", editNote!.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    setNotes((prev) =>
      (prev ?? []).map((n) => (n.id === editNote!.id ? (updated as FisiUserNote) : n))
    );
    setEditNote(null);
    showNotif("success", "Notiz wurde aktualisiert.");
  }

  async function handleDelete(id: string): Promise<void> {
    const { error } = await supabase!.from("fisi_user_notes").delete().eq("id", id);
    if (error) {
      showNotif("error", "Fehler beim Löschen der Notiz.");
      return;
    }
    setNotes((prev) => (prev ?? []).filter((n) => n.id !== id));
    showNotif("success", "Notiz wurde gelöscht.");
  }

  // ── Filtered notes ─────────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    return notes.filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        (note.content ?? "").toLowerCase().includes(q) ||
        (note.category ?? "").toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q));
      return (
        matchesSearch &&
        (!filterStatus   || note.status   === filterStatus) &&
        (!filterCategory || note.category === filterCategory) &&
        (!filterPriority || note.priority === filterPriority)
      );
    });
  }, [notes, searchQuery, filterStatus, filterCategory, filterPriority]);

  const hasActiveFilters = !!(filterStatus || filterCategory || filterPriority);

  // ── Render guards ──────────────────────────────────────────────────────
  if (supabaseConfigMissing) return <SupabaseMissingBanner />;
  if (authLoading) return <LoadingState text="Bitte warten…" />;
  if (!user) return <PublicView />;

  // ── Workspace ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {notif && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium max-w-xs ${
            notif.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {notif.type === "success"
            ? <CheckCircle2 size={15} />
            : <AlertCircle size={15} />
          }
          {notif.message}
        </div>
      )}

      <PageHeader
        icon={StickyNote}
        title="Praxisnotizen"
        description="Ihr persönlicher Arbeitsbereich für technische Notizen, Tagesaufgaben, Troubleshooting-Ideen, Befehle, Tags und strukturierte FISI-Dokumentation."
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Notizen durchsuchen…"
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => { setShowCreateForm(true); setEditNote(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors shrink-0"
        >
          <Plus size={15} />
          Neue Notiz
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={filterStatus}   onChange={(e) => setFilterStatus(e.target.value)}   className={selectCls}>
          <option value="">Status</option>
          {STATUS_OPTS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectCls}>
          <option value="">Kategorie</option>
          {CATEGORY_OPTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={selectCls}>
          <option value="">Priorität</option>
          {PRIORITY_OPTS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
        {hasActiveFilters && (
          <button
            onClick={() => { setFilterStatus(""); setFilterCategory(""); setFilterPriority(""); }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <X size={11} />
            Filter zurücksetzen
          </button>
        )}
        {notes !== null && notes.length > 0 && (
          <span className="ml-auto text-[11px] text-slate-600">
            {filteredNotes.length} / {notes.length} Notizen
          </span>
        )}
      </div>

      {/* Inline create form */}
      {showCreateForm && (
        <NoteForm onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
      )}

      {/* Notes list */}
      {notesLoading && <LoadingState text="Praxisnotizen werden geladen…" />}

      {!notesLoading && notesError && (
        <div className="flex justify-center py-16">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 max-w-sm text-center">
            <p className="text-sm text-red-400 font-medium mb-1">Fehler beim Laden</p>
            <p className="text-xs text-red-400/70">Praxisnotizen konnten nicht geladen werden.</p>
          </div>
        </div>
      )}

      {!notesLoading && !notesError && notes !== null && notes.length === 0 && !showCreateForm && (
        <EmptyState
          title="Noch keine Praxisnotizen vorhanden"
          description="Erstellen Sie Ihre erste Notiz, um technische Aufgaben, Ideen oder Fehleranalysen strukturiert festzuhalten."
        />
      )}

      {!notesLoading && !notesError && filteredNotes.length === 0 && (notes?.length ?? 0) > 0 && (
        <EmptyState
          title="Keine Treffer"
          description="Keine Notiz entspricht den aktuellen Such- und Filterkriterien."
        />
      )}

      {!notesLoading && !notesError && filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(n) => { setEditNote(n); setShowCreateForm(false); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit modal — key forces remount when editing a different note */}
      {editNote && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-10 bg-black/70 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setEditNote(null); }}
        >
          <div className="w-full max-w-2xl my-4">
            <NoteForm
              key={editNote.id}
              note={editNote}
              onSave={handleUpdate}
              onCancel={() => setEditNote(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
