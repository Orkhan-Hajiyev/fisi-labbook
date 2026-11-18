import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("Personal troubleshooting call-to-action uses locale translation",()=>{
 const src=read("src/app/(app)/fehleranalyse/page.tsx");
 assert.match(src,/<T>Fehleranalyse hinzufügen<\/T>/);
 assert.match(src,/<T>Checkliste verwenden<\/T>/);
 assert.match(src,/buttonLabel=\{translateUI\("Fehleranalyse hinzufügen"\)\}/);
});
test("Docker service actions use locale translation",()=>{
 const src=read("src/app/(app)/docker-dienste/page.tsx");
 assert.match(src,/<T>Dienst hinzufügen<\/T>/);
 assert.match(src,/buttonLabel=\{translateUI\("Dienst hinzufügen"\)\}/);
});
test("AZ UI dictionary has all personal-action translations",()=>{
 const src=read("src/components/TranslatedText.tsx");
 for(const item of ["Fehleranalyse hinzufügen","Dienst hinzufügen","Checkliste verwenden","Sonstiges"])assert.ok(src.includes('"'+item+'":'));
 assert.ok(src.includes('"Priorität": "Vaciblik dərəcəsi"'));
});
test("Personal data and database records are not rewritten or machine-translated",()=>{
 for(const p of ["src/app/(app)/fehleranalyse/page.tsx","src/app/(app)/docker-dienste/page.tsx","src/app/(app)/praxisnotizen/page.tsx"]){
  const src=read(p);assert.match(src,/useLanguage|useT/);
 }
});

test("Authenticated workspace actions and lab counters are localized",()=>{
 const src=read("src/app/(app)/workspace/page.tsx");
 for(const k of ["Als Markdown exportieren","Als PDF drucken","Markdown exportieren","verknüpfte Einträge"])
  assert.ok(src.includes("<T>"+k+"</T>"),k);
 assert.ok(src.includes("generateMarkdown(data, displayName, language)"));
 assert.ok(src.includes("generateLabMarkdown(lab, linked, language)"));
 assert.ok(!src.includes("<T><T>"));
});
test("Personal command and checklist buttons are translated",()=>{
 const cmds=read("src/app/(app)/befehle/page.tsx");
 const cases=read("src/app/(app)/fehleranalyse/page.tsx");
 assert.match(cmds,/<T>Befehl hinzufügen<\/T>/);
 assert.match(cmds,/buttonLabel=\{translateUI\("Befehl hinzufügen"\)\}/);
 assert.match(cases,/<T>In Prüfschritte einfügen<\/T>/);
});
test("Personal system taxonomy labels are localized without modifying stored prose",()=>{
 const note=read("src/components/NoteCard.tsx");
 const docker=read("src/app/(app)/docker-dienste/page.tsx");
 assert.match(note,/<T>\{note.category\}<\/T>/);
 assert.match(docker,/<T>\{svc.service_type\}<\/T>/);
 assert.match(note,/>\{note.content\}<\/p>/);
});
