"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle } from "lucide-react";

export default function SupabaseMissingBanner() {
  const { language } = useLanguage();
  const de = language === "de";
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-lg w-full">
        <div className="flex items-start gap-4">
          <AlertTriangle size={22} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">{de ? "Supabase-Konfiguration fehlt" : "Verilənlər bazası bağlantısı konfiqurasiya edilməyib"}</p>
            <p className="text-sm text-amber-900 leading-relaxed">
              {de ? "Bitte" : "Zəhmət olmasa,"}{" "}
              <code className="bg-blue-50 px-1 py-0.5 rounded text-xs font-mono">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              {de ? "und" : "və"}{" "}
              <code className="bg-blue-50 px-1 py-0.5 rounded text-xs font-mono">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              {de ? "in der" : "dəyərlərini"} <code className="bg-blue-50 px-1 py-0.5 rounded text-xs font-mono">.env.local</code>{" "}
              {de ? "Datei setzen." : "faylında təyin edin."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
