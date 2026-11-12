"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabaseConfigMissing } from "@/lib/supabase";

export default function DemoBanner() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  if (supabaseConfigMissing || loading || user) return null;

  return (
    <div className="border-b border-blue-500/15 bg-blue-600/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
      <p className="text-sm text-slate-600 leading-snug">
        <span className="font-bold text-blue-700">{language === "de" ? "Eingeschränkte Demo" : "Məhdud demo"}</span>
        {" "}{language === "de" ? "— Öffentliche Beispiele ansehen; eigene Daten erst nach kostenloser Registrierung speichern." : "— Açıq nümunələrə bax; şəxsi məlumatlarını yalnız pulsuz qeydiyyatdan sonra saxlaya bilərsən."}
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/beispiele" className="text-sm font-semibold text-blue-700 hover:underline">{language === "de" ? "Beispiel-Workspace" : "Nümunə iş mühiti"}</Link>
      </div>
    </div>
  );
}
