"use client";

import { useState } from "react";
import { Edit2, Trash2, Tag, Calendar, MapPin, AlertCircle } from "lucide-react";
import type { FisiUserNote } from "@/lib/types";

const priorityConfig: Record<string, { label: string; cls: string }> = {
  niedrig: { label: "Niedrig", cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20" },
  mittel:  { label: "Mittel",  cls: "bg-amber-500/15 text-amber-700 border-amber-500/20" },
  hoch:    { label: "Hoch",    cls: "bg-red-500/15 text-red-700 border-red-500/20" },
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  offen:          { label: "Offen",          cls: "bg-slate-500/15 text-slate-600 border-slate-500/20" },
  in_bearbeitung: { label: "In Bearbeitung", cls: "bg-blue-500/15 text-blue-700 border-blue-500/20" },
  erledigt:       { label: "Erledigt",       cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20" },
  archiviert:     { label: "Archiviert",     cls: "bg-slate-500/10 text-slate-600 border-slate-500/15" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface Props {
  note: FisiUserNote;
  onEdit: (note: FisiUserNote) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function NoteCard({ note, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priority = priorityConfig[note.priority ?? "mittel"] ?? priorityConfig.mittel;
  const status   = statusConfig[note.status ?? "offen"]     ?? statusConfig.offen;

  async function handleDelete() {
    setDeleting(true);
    await onDelete(note.id);
    setDeleting(false);
    setConfirmDelete(false);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-blue-50 hover:border-slate-200 transition-all duration-150 p-5 flex flex-col gap-3">
      {/* Status + Priority row */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border ${status.cls}`}>
          {status.label}
        </span>
        <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border ${priority.cls}`}>
          {priority.label}
        </span>
      </div>

      {/* Title + category */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">{note.title}</h3>
        {note.category && (
          <span className="inline-block mt-1 text-[11px] bg-blue-500/10 text-blue-800 border border-blue-500/15 px-2 py-0.5 rounded-md">
            {note.category}
          </span>
        )}
      </div>

      {/* Content preview */}
      {note.content && (
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{note.content}</p>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag size={10} className="text-slate-500 shrink-0" />
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-blue-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Related area */}
      {note.related_area && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <MapPin size={10} />
          <span>{note.related_area}</span>
        </div>
      )}

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Calendar size={10} />
          <span>{formatDate(note.updated_at)}</span>
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-red-700">
              <AlertCircle size={10} />
              Wirklich löschen?
            </span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-[11px] font-semibold text-red-700 hover:text-red-800 transition-colors disabled:opacity-50"
            >
              {deleting ? "…" : "Ja"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[11px] text-slate-600 hover:text-slate-700 transition-colors"
            >
              Nein
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onEdit(note)}
              className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-all"
            >
              <Edit2 size={11} />
              Bearbeiten
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={11} />
              Löschen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
