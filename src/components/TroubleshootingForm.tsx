"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FisiUserTroubleshootingCase } from "@/lib/types";

export interface TroubleshootingFormData {
  title: string;
  category: string;
  difficulty: string;
  symptoms: string;
  checks: string;
  root_cause: string;
  solution: string;
  result: string;
}

interface Props {
  item?: FisiUserTroubleshootingCase;
  onSave: (data: TroubleshootingFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";
const areaCls  = inputCls + " resize-none";

const DIFFICULTY_OPTIONS = [
  { value: "einfach",        label: "Einfach"        },
  { value: "mittel",         label: "Mittel"         },
  { value: "fortgeschritten", label: "Fortgeschritten" },
];

const CATEGORIES = [
  "Netzwerk", "Active Directory", "DNS", "DHCP", "Windows Server",
  "Linux", "Docker", "Firewall", "Hardware", "Sonstiges",
];

export default function TroubleshootingForm({ item, onSave, onCancel }: Props) {
  const [title,     setTitle]     = useState(item?.title      ?? "");
  const [category,  setCategory]  = useState(item?.category   ?? "");
  const [difficulty, setDifficulty] = useState(item?.difficulty ?? "mittel");
  const [symptoms,  setSymptoms]  = useState(item?.symptoms   ?? "");
  const [checks,    setChecks]    = useState(item?.checks     ?? "");
  const [rootCause, setRootCause] = useState(item?.root_cause ?? "");
  const [solution,  setSolution]  = useState(item?.solution   ?? "");
  const [result,    setResult]    = useState(item?.result     ?? "");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Bitte geben Sie einen Titel ein."); return; }
    setError(null);
    setLoading(true);
    try {
      await onSave({ title: title.trim(), category, difficulty, symptoms, checks, root_cause: rootCause, solution, result });
    } catch {
      setError("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0f1623] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {item ? "Fehleranalyse bearbeiten" : "Neue Fehleranalyse erstellen"}
        </h3>
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
            placeholder="Kurze Bezeichnung des Problems" className={inputCls} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              <option value="">Keine</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Schwierigkeit</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Symptome</label>
            <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Beobachtete Symptome…" rows={3} className={areaCls} />
          </div>
          <div>
            <label className={labelCls}>Prüfschritte</label>
            <textarea value={checks} onChange={(e) => setChecks(e.target.value)}
              placeholder="Durchgeführte Prüfungen…" rows={3} className={areaCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Ursache</label>
            <textarea value={rootCause} onChange={(e) => setRootCause(e.target.value)}
              placeholder="Festgestellte Ursache…" rows={3} className={areaCls} />
          </div>
          <div>
            <label className={labelCls}>Lösung</label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)}
              placeholder="Angewandte Lösung…" rows={3} className={areaCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Ergebnis</label>
          <textarea value={result} onChange={(e) => setResult(e.target.value)}
            placeholder="Finales Ergebnis / Bestätigung der Lösung…" rows={2} className={areaCls} />
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
