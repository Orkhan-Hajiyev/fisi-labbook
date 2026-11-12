"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { useLanguage } from "@/contexts/LanguageContext";

function mapLoginError(message: string): string {
  if (message.includes("Invalid login credentials"))
    return "E-Mail oder Passwort ist falsch.";
  if (message.includes("Email not confirmed"))
    return "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse über den Link in Ihrem Postfach.";
  if (message.includes("Too many requests"))
    return "Zu viele Anmeldeversuche. Bitte warten Sie kurz und versuchen Sie es erneut.";
  return "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.";
}

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const de = language === "de";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (supabaseConfigMissing) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <SupabaseMissingBanner />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase!.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(de ? mapLoginError(authError.message) : "Giriş alınmadı. E-poçt ünvanını, şifrəni və hesab təsdiqini yoxla.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError(de ? "Verbindung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut." : "Bağlantı alınmadı. İnternet bağlantını yoxla və yenidən cəhd et.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[calc(100vh-130px)]">
      <div className="w-full max-w-md">
        {/* Logo link */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 w-fit">
          <div className="w-8 h-8 rounded-lg bg-[#e8f2ff] border border-slate-200 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent select-none">
              FL
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900">FISI LabBook</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-blue-50 p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">{de ? "Mit deinem Konto anmelden" : "Hesabına daxil ol"}</h1>
          <p className="text-sm text-slate-600 mb-7">
            {de ? "Melde dich an, um deinen persönlichen FISI-Workspace zu öffnen." : "Şəxsi FISI Workspace-inə keçmək üçün daxil ol."}
          </p>

          {error && (
            <div role="alert" className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-600 mb-1.5">
                {de ? "E-Mail" : "E-poçt"}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@beispiel.de"
                className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 focus:bg-blue-50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-600 mb-1.5">
                {de ? "Passwort" : "Şifrə"}
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 focus:bg-blue-50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? (de ? "Bitte warten…" : "Gözləyin…") : (de ? "Einloggen" : "Daxil ol")}
            </button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-6">
            {de ? "Noch kein Konto?" : "Hələ hesabın yoxdur?"}{" "}
            <Link
              href="/registrieren"
              className="text-blue-700 hover:text-blue-800 transition-colors"
            >
              {de ? "Kostenlos registrieren" : "Pulsuz qeydiyyat"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
