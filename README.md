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
| `/labore` | Dokumentierte IT-Laborumgebungen |
| `/systeme` | Infrastruktur- und Systemdokumentation |
| `/befehle` | Admin-Befehlsreferenz mit Suche |
| `/fehleranalyse` | Strukturierte Troubleshooting-Fälle |
| `/docker-dienste` | Container-Dienste und Compose-Snippets |
| `/praxisnotizen` | Persönlicher Notiz-/Aufgabenbereich (Placeholder) |
| `/portfolio` | Projektzusammenfassung und Technologieübersicht |

App-Seiten haben eine gemeinsame Sidebar-Navigation.

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

## Geplante Module und Features

| Modul / Feature | Status |
|---|---|
| Praxisnotizen (CRUD) | Implementiert |
| Session-Guard für App-Seiten | Geplant |
| Export (PDF, Markdown) | Geplant |
| KI-Zusammenfassungen | Geplant |
| Topologie-Diagramme | Geplant |

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
