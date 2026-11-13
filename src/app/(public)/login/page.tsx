"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const router=useRouter();
  const {language}=useLanguage();
  const de=language==="de";
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [visible,setVisible]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [confirmed,setConfirmed]=useState(false);
  useEffect(()=>{setConfirmed(new URLSearchParams(window.location.search).get("confirmed")==="1");},[]);
  if(supabaseConfigMissing) return <div className="max-w-md mx-auto px-6 py-20"><SupabaseMissingBanner/></div>;
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(loading)return;
    setError(null);setLoading(true);
    try {
      const {error:authError}=await supabase!.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
      if(authError) {
        if(authError.message.toLowerCase().includes("email not confirmed")) setError(de?"Bitte bestätige zuerst deine E-Mail-Adresse.":"Əvvəlcə e-poçt ünvanını təsdiqlə.");
        else if(authError.message.toLowerCase().includes("rate limit"))setError(de?"Zu viele Versuche. Bitte später erneut probieren.":"Həddindən artıq cəhd edilib. Bir qədər sonra yenidən yoxla.");
        else setError(de?"E-Mail oder Passwort ist falsch.":"E-poçt ünvanı və ya şifrə yanlışdır.");
        return;
      }
      router.replace("/dashboard");router.refresh();
    } catch {setError(de?"Anmeldung nicht möglich. Prüfe deine Verbindung.":"Bağlantı alınmadı. İnternetini yoxla.");}
    finally {setLoading(false);}
  }
  return <section className="flex-1 min-h-0 flex items-center justify-center bg-gradient-to-b from-[#f1f7ff] to-white px-4 py-2.5 sm:py-4">
    <div className="w-full max-w-[480px]">
      <Link href="/" className="inline-flex mb-2 text-sm font-semibold text-blue-700">← FISI LabBook</Link>
      <div className="rounded-[24px] border border-[#cbdff3] bg-white p-5 sm:p-6 shadow-[0_20px_45px_-26px_rgba(14,70,140,.3)]">
        <p className="text-xs font-extrabold tracking-widest text-blue-700">{de?"DEIN KONTO":"ŞƏXSİ HESABIN"}</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#153b68]">{de?"Willkommen zurück":"Xoş gəlmisən"}</h1>
        <p className="mt-2 text-sm text-[#59738f]">{de?"Öffne deinen persönlichen IT-Workspace.":"Şəxsi IT iş mühitinə daxil ol."}</p>
        {confirmed&&<p role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{de?"E-Mail bestätigt. Melde dich jetzt mit deinem Konto an.":"E-poçt ünvanın təsdiqləndi. İndi hesabına daxil ol."}</p>}
        {error&&<p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold text-[#24466c]">{de?"E-Mail-Adresse":"E-poçt ünvanı"}<input required type="email" autoComplete="username" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#c8d9ea] px-4 py-2.5 outline-none focus:border-blue-500"/></label>
          <label className="block text-sm font-semibold text-[#24466c]">{de?"Passwort":"Şifrə"}<input required type={visible?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#c8d9ea] px-4 py-2.5 outline-none focus:border-blue-500"/></label>
          <div className="flex items-center justify-between gap-3 text-xs"><label className="flex items-center gap-2 text-[#59738f]"><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)}/>{de?"Passwort anzeigen":"Şifrəni göstər"}</label><Link href="/passwort-vergessen" className="font-semibold text-blue-700 hover:underline">{de?"Passwort vergessen?":"Şifrəni unutmusan?"}</Link></div>
          <button disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">{loading?(de?"Anmeldung läuft…":"Giriş yoxlanılır…"):(de?"Anmelden":"Daxil ol")}</button>
        </form>
        <p className="mt-4 text-center text-sm text-[#59738f]">{de?"Noch kein Konto?":"Hesabın yoxdur?"} <Link className="font-bold text-blue-700" href="/registrieren">{de?"Kostenlos registrieren":"Pulsuz qeydiyyat"}</Link></p>
      </div>
    </div>
  </section>;
}
