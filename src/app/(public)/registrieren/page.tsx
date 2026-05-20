"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { CheckCircle2 } from "lucide-react";

function mapSignUpError(message: string): string {
  if (message.includes("User already registered"))
    return "Diese E-Mail-Adresse ist bereits registriert.";
  if (message.includes("Password should be at least"))
    return "Das Passwort muss mindestens 6 Zeichen lang sein.";
  if (message.includes("Unable to validate email address") || message.includes("invalid format"))
    return "Ungültige E-Mail-Adresse.";
  if (message.includes("Signup is disabled"))
    return "Die Registrierung ist zurzeit deaktiviert.";
  if (message.includes("email rate limit"))
    return "Zu viele Anfragen. Bitte warten Sie kurz und versuchen Sie es erneut.";
  return "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.";
}

export default function RegistrierenPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

    if (!name.trim()) {
      setError("Bitte geben Sie Ihren Namen ein.");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    });

    if (authError) {
      setError(mapSignUpError(authError.message));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[calc(100vh-130px)]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-3">Registrierung erfolgreich</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-2">
              Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre E-Mail-Adresse über den
              Link. Danach können Sie sich einloggen.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Falls die E-Mail nicht ankommt, prüfen Sie bitte auch Ihren Spam-Ordner.
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
            >
              Zum Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[calc(100vh-130px)]">
      <div className="w-full max-w-md">
        {/* Logo link */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 w-fit">
          <div className="w-8 h-8 rounded-lg bg-[#161b27] border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent select-none">
              FL
            </span>
          </div>
          <span className="text-sm font-bold text-white">FISI LabBook</span>
        </Link>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <h1 className="text-xl font-bold text-white mb-1">Kostenloses OrikOS-Konto erstellen</h1>
          <p className="text-sm text-slate-500 mb-7">
            OrikOS-Konto erstellen und FISI-Dokumentation starten.
          </p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Max Mustermann"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@beispiel.de"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 Zeichen"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                placeholder="Passwort wiederholen"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? "Bitte warten…" : "Kostenlos registrieren"}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Bereits registriert?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Einloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
