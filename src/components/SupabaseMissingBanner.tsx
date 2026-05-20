import { AlertTriangle } from "lucide-react";

export default function SupabaseMissingBanner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-lg w-full">
        <div className="flex items-start gap-4">
          <AlertTriangle size={22} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">Supabase-Konfiguration fehlt</p>
            <p className="text-sm text-amber-200/70 leading-relaxed">
              Bitte{" "}
              <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              und{" "}
              <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              in der <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">.env.local</code>{" "}
              Datei setzen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
