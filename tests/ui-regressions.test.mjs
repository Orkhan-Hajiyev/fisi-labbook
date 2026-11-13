import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (file) => readFileSync(new URL("../" + file, import.meta.url), "utf8");

test("AZ interface translates dropdown captions and retains backend enum values", () => {
  const dictionary = read("src/components/TranslatedText.tsx");
  for (const label of ["Netzwerk","Einfach","Fortgeschritten","Sonstiges","Datenbank","Dateisystem","Neues Labor erstellen"]) {
    assert.ok(dictionary.includes(JSON.stringify(label) + ":"), label);
  }
  for (const form of ["NoteForm","CommandForm","TroubleshootingForm","DockerServiceForm"]) {
    const source = read("src/components/" + form + ".tsx");
    assert.ok(source.includes("translateUI("), form);
    assert.ok(source.includes('value={'), form + " should retain backend values");
  }
});

test("guest can return to the FISI home from demo", () => {
  assert.ok(read("src/components/DemoBanner.tsx").includes('href="/"'));
  assert.ok(read("src/components/Navigation.tsx").includes('href="/"'));
});

test("auth pages use compact flex layout and Azerbaijani welcome", () => {
  const layout = read("src/app/(public)/layout.tsx");
  const footer = read("src/components/Footer.tsx");
  assert.ok(layout.includes("min-h-dvh"));
  assert.ok(footer.includes("compactAuthFooter"));
  const login = read("src/app/(public)/login/page.tsx");
  assert.ok(login.includes('"Xoş gəlmisən"'));
  assert.ok(!login.includes('"Yenidən xoş gəlmisən"'));
  for (const page of ["registrieren","login","passwort-vergessen","passwort-zuruecksetzen"]) {
    assert.ok(read("src/app/(public)/"+page+"/page.tsx").includes("flex-1 min-h-0"));
  }
});

test("troubleshooting has full 11-topic Azerbaijani checklist", () => {
  const source = read("src/app/(app)/fehleranalyse/page.tsx");
  assert.ok(source.includes("CHECKLISTS_AZ"));
  assert.ok(source.includes('language === "az" ? CHECKLISTS_AZ[selected]'));
  assert.ok(source.includes("IP konfiqurasiyasını ipconfig /all ilə yoxla"));
});

test("unconfirmed account can request another confirmation email", () => {
  const login = read("src/app/(public)/login/page.tsx");
  const signup = read("src/app/(public)/registrieren/page.tsx");
  for (const source of [login, signup]) {
    assert.ok(source.includes('auth.resend({'), "resend endpoint");
    assert.ok(source.includes('emailRedirectTo:'), "resend must retain FISI redirect");
    assert.ok(source.includes('type:"signup"') || source.includes('type: "signup"'));
    assert.ok(source.includes("Təsdiq məktubunu yenidən göndər"));
  }
  assert.ok(login.includes("email_not_confirmed"));
});
