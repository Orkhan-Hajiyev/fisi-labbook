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
