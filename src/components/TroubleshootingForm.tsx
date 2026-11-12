"use client";

import { T, useT } from "@/components/TranslatedText";

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
  prefill?: Partial<TroubleshootingFormData>;
  onSave: (data: TroubleshootingFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#f3f8ff] border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-600 mb-1.5";
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

export default function TroubleshootingForm({ item, prefill, onSave, onCancel }: Props) {
  const translateUI = useT();
  const [title,      setTitle]      = useState(item?.title      ?? prefill?.title      ?? "");
  const [category,   setCategory]   = useState(item?.category   ?? prefill?.category   ?? "");
  const [difficulty, setDifficulty] = useState(item?.difficulty ?? prefill?.difficulty ?? "mittel");
  const [symptoms,   setSymptoms]   = useState(item?.symptoms   ?? prefill?.symptoms   ?? "");
  const [checks,     setChecks]     = useState(item?.checks     ?? prefill?.checks     ?? "");
  const [rootCause,  setRootCause]  = useState(item?.root_cause ?? prefill?.root_cause ?? "");
  const [solution,   setSolution]   = useState(item?.solution   ?? prefill?.solution   ?? "");
  const [result,     setResult]     = useState(item?.result     ?? prefill?.result     ?? "");
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
    <div className="rounded-xl border border-blue-500/15 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          {item ? "Fehleranalyse bearbeiten" : "Neue Fehleranalyse erstellen"}
        </h3>
        <button type="button" onClick={onCancel} aria-label={translateUI("Schließen")}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-blue-50 transition-colors">
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}><T>Titel</T></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={translateUI("Kurze Bezeichnung des Problems")} className={inputCls} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><T>Kategorie</T></label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              <option value=""><T>Keine</T></option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}><T>Schwierigkeit</T></label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}><T>{label}</T></option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><T>Symptome</T></label>
            <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              placeholder={translateUI("Beobachtete Symptome…")} rows={3} className={areaCls} />
          </div>
          <div>
            <label className={labelCls}><T>Prüfschritte</T></label>
            <textarea value={checks} onChange={(e) => setChecks(e.target.value)}
              placeholder={translateUI("Durchgeführte Prüfungen…")} rows={3} className={areaCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><T>Ursache</T></label>
            <textarea value={rootCause} onChange={(e) => setRootCause(e.target.value)}
              placeholder={translateUI("Festgestellte Ursache…")} rows={3} className={areaCls} />
          </div>
          <div>
            <label className={labelCls}><T>Lösung</T></label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)}
              placeholder={translateUI("Angewandte Lösung…")} rows={3} className={areaCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}><T>Ergebnis</T></label>
          <textarea value={result} onChange={(e) => setResult(e.target.value)}
            placeholder={translateUI("Finales Ergebnis / Bestätigung der Lösung…")} rows={2} className={areaCls} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-blue-50 transition-colors"><T>Abbrechen</T></button>
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors">
            {loading ? translateUI("Wird gespeichert…") : translateUI("Speichern")}
          </button>
        </div>
      </form>
    </div>
  );
}
