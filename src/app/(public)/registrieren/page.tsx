"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { useLanguage } from "@/contexts/LanguageContext";

function translateSignUpError(error: { message: string; code?: string }, de: boolean) {
  const message = error.message.toLowerCase();
  if (message.includes("already registered") || error.code === "user_already_exists")
    return de ? "Für diese E-Mail-Adresse besteht bereits ein Konto. Bitte melde dich an oder setze dein Passwort zurück." : "Bu e-poçt ünvanı üçün hesab artıq mövcuddur. Daxil ol və ya şifrəni yenilə.";
  if (message.includes("signup is disabled"))
    return de ? "Neue Registrierungen sind derzeit vom Administrator deaktiviert." : "Yeni qeydiyyatlar hazırda administrator tərəfindən deaktiv edilib.";
  if (message.includes("rate limit") || message.includes("too many"))
    return de ? "Zu viele Anfragen. Bitte versuche es später erneut." : "Həddindən artıq sorğu göndərilib. Bir qədər sonra yenidən cəhd et.";
  if (message.includes("email") && (message.includes("sending") || message.includes("smtp")))
    return de ? "Die Bestätigungs-E-Mail konnte nicht versendet werden. Der E-Mail-Dienst muss geprüft werden." : "Təsdiq e-poçtu göndərilə bilmədi. Poçt xidməti yoxlanmalıdır.";
  if (message.includes("invalid") || message.includes("password"))
    return de ? "Bitte überprüfe die E-Mail-Adresse und die Passwortanforderungen." : "E-poçt ünvanını və şifrə tələblərini yoxla.";
  return de ? "Registrierung fehlgeschlagen. Bitte versuche es erneut." : "Qeydiyyat alınmadı. Yenidən cəhd et.";
}

export default function RegistrationPage() {
  const { language } = useLanguage();
  const de = language === "de";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<"confirmation" | "signedin" | null>(null);
  const [loading, setLoading] = useState(false);

  if (supabaseConfigMissing) return <div className="max-w-md mx-auto px-6 py-20"><SupabaseMissingBanner /></div>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    if (name.trim().length < 2) { setError(de ? "Bitte gib einen gültigen Namen ein." : "Düzgün ad daxil et."); return; }
    if (password.length < 8) { setError(de ? "Das Passwort muss mindestens 8 Zeichen enthalten." : "Şifrə ən azı 8 simvol olmalıdır."); return; }
    if (password !== passwordConfirm) { setError(de ? "Die Passwörter stimmen nicht überein." : "Şifrələr uyğun gəlmir."); return; }
    if (!privacy) { setError(de ? "Bitte bestätige, dass du die Datenschutzhinweise gelesen hast." : "Məxfilik məlumatları ilə tanış olduğunu təsdiqlə."); return; }
    setLoading(true);
    try {
      const {data, error: authError} = await supabase!.auth.signUp({
        email: email.trim().toLowerCase(), password,
        options: {
          data: {name: name.trim()},
          emailRedirectTo: `${window.location.origin}/login?confirmed=1`,
        },
      });
      if (authError) { setError(translateSignUpError(authError, de)); return; }
      setSuccess(data.session ? "signedin" : "confirmation");
    } catch {
      setError(de ? "Die Verbindung ist fehlgeschlagen. Versuche es erneut." : "Bağlantı alınmadı. Yenidən cəhd et.");
    } finally { setLoading(false); }
  }

  return <section className="flex-1 min-h-0 flex items-center justify-center bg-gradient-to-b from-[#f1f7ff] to-white px-4 py-2.5 sm:py-4">
    <div className="w-full max-w-[510px]">
      <Link href="/" className="inline-flex items-center gap-2 mb-2 text-sm font-semibold text-blue-700 hover:underline">← FISI LabBook</Link>
      <div className="rounded-[24px] border border-[#cbdff3] bg-white p-5 sm:p-6 shadow-[0_20px_45px_-26px_rgba(14,70,140,.3)]">
        {success ? <>
          <div className="text-4xl text-blue-700 mb-3" aria-hidden="true">✓</div>
          <h1 className="text-2xl font-extrabold text-[#153b68]">{de ? (success === "signedin" ? "Registrierung abgeschlossen" : "Bestätige deine E-Mail-Adresse") : (success === "signedin" ? "Qeydiyyat tamamlandı" : "E-poçt ünvanını təsdiqlə")}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{success === "signedin" ? (de ? "Dein Konto ist aktiv. Du kannst deinen persönlichen Bereich öffnen." : "Hesabın aktivdir. Şəxsi iş mühitinə keçə bilərsən.") : (de ? "Die Registrierung wurde angenommen. Bitte öffne den Bestätigungslink in deiner E-Mail (auch im Spam-Ordner). Danach kommst du zur FISI-LabBook-Anmeldung." : "Qeydiyyat sorğusu qəbul edildi. E-poçtundakı təsdiq keçidini aç (spam qovluğunu da yoxla). Sonra FISI LabBook-un giriş səhifəsinə qayıdacaqsan.")}</p>
          <Link href={success === "signedin" ? "/dashboard" : "/login"} className="mt-4 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white">{success === "signedin" ? (de ? "Zum Workspace" : "İş mühitinə keç") : (de ? "Zur Anmeldung" : "Daxil ol")}</Link>
        </> : <>
          <p className="text-xs font-extrabold tracking-widest text-blue-700">{de ? "KOSTENLOS STARTEN" : "PULSUZ BAŞLA"}</p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#153b68]">{de ? "Dein FISI-LabBook-Konto" : "FISI LabBook hesabını yarat"}</h1>
          <p className="mt-2 text-sm leading-6 text-[#59738f]">{de ? "Dokumentiere eigene Labore, Systeme und IT-Erfahrungen. Kein kostenpflichtiges Abo für die aktuellen Funktionen." : "Laboratoriyalarını, sistemlərini və IT təcrübələrini sənədləşdir. Hazırkı funksiyalar üçün ödənişli abunə yoxdur."}</p>
          {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">{error}</p>}
          <form onSubmit={submit} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-[#24466c]">{de ? "Name" : "Ad və soyad"}<input required autoComplete="name" maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder={de ? "Max Mustermann" : "Ad Soyad"} className="mt-1.5 w-full rounded-xl border border-[#c8d9ea] px-4 py-2.5 outline-none focus:border-blue-500"/></label>
            <label className="block text-sm font-semibold text-[#24466c]">{de ? "E-Mail-Adresse" : "E-poçt ünvanı"}<input required type="email" autoComplete="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="ad@example.com" className="mt-1.5 w-full rounded-xl border border-[#c8d9ea] px-4 py-2.5 outline-none focus:border-blue-500"/></label>
            <label className="block text-sm font-semibold text-[#24466c]">{de ? "Passwort" : "Şifrə"}<input required minLength={8} maxLength={128} type={showPasswords?"text":"password"} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#c8d9ea] px-4 py-2.5 outline-none focus:border-blue-500"/></label>
            <label className="block text-sm font-semibold text-[#24466c]">{de ? "Passwort bestätigen" : "Şifrəni təsdiqlə"}<input required minLength={8} maxLength={128} type={showPasswords?"text":"password"} autoComplete="new-password" value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#c8d9ea] px-4 py-2.5 outline-none focus:border-blue-500"/></label>
            <label className="flex gap-2 items-center text-xs text-[#526d87]"><input type="checkbox" checked={showPasswords} onChange={e=>setShowPasswords(e.target.checked)}/>{de ? "Passwörter anzeigen" : "Şifrələri göstər"}</label>
            <label className="flex items-start gap-2 text-sm text-[#526d87]"><input required type="checkbox" className="mt-1" checked={privacy} onChange={e=>setPrivacy(e.target.checked)}/><span>{de ? "Ich habe die " : ""}<Link href="/datenschutz" target="_blank" className="font-semibold text-blue-700 underline">{de ? "Datenschutzhinweise" : "Məxfilik məlumatları"}</Link>{de ? " gelesen." : " ilə tanış oldum."}</span></label>
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">{loading ? (de?"Registrierung läuft…":"Qeydiyyat aparılır…") : (de?"Kostenlos registrieren":"Pulsuz qeydiyyatdan keç")}</button>
          </form>
          <p className="mt-4 text-center text-sm text-[#5d7894]">{de ? "Bereits registriert?" : "Artıq hesabın var?"} <Link className="font-bold text-blue-700" href="/login">{de ? "Anmelden" : "Daxil ol"}</Link></p>
        </>}
      </div>
    </div>
  </section>;
}
