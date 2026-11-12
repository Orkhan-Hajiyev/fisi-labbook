"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
  const de = language === "de";
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
      setError(de ? "Bitte gib deinen Namen ein." : "Adını daxil et.");
      return;
    }
    if (password.length < 6) {
      setError(de ? "Das Passwort muss mindestens 6 Zeichen lang sein." : "Şifrə ən azı 6 simvoldan ibarət olmalıdır.");
      return;
    }
    if (password !== passwordConfirm) {
      setError(de ? "Die Passwörter stimmen nicht überein." : "Şifrələr uyğun gəlmir.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase!.auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() } },
      });
      if (authError) {
        setError(de ? mapSignUpError(authError.message) : "Qeydiyyat alınmadı. Məlumatları yoxlayıb yenidən cəhd et.");
        return;
      }
      setSuccess(true);
    } catch {
      setError(de ? "Verbindung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut." : "Bağlantı alınmadı. İnternet bağlantını yoxlayıb yenidən cəhd et.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[calc(100vh-130px)]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={22} className="text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-3">{de ? "Registrierung erfolgreich" : "Qeydiyyat uğurlu oldu"}</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              {de ? "Bitte prüfe dein E-Mail-Postfach und bestätige deine E-Mail-Adresse über den Bestätigungslink. Danach kannst du dich anmelden." : "E-poçtunu yoxla və göndərilən keçidlə ünvanını təsdiqlə. Bundan sonra hesabına daxil ola bilərsən."}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {de ? "Falls die E-Mail nicht ankommt, prüfe bitte auch deinen Spam-Ordner." : "Məktub gəlməsə, spam qovluğunu da yoxla."}
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
            >
              {de ? "Zum Login" : "Girişə keç"}
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
          <div className="w-8 h-8 rounded-lg bg-[#e8f2ff] border border-slate-200 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent select-none">
              FL
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900">FISI LabBook</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-blue-50 p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">{de ? "Kostenloses FISI-LabBook-Konto erstellen" : "Pulsuz FISI LabBook hesabı yarat"}</h1>
          <p className="text-sm text-slate-600 mb-7">
            {de ? "Registriere dich kostenlos und nutze deinen persönlichen IT-Workspace. Für die derzeit angebotenen Funktionen ist kein kostenpflichtiges Abo erforderlich." : "Pulsuz qeydiyyatdan keç və şəxsi IT iş sahəndən istifadə et. Hazırda təqdim olunan funksiyalar üçün ödənişli abunə tələb olunmur."}
          </p>

          {error && (
            <div role="alert" className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-xs font-medium text-slate-600 mb-1.5">{de ? "Name" : "Ad"}</label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={de ? "Max Mustermann" : "Ad Soyad"}
                className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 focus:bg-blue-50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="register-email" className="block text-xs font-medium text-slate-600 mb-1.5">{de ? "E-Mail" : "E-poçt"}</label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="block text-xs font-medium text-slate-600 mb-1.5">{de ? "Passwort" : "Şifrə"}</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={de ? "Mind. 6 Zeichen" : "Ən azı 6 simvol"}
                className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 focus:bg-blue-50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="register-password-confirm" className="block text-xs font-medium text-slate-600 mb-1.5">
                {de ? "Passwort bestätigen" : "Şifrəni təsdiqlə"}
              </label>
              <input
                id="register-password-confirm"
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                placeholder={de ? "Passwort wiederholen" : "Şifrəni təkrar yaz"}
                className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 focus:bg-blue-50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? (de ? "Bitte warten…" : "Gözləyin…") : (de ? "Kostenlos registrieren" : "Pulsuz qeydiyyatdan keç")}
            </button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-6">
            {de ? "Bereits registriert?" : "Artıq hesabın var?"}{" "}
            <Link href="/login" className="text-blue-700 hover:text-blue-800 transition-colors">
              {de ? "Einloggen" : "Daxil ol"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
