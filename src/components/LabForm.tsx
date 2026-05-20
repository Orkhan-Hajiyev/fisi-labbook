"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FisiUserLab } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "planned",     label: "Geplant"       },
  { value: "in_progress", label: "In Bearbeitung" },
  { value: "completed",   label: "Abgeschlossen"  },
  { value: "archived",    label: "Archiviert"     },
];

export interface LabFormData {
  title: string;
  topic: string;
  environment: string;
  goal: string;
  description: string;
  status: string;
  started_at: string;
  completed_at: string;
}

interface Props {
  lab?: FisiUserLab;
  onSave: (data: LabFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

export default function LabForm({ lab, onSave, onCancel }: Props) {
  const [title,       setTitle]       = useState(lab?.title              ?? "");
  const [topic,       setTopic]       = useState(lab?.topic              ?? "");
  const [environment, setEnvironment] = useState(lab?.environment        ?? "");
  const [goal,        setGoal]        = useState(lab?.goal               ?? "");
  const [description, setDescription] = useState(lab?.description        ?? "");
  const [status,      setStatus]      = useState(lab?.status             ?? "planned");
  const [startedAt,   setStartedAt]   = useState(lab?.started_at?.slice(0, 10)   ?? "");
  const [completedAt, setCompletedAt] = useState(lab?.completed_at?.slice(0, 10) ?? "");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Bitte geben Sie einen Titel ein."); return; }
    setError(null);
    setLoading(true);
    try {
      await onSave({ title: title.trim(), topic, environment, goal, description, status, started_at: startedAt, completed_at: completedAt });
    } catch {
      setError("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0f1623] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{lab ? "Labor bearbeiten" : "Neues Labor erstellen"}</h3>
        <button type="button" onClick={onCancel} aria-label="Schließen"
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Titel</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel des Labors" className={inputCls} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Thema</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="z.B. Active Directory" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Umgebung</label>
            <input type="text" value={environment} onChange={(e) => setEnvironment(e.target.value)}
              placeholder="z.B. VMware, Hyper-V" className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Ziel</label>
          <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)}
            placeholder="Ziel des Labors" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Beschreibung</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung oder Notizen…" rows={4} className={inputCls + " resize-none"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Startdatum</label>
            <input type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Abschlussdatum</label>
            <input type="date" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            Abbrechen
          </button>
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors">
            {loading ? "Wird gespeichert…" : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
