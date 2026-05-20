"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FisiUserNote } from "@/lib/types";

const CATEGORIES = [
  "Allgemein", "Labor", "Fehleranalyse", "Befehl",
  "Netzwerk", "Windows Server", "Linux", "Docker", "Praktikum", "Idee",
];

const PRIORITY_OPTIONS = [
  { value: "niedrig", label: "Niedrig" },
  { value: "mittel",  label: "Mittel"  },
  { value: "hoch",    label: "Hoch"    },
];

const STATUS_OPTIONS = [
  { value: "offen",          label: "Offen"          },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "erledigt",       label: "Erledigt"       },
  { value: "archiviert",     label: "Archiviert"     },
];

const RELATED_AREAS = [
  "Labore", "Systeme", "Befehle", "Fehleranalyse", "Docker-Dienste", "Sonstiges",
];

export interface NoteFormData {
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  tags: string[];
  related_area: string;
}

interface Props {
  note?: FisiUserNote;
  onSave: (data: NoteFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

export default function NoteForm({ note, onSave, onCancel }: Props) {
  const [title,       setTitle]       = useState(note?.title       ?? "");
  const [content,     setContent]     = useState(note?.content     ?? "");
  const [category,    setCategory]    = useState(note?.category    ?? "");
  const [priority,    setPriority]    = useState(note?.priority    ?? "mittel");
  const [status,      setStatus]      = useState(note?.status      ?? "offen");
  const [tagsInput,   setTagsInput]   = useState(note?.tags.join(", ") ?? "");
  const [relatedArea, setRelatedArea] = useState(note?.related_area ?? "");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Bitte geben Sie einen Titel ein.");
      return;
    }
    setError(null);
    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSave({
        title:        title.trim(),
        content,
        category,
        priority,
        status,
        tags,
        related_area: relatedArea,
      });
    } catch {
      setError("Fehler beim Speichern der Notiz. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0f1623] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {note ? "Notiz bearbeiten" : "Neue Notiz erstellen"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Schließen"
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titel */}
        <div>
          <label className={labelCls}>Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel der Notiz"
            className={inputCls}
            required
          />
        </div>

        {/* Inhalt */}
        <div>
          <label className={labelCls}>Inhalt</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Inhalt, Beschreibung oder Notizen…"
            rows={5}
            className={inputCls + " resize-none"}
          />
        </div>

        {/* Kategorie / Priorität / Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls + " cursor-pointer"}
            >
              <option value="">Keine</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Priorität</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputCls + " cursor-pointer"}
            >
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls + " cursor-pointer"}
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bereich / Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Bereich</label>
            <select
              value={relatedArea}
              onChange={(e) => setRelatedArea(e.target.value)}
              className={inputCls + " cursor-pointer"}
            >
              <option value="">Keiner</option>
              {RELATED_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tags (kommagetrennt)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="netzwerk, windows, dhcp"
              className={inputCls}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
          >
            {loading ? "Wird gespeichert…" : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
