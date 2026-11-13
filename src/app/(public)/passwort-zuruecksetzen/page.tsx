"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";

export default function ResetPasswordPage(){
 const {language}=useLanguage();const de=language==="de";
 const [ready,setReady]=useState(false);const [valid,setValid]=useState(false);const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [visible,setVisible]=useState(false);const [error,setError]=useState<string|null>(null);const [loading,setLoading]=useState(false);const [success,setSuccess]=useState(false);
 useEffect(()=>{
  if(!supabase)return;
  let mounted=true;
  // Supabase JS processes the recovery URL on initialization and creates a short-lived session.
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
   if(!mounted)return;
   if(event==="PASSWORD_RECOVERY"){setValid(!!session);setReady(true);}
  });
  supabase.auth.getSession().then(({data})=>{if(mounted){setValid(Boolean(data.session));setReady(true);}}).catch(()=>{if(mounted)setReady(true);});
  return ()=>{mounted=false;subscription.unsubscribe();};
 },[]);
 if(supabaseConfigMissing)return <div className="max-w-md mx-auto px-6 py-20"><SupabaseMissingBanner/></div>;
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(loading)return;setError(null);
  if(password.length<8){setError(de?"Mindestens 8 Zeichen erforderlich.":"Ən azı 8 simvol tələb olunur.");return;}
  if(password!==confirm){setError(de?"Passwörter stimmen nicht überein.":"Şifrələr uyğun gəlmir.");return;}
  setLoading(true);
  try {const {error:authError}=await supabase!.auth.updateUser({password});if(authError){setError(de?"Der Link ist abgelaufen oder die Änderung konnte nicht gespeichert werden.":"Keçidin vaxtı bitib və ya dəyişiklik saxlanmadı.");return;}setSuccess(true);}
  catch {setError(de?"Verbindung fehlgeschlagen.":"Bağlantı alınmadı.");}
  finally{setLoading(false);}
 }
 return <main className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-gradient-to-b from-[#f1f7ff] to-white px-4 py-14"><div className="w-full max-w-md rounded-[24px] border border-[#cbdff3] bg-white p-7 sm:p-9">
 <h1 className="text-2xl font-extrabold text-[#153b68]">{de?"Neues Passwort festlegen":"Yeni şifrə təyin et"}</h1>
 {success?<><p className="mt-4 text-sm text-[#56718d]">{de?"Dein Passwort wurde geändert.":"Şifrən yeniləndi."}</p><Link className="mt-5 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white" href="/login">{de?"Anmelden":"Daxil ol"}</Link></>:
 !ready?<p className="mt-4 text-sm">{de?"Der Link wird geprüft…":"Keçid yoxlanılır…"}</p>:
 !valid?<><p className="mt-4 text-sm leading-7 text-[#56718d]">{de?"Dieser Link ist ungültig oder abgelaufen. Fordere einen neuen an.":"Keçid etibarsızdır və ya vaxtı bitib. Yeni keçid tələb et."}</p><Link href="/passwort-vergessen" className="mt-4 inline-block text-sm font-bold text-blue-700">{de?"Neuen Link anfordern":"Yeni keçid tələb et"}</Link></>:
 <form onSubmit={submit} className="mt-6 space-y-4">
 <label className="block text-sm font-semibold text-[#24466c]">{de?"Neues Passwort":"Yeni şifrə"}<input required minLength={8} maxLength={128} autoComplete="new-password" type={visible?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-[#c8d9ea] px-4 py-3"/></label>
 <label className="block text-sm font-semibold text-[#24466c]">{de?"Passwort wiederholen":"Şifrəni təsdiqlə"}<input required minLength={8} maxLength={128} autoComplete="new-password" type={visible?"text":"password"} value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-2 w-full rounded-xl border border-[#c8d9ea] px-4 py-3"/></label>
 <label className="flex gap-2 items-center text-xs text-[#59738f]"><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)}/>{de?"Passwörter anzeigen":"Şifrələri göstər"}</label>
 {error&&<p role="alert" className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">{error}</p>}
 <button disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60">{loading?(de?"Speichern…":"Saxlanılır…"):(de?"Passwort ändern":"Şifrəni dəyiş")}</button>
 </form>}
 </div></main>;
}
