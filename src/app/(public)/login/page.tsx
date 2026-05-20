"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";

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

    const { error: authError } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(mapLoginError(authError.message));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
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
          <h1 className="text-xl font-bold text-white mb-1">Mit OrikOS-Konto einloggen</h1>
          <p className="text-sm text-slate-500 mb-7">
            Melden Sie sich mit Ihrem OrikOS-Konto an.
          </p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                E-Mail
              </label>
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
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? "Bitte warten…" : "Einloggen"}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Noch kein Konto?{" "}
            <Link
              href="/registrieren"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Kostenlos registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
