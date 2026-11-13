"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";

export default function ForgotPasswordPage(){
 const {language}=useLanguage();const de=language==="de";
 const [email,setEmail]=useState("");const [loading,setLoading]=useState(false);const [sent,setSent]=useState(false);const [error,setError]=useState<string|null>(null);
 if(supabaseConfigMissing)return <div className="max-w-md mx-auto px-6 py-20"><SupabaseMissingBanner/></div>;
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(loading)return;setError(null);setLoading(true);
  try{
   const {error:authError}=await supabase!.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:`${window.location.origin}/passwort-zuruecksetzen`});
   if(authError){setError(authError.message.toLowerCase().includes("rate limit") ? (de?"Zu viele Versuche. Bitte später erneut versuchen.":"Həddindən artıq cəhd edilib. Bir qədər sonra yoxla."):(de?"Die Anfrage konnte nicht verarbeitet werden. Bitte später erneut versuchen.":"Sorğu göndərilmədi. Bir qədər sonra yenidən yoxla."));return;}
   setSent(true);
  }catch{setError(de?"Verbindung fehlgeschlagen.":"Bağlantı alınmadı.");}
  finally{setLoading(false);}
 }
 return <main className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-gradient-to-b from-[#f1f7ff] to-white px-4 py-14"><div className="w-full max-w-md rounded-[24px] border border-[#cbdff3] bg-white p-7 sm:p-9">
  <Link href="/login" className="text-sm font-semibold text-blue-700">← {de?"Zur Anmeldung":"Girişə qayıt"}</Link>
  <h1 className="mt-6 text-2xl font-extrabold text-[#153b68]">{de?"Passwort zurücksetzen":"Şifrəni bərpa et"}</h1>
  <p className="mt-3 text-sm leading-7 text-[#56718d]">{sent ? (de?"Falls ein Konto existiert und der Mailversand funktioniert, erhältst du einen Link. Prüfe auch den Spam-Ordner.":"Bu ünvana bağlı hesab varsa və poçt xidməti işləyirsə, bərpa keçidi göndəriləcək. Spam qovluğunu da yoxla."):(de?"Gib deine E-Mail-Adresse ein. Wir senden dir einen Link, mit dem du ein neues Passwort festlegen kannst.":"E-poçt ünvanını yaz. Yeni şifrə təyin etmək üçün bərpa keçidi göndəriləcək.")}</p>
  {!sent&&<form onSubmit={submit} className="mt-6 space-y-4">
   <label className="block text-sm font-semibold text-[#24466c]">{de?"E-Mail-Adresse":"E-poçt ünvanı"}<input type="email" required autoComplete="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[#c8d9ea] px-4 py-3"/></label>
   {error&&<p role="alert" className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">{error}</p>}
   <button disabled={loading} type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">{loading?(de?"Wird gesendet…":"Göndərilir…"):(de?"Link anfordern":"Bərpa keçidi göndər")}</button>
  </form>}
 </div></main>;
}
