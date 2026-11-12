import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");

test("public demo dictionary has complete nonduplicated translations", () => {
  const code = read("src/lib/demo-i18n.ts");
  const items = [...code.matchAll(/^\s*("(?:[^"\\]|\\.)*"):\s*("(?:[^"\\]|\\.)*"),?\s*$/gm)];
  const keys = items.map((item) => JSON.parse(item[1]));
  assert.equal(keys.length, new Set(keys).size, "Each German demo phrase must have only one Azerbaijani value");
  assert.ok(keys.length >= 220, "Curated public data needs comprehensive translations");
  for (const phrase of [
    "DNS Troubleshooting Labor",
    "Prüft den Zustand eines Domänencontrollers.",
    "Die Namensauflösung funktioniert wieder und interne Systeme sind über Hostnamen erreichbar.",
    "Webserver und Reverse Proxy für lokale Dienste oder Testumgebungen.",
  ]) {
    assert.ok(keys.includes(phrase), `Missing translation: ${phrase}`);
  }
  assert.match(code, /if \(value == null \|\| language === "de"\) return value \?\? ""/);
});

test("demo cards render translated fields without rewriting their source records", () => {
  const targets = [
    ["labore", ["demoText(lab.title, language)", "demoText(lab.description, language)"]],
    ["systeme", ["demoText(sys.role, language)", "demoText(sys.notes, language)"]],
    ["befehle", ["demoText(cmd.purpose, language)", "demoText(cmd.typical_use_case, language)"]],
    ["fehleranalyse", ["demoText(c.title, language)", "demoText(c.checks, language)"]],
    ["docker-dienste", ["demoText(svc.purpose, language)", "demoText(svc.notes, language)"]],
  ];
  for (const [page, snippets] of targets) {
    const source = read(`src/app/(app)/${page}/page.tsx`);
    for (const snippet of snippets) assert.ok(source.includes(snippet), `${page}: expected ${snippet}`);
  }
});

test("guest experience has a single auth area and Azerbaijani sample-workspace label", () => {
  const landing = read("src/app/(public)/page.tsx");
  const banner = read("src/components/DemoBanner.tsx");
  const navigation = read("src/components/Navigation.tsx");
  assert.ok(!landing.includes('id="modules-title"'), "Redundant module overview must stay removed");
  assert.ok(!banner.includes('href="/login"'), "Login should not be duplicated in banner");
  assert.ok(!banner.includes('href="/registrieren"'), "Registration should not be duplicated in banner");
  assert.ok(navigation.includes('Nümunə iş mühiti'));
  assert.ok(banner.includes('Nümunə iş mühiti'));
});


test("guest search and workspace screens have localized entry requirements", () => {
  const search = read("src/app/(app)/suche/page.tsx");
  const workspace = read("src/app/(app)/workspace/page.tsx");
  const dictionary = read("src/components/TranslatedText.tsx");
  const dashboard = read("src/app/(app)/dashboard/page.tsx");
  assert.ok(search.includes("<T>Die globale Suche ist für angemeldete Benutzer verfügbar.</T>"));
  assert.ok(workspace.includes("<T>Der persönliche Workspace ist nur für angemeldete Benutzer verfügbar.</T>"));
  assert.ok(search.includes("<T>Kostenlos registrieren</T>"));
  assert.ok(workspace.includes("<T>Kostenlos registrieren</T>"));
  assert.ok(workspace.includes('description={translateUI("Persönliche Gesamtübersicht aller Inhalte und Verknüpfungen")}'));
  assert.ok(dashboard.includes("<T>Schnellzugriff</T>"));
  for (const term of ["Schnellzugriff", "Suchen", "Kostenlos registrieren", "Die globale Suche ist für angemeldete Benutzer verfügbar.", "Der persönliche Workspace ist nur für angemeldete Benutzer verfügbar."]) {
    assert.ok(dictionary.includes(JSON.stringify(term) + ":"), "Missing AZ UI translation: " + term);
  }
});
