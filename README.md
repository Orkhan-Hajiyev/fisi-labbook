# FISI LabBook

**Systemintegration Labor- und Troubleshooting-Plattform**

Eine praxisorientierte Plattform zur Dokumentation von IT-Laboren, Systemen, Befehlen, Docker-Diensten und Fehleranalysen im Bereich Fachinformatiker für Systemintegration. Teil des OrikOS-Ökosystems.

---

## Tech Stack

| Technologie | Verwendung |
|---|---|
| Next.js 16 (App Router) | Frontend-Framework |
| TypeScript | Typsicherheit |
| Tailwind CSS v4 | Styling |
| Supabase (PostgreSQL + Auth) | Datenbank und Authentifizierung |
| Vercel | Deployment |
| lucide-react | Icons |

---

## Routenstruktur

Das Projekt nutzt Next.js Route Groups für getrennte Layouts.

### Öffentliche Seiten — `(public)` Group

| Route | Beschreibung |
|---|---|
| `/` | Landing Page – Hero, Module, OrikOS-Branding, CTAs |
| `/login` | Anmeldeseite |
| `/registrieren` | Registrierungsseite |

Öffentliche Seiten haben eine eigene Top-Navigation (`PublicNav`) ohne Sidebar.

### App-Seiten — `(app)` Group

| Route | Beschreibung |
|---|---|
| `/dashboard` | Übersicht – Statistik-Karten und Schnellzugriff |
| `/workspace` | Persönliche Gesamtübersicht mit Lab-Hierarchie und Export |
| `/labore` | Dokumentierte IT-Laborumgebungen + Vorlage-Kopie |
| `/systeme` | Infrastruktur- und Systemdokumentation + Vorlage-Kopie |
| `/befehle` | Admin-Befehlsreferenz + Vorlage-Kopie + Befehls-Assistent |
| `/fehleranalyse` | Troubleshooting-Fälle + Vorlage-Kopie + Checklisten |
| `/docker-dienste` | Container-Dienste und Compose-Snippets + Vorlage-Kopie |
| `/praxisnotizen` | Persönlicher Notiz-/Aufgabenbereich (CRUD, Tags, Filter) |
| `/suche` | Globale Suche über alle persönlichen Workspace-Inhalte |
| `/portfolio` | Projektzusammenfassung und Technologieübersicht |

App-Seiten haben eine gemeinsame Sidebar-Navigation mit TopBar (Desktop) / Drawer (Mobil).

---

## Authentifizierungs-Flow

FISI LabBook verwendet Supabase Auth mit dem Standard-E-Mail-Bestätigungsflow.

1. Benutzer registriert sich unter `/registrieren` (Name, E-Mail, Passwort)
2. Supabase sendet eine E-Mail-Bestätigungsmail (Supabase Standard-SMTP)
3. Benutzer bestätigt die E-Mail über den Link im Postfach
4. Benutzer meldet sich unter `/login` an
5. Nach erfolgreicher Anmeldung: Weiterleitung zu `/dashboard`

> **Hinweis:** Es wird ausschließlich der `anon`-Key verwendet. Kein eigener SMTP-Server konfiguriert. Der Absender der Bestätigungsmail ist Supabase Standard.

---

## Supabase Auth — Redirect-URLs konfigurieren

Damit der E-Mail-Bestätigungslink nach der Registrierung korrekt funktioniert, müssen die Redirect-URLs im Supabase-Dashboard eingetragen sein.

**Supabase Dashboard → Authentication → URL Configuration**

| Einstellung | Wert |
|---|---|
| Site URL | `https://fisi.oriklab.com` (oder Ihre Produktions-URL) |
| Redirect URLs | `http://localhost:3000/**` |
| | `http://localhost:3001/**` |
| | `https://fisi.oriklab.com/**` |
| | `https://*.vercel.app/**` |

> **Hinweis:** Ohne korrekte Redirect-URLs landet der Nutzer nach der E-Mail-Bestätigung auf einer Fehlerseite von Supabase, nicht auf der App.

---

## Voraussetzungen

- Node.js 20 oder neuer
- Ein Supabase-Projekt mit den erforderlichen Tabellen (siehe unten)

---

## Umgebungsvariablen

Erstelle eine `.env.local` Datei im Projektstamm:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Sicherheitshinweis:** Es wird ausschließlich der `anon`-Key verwendet. Der `service_role`-Key wird niemals im Frontend eingesetzt und darf nicht in `.env.local` gesetzt werden.

---

## Supabase-Tabellen

| Tabelle | Beschreibung |
|---|---|
| `public.fisi_labs` | IT-Labore und Laborumgebungen |
| `public.fisi_systems` | Systemdokumentation (Hostnames, IPs, Rollen) |
| `public.fisi_commands` | Admin-Befehlsreferenz |
| `public.fisi_troubleshooting_cases` | Troubleshooting-Fälle |
| `public.fisi_docker_services` | Docker-Dienste und Compose-Snippets |

---

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Anschließend unter [http://localhost:3000](http://localhost:3000) aufrufen.

```bash
# Linting prüfen
npm run lint

# Produktions-Build testen
npm run build
```

---

## Supabase-Verbindung testen

1. `.env.local` mit korrekten Werten anlegen
2. `npm run dev` starten
3. `/dashboard` aufrufen — die Stat-Karten zeigen die Anzahl der Datenbankeinträge
4. Fehlt die Konfiguration, erscheint ein gelber Hinweisbanner

---

## Vercel Deployment

1. Repository mit Vercel verbinden
2. Umgebungsvariablen in den Vercel-Projekteinstellungen setzen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy starten — Vercel erkennt Next.js automatisch

---

## Praxisnotizen — Benutzer-Notizen

Praxisnotizen ist das erste echte nutzergebundene Modul. Jeder eingeloggte Benutzer kann eigene Notizen erstellen, bearbeiten, löschen und durchsuchen.

### SQL-Datei ausführen

Die Tabelle muss **manuell** im Supabase SQL Editor angelegt werden:

1. Supabase Dashboard öffnen → Projekt auswählen → **SQL Editor**
2. Inhalt von `supabase/fisi_user_notes.sql` einfügen und ausführen

Die SQL-Datei erstellt:
- Tabelle `public.fisi_user_notes`
- Auto-Update-Trigger für `updated_at`
- Row Level Security (RLS) aktiviert
- 4 Policies: SELECT / INSERT / UPDATE / DELETE — nur eigene Zeilen (`user_id = auth.uid()`)

### Datenfelder

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | uuid | Primärschlüssel |
| `user_id` | uuid | Referenz auf `auth.users` |
| `title` | text | Pflichtfeld: Titel der Notiz |
| `content` | text | Optionaler Inhalt |
| `category` | text | Kategorie (Allgemein, Labor, Docker…) |
| `priority` | text | niedrig / mittel / hoch |
| `status` | text | offen / in_bearbeitung / erledigt / archiviert |
| `tags` | text[] | Kommagetrennte Tags |
| `related_area` | text | Verknüpfung mit App-Bereich |
| `created_at` | timestamptz | Erstellungszeitpunkt |
| `updated_at` | timestamptz | Zuletzt geändert (auto-update) |

### Öffentliche Besucher vs. eingeloggte Nutzer

| Aktion | Öffentlich | Eingeloggt |
|---|---|---|
| /praxisnotizen öffnen | Konzeptseite + CTA-Buttons | Eigener Workspace |
| Notizen erstellen | Nein | Ja |
| Notizen bearbeiten/löschen | Nein | Ja (nur eigene) |
| Suche und Filter | Nein | Ja |

---

## PWA / Mobile Nutzung

FISI LabBook ist als PWA-fähige Web-App eingerichtet. Es handelt sich um eine **Web-App im PWA-Stil**, keine native App im App Store oder Google Play Store.

### Auf dem Smartphone installieren

**Android / Chrome:**
Menü öffnen → Zum Startbildschirm hinzufügen

**iPhone / Safari:**
Teilen öffnen → Zum Home-Bildschirm

Nach der Installation erscheint die App als eigenständiges Icon auf dem Startbildschirm und öffnet sich ohne Browser-Adressleiste im Standalone-Modus.

### Manifest und Icons

| Datei | Beschreibung |
|---|---|
| `public/manifest.webmanifest` | Web App Manifest (Name, Farben, Icons, Display-Modus) |
| `public/icons/icon-192.png` | App-Icon 192×192 px (Android, PWA) |
| `public/icons/icon-512.png` | App-Icon 512×512 px (Splash Screen, maskable) |
| `public/icons/fisi-labbook-icon.svg` | SVG-Quellicon (dark navy, FL, cyan/blue Akzent) |

### Theme

| Einstellung | Wert |
|---|---|
| `theme_color` | `#0ea5e9` (Cyan-500) |
| `background_color` | `#020617` (Slate-950) |
| `display` | `standalone` |
| `orientation` | `portrait-primary` |

---

## Features im Überblick

| Modul / Feature | Status |
|---|---|
| Praxisnotizen (CRUD) | ✓ Implementiert |
| Workspace-Übersichtsseite | ✓ Implementiert |
| „Als Vorlage übernehmen" | ✓ Implementiert |
| Markdown / PDF-Export | ✓ Implementiert |
| Globale Suche (`/suche`) | ✓ Implementiert |
| Troubleshooting-Checklisten | ✓ Implementiert |
| Befehls-Vorschlag-Assistent | ✓ Implementiert |
| TopBar mit Account-Bereich | ✓ Implementiert |
| KI-Zusammenfassungen | Geplant |
| Topologie-Diagramme | Geplant |
| Service Worker (Offline) | Geplant |

## Features testen

### Account-Bereich (Task 0)
- Desktop: Oben rechts sichtbar — „Angemeldet als [Name/E-Mail]" + Abmelden-Button
- Mobil: Im Hamburger-Menü/Drawer am unteren Ende

### Workspace (`/workspace`) — Task 1
- Einloggen → „Workspace" in der Navigation klicken
- Statistik-Karten für alle Module + hierarchische Lab-Ansicht
- Leer-Zustand mit Schnellstart-Buttons wenn kein Inhalt vorhanden

### Als Vorlage übernehmen — Task 2
- Auf eine Seite mit Demo-Inhalten gehen (z. B. `/labore`)
- Eingeloggt: „Als Vorlage übernehmen"-Button sichtbar an jedem Demo-Eintrag
- Nicht eingeloggt: Button deaktiviert mit „Anmeldung erforderlich"

### Export — Task 3
- Auf `/workspace` gehen (eingeloggt, Inhalte vorhanden)
- „Als Markdown exportieren" → Download als `.md`-Datei
- „Als PDF drucken" → Browser-Druckdialog

### Globale Suche (`/suche`) — Task 4
- Einloggen → „Suche" in der Navigation
- Suchbegriff eingeben + Enter drücken
- Ergebnisse erscheinen gruppiert nach Modultyp

### Troubleshooting-Checkliste — Task 5
- `/fehleranalyse` öffnen
- „Checkliste verwenden"-Button klicken
- Problemtyp wählen (z. B. „DNS-Problem")
- „In Prüfschritte einfügen" → befüllt das Formularfeld

### Befehls-Assistent — Task 6
- `/befehle` öffnen
- „Befehl vorschlagen"-Button klicken
- Plattform und Kategorie wählen
- Auf einen Vorschlag klicken → befüllt das Erstellungsformular

---

## Rechtliches / Footer

| | |
|---|---|
| OrikLab | https://www.oriklab.com/de |
| Impressum | https://www.oriklab.com/de/impressum |
| Datenschutz | https://www.oriklab.com/de/datenschutz |
| Kontakt | info@oriklab.com |
| Support | support@oriklab.com |

---

## Sicherheit

- Nur der `anon`-Key wird im Frontend verwendet (durch Supabase Row Level Security abgesichert)
- Kein `service_role`-Key im Frontend
- Keine unsicheren Schreib-/Lösch-Operationen in der öffentlichen UI
- Supabase Auth: nur Standard-E-Mail-Bestätigung, kein eigener SMTP
