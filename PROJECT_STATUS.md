# FISI LabBook — Projektstatus

**Stand:** Mai 2026  
**Repo:** `fisi-labbook`  
**Ecosystem:** OrikOS / OrikLab

---

## 1. Projektübersicht

FISI LabBook ist eine eigenständige Web-App innerhalb des OrikOS/OrikLab-Ökosystems.  
Sie richtet sich an Auszubildende und Praktikanten im Bereich **Fachinformatiker für Systemintegration (FiSi)**.

- **Produktions-URL:** https://fisi.oriklab.com
- **Sprache der Benutzeroberfläche:** Deutsch
- **Authentifizierung:** OrikOS-Konto via Supabase Auth (E-Mail + Passwort, Bestätigungslink)
- **Datenbank:** Supabase (PostgreSQL) mit Row Level Security
- **Deployment:** Vercel

Die App funktioniert in zwei Modi:
- **Öffentliche Demo-Ansicht** — Besucher ohne Konto können Referenzinhalte (Labs, Systeme, Befehle usw.) ansehen, aber nicht bearbeiten.
- **Persönlicher Arbeitsbereich** — Eingeloggte OrikOS-Konto-Nutzer können eigene Inhalte über volle CRUD-Operationen verwalten.

---

## 2. Tech Stack

| Technologie | Version / Verwendung |
|---|---|
| Next.js (App Router) | 16.2.x |
| TypeScript | Typsicherheit im gesamten Projekt |
| Tailwind CSS | v4, utility-first, dunkles Design |
| Supabase JS | v2, `anon`-Key, Auth + Datenbank |
| Vercel | Deployment, CI/CD |
| lucide-react | Icon-Library |
| PWA | Web App Manifest, PNG-Icons (192px / 512px) |

Kein eigener Backend-Server. Alle Datenbankzugriffe erfolgen clientseitig über den `anon`-Key mit RLS.

---

## 3. Produktionsstatus

| Bereich | Status |
|---|---|
| GitHub Repo gepusht | ✓ |
| Vercel Production Deploy | ✓ |
| Domain https://fisi.oriklab.com | ✓ aktiv |
| Supabase Auth (Register / Login) | ✓ |
| Öffentliche Demo-Daten | ✓ |
| Persönliche CRUD-Arbeitsbereiche | ✓ |
| Mobile Layout (responsiv) | ✓ |
| PWA Manifest + Icons | ✓ |
| Account-Bereich oben rechts (Desktop) | ✓ neu |
| Workspace-Übersichtsseite `/workspace` | ✓ neu |
| „Als Vorlage übernehmen" für Demo-Inhalte | ✓ neu |
| Markdown / PDF-Export | ✓ neu |
| Globale Suche `/suche` | ✓ neu |
| Troubleshooting-Checklisten | ✓ neu |
| Befehls-Vorschlag-Assistent | ✓ neu |
| npm run lint | ✓ keine Fehler |
| npm run build | ✓ 16 Routen, alle statisch |

---

## 4. Supabase Setup

### Öffentliche Demo-Tabellen (lesbar ohne Login)

| Tabelle | Inhalt |
|---|---|
| `fisi_labs` | Referenz-Laborumgebungen |
| `fisi_systems` | Referenz-Systemdokumentation |
| `fisi_commands` | Referenz-Befehlssammlung |
| `fisi_troubleshooting_cases` | Referenz-Troubleshooting-Fälle |
| `fisi_docker_services` | Referenz-Docker-Dienste |

Diese Tabellen sind **nur lesbar** für anonyme Besucher. Schreiboperationen sind nicht möglich (RLS verhindert INSERT/UPDATE/DELETE ohne Auth).

### Nutzer-Workspace-Tabellen (nur für eingeloggte Nutzer)

| Tabelle | Inhalt |
|---|---|
| `fisi_user_labs` | Eigene Laborumgebungen |
| `fisi_user_systems` | Eigene Systemdokumentation |
| `fisi_user_commands` | Eigene Befehlssammlung |
| `fisi_user_troubleshooting_cases` | Eigene Troubleshooting-Fälle |
| `fisi_user_docker_services` | Eigene Docker-Dienste |
| `fisi_user_notes` | Praxisnotizen (Titel, Inhalt, Tags, Status, Priorität) |

**Row Level Security (RLS):** Aktiviert auf allen Nutzer-Tabellen.  
Jede Tabelle hat 4 Policies: SELECT / INSERT / UPDATE / DELETE — ausschließlich auf eigene Zeilen beschränkt (`user_id = auth.uid()`).

### SQL-Dateien

| Datei | Beschreibung |
|---|---|
| `supabase/fisi_user_notes.sql` | Tabelle, Trigger, RLS für Praxisnotizen |
| `supabase/fisi_user_workspace.sql` | Tabellen, Trigger, RLS für alle 5 Workspace-Module |

Diese Dateien müssen **manuell** im Supabase SQL Editor ausgeführt werden.

---

## 5. Funktionen (aktuell implementiert)

### Öffentliche Seiten
- [x] Landing Page mit Hero, Modulübersicht, Mobile-Install-Hinweis, OrikOS-Branding
- [x] `/login` — Anmeldeseite
- [x] `/registrieren` — Registrierungsseite

### App-Seiten (sidebar-Navigation)
- [x] `/dashboard` — Übersicht mit Demo-Statistiken + persönlichen Statistiken (eingeloggt)
- [x] `/workspace` — **NEU** Persönliche Gesamtübersicht mit Lab-Hierarchie + Export
- [x] `/labore` — Meine Labore (CRUD) + Referenz-Labore + „Als Vorlage übernehmen"
- [x] `/systeme` — Meine Systeme (CRUD) + Referenz-Systeme + „Als Vorlage übernehmen"
- [x] `/befehle` — Meine Befehle (CRUD) + Referenz-Befehle + „Als Vorlage" + Befehl-Assistent
- [x] `/fehleranalyse` — Meine Fehleranalysen (CRUD) + Referenz-Fälle + „Als Vorlage" + Checklisten
- [x] `/docker-dienste` — Meine Docker-Dienste (CRUD) + Referenz-Dienste + „Als Vorlage übernehmen"
- [x] `/praxisnotizen` — Eigene Notizen (CRUD, Tags, Filter, Status, Priorität)
- [x] `/suche` — **NEU** Globale Suche über alle persönlichen Inhalte
- [x] `/portfolio` — Statische Projektübersicht

### Auth & UX
- [x] AuthProvider / useAuth() Hook (zentral, kein lokales State-Management pro Seite)
- [x] **NEU** TopBar — Benutzer-Bereich oben rechts auf Desktop (Name/E-Mail + Abmelden)
- [x] DemoBanner für nicht eingeloggte Besucher
- [x] Navigation auth-aware (Mobile: Nutzername + Abmelden im Drawer)
- [x] Toast-Benachrichtigungen bei CRUD-Aktionen
- [x] Inline-Formulare + Modal-Formulare für alle CRUD-Operationen
- [x] Onboarding-Karte im Dashboard wenn Workspace noch leer

### Neue Features (Mai 2026)

#### Workspace-Übersicht (`/workspace`)
- Zeigt alle persönlichen Inhalte strukturiert (Labs mit verknüpften Systemen, Befehlen etc.)
- Statistik-Karten für alle 6 Module
- Hierarchische Lab-Gruppenansicht mit aufklappbaren Sektionen
- „Nicht zugeordnet"-Bereich für Systeme ohne Labor-Verknüpfung
- Export-Buttons: Markdown-Download und PDF-Druck

#### „Als Vorlage übernehmen"
- Jede Demo/Referenz-Karte hat einen „Als Vorlage übernehmen"-Button (nur für eingeloggte Nutzer)
- Nicht eingeloggte Benutzer sehen einen deaktivierten Button mit „Anmeldung erforderlich"
- Kopiert Inhalte in die entsprechende `fisi_user_*`-Tabelle mit `user_id` des aktuellen Nutzers
- Verfügbar auf: Labore, Systeme, Befehle, Fehleranalyse, Docker-Dienste

#### Export-Funktionen
- **Markdown-Export:** Generiert vollständige `.md`-Datei mit allen Workspace-Inhalten clientseitig (kein Server benötigt)
- **PDF-Druck:** Nutzt `window.print()` mit druckoptimiertem CSS
- Dateiname: `fisi-labbook-workspace.md`

#### Globale Suche (`/suche`)
- Suche über alle 6 persönlichen Datenmodule gleichzeitig
- Sucht in Titeln, Beschreibungen, IP-Adressen, Befehlen, Tags usw.
- Ergebnisse gruppiert nach Modultyp mit Trefferanzahl
- Suchbegriff-Highlighting in Ergebnissen
- Nur für eingeloggte Nutzer (öffentliche Besucher sehen Hinweis)

#### Troubleshooting-Checklisten
- Button „Checkliste verwenden" auf der Fehleranalyse-Seite
- Vordefinierte Checklisten für: DNS-Problem, Domänenbeitritt, DHCP-Problem, Docker-Problem, SSH-Problem, Netzwerk allgemein
- Einfügen der Checkliste in das Prüfschritte-Feld des Formulars
- Statische Templates — kein KI-API erforderlich

#### Befehls-Vorschlag-Assistent
- Button „Befehl vorschlagen" auf der Befehle-Seite
- Filterung nach Plattform (Windows, PowerShell, Linux, Docker, Git) und Kategorie
- Klick auf Vorschlag füllt Befehlsformular vor (Befehl, Plattform, Kategorie, Zweck, Beispiel)
- Statische Befehlsdatenbank — kein API erforderlich

### Mobile & PWA
- [x] Responsives App-Layout (md-Breakpoint: Sidebar auf Desktop, Top-Bar + Drawer auf Mobil)
- [x] `public/manifest.webmanifest`
- [x] `public/icons/icon-192.png` (192×192)
- [x] `public/icons/icon-512.png` (512×512)
- [x] `public/icons/fisi-labbook-icon.svg` (Quell-SVG)
- [x] Next.js Metadata: `manifest`, `appleWebApp`, `themeColor`, `viewport`

---

## 6. Wichtige URLs

| Beschreibung | URL |
|---|---|
| Produktions-App | https://fisi.oriklab.com |
| Vercel Fallback | https://fisi-labbook.vercel.app |
| OrikLab Hauptseite | https://www.oriklab.com |
| OrikLab Impressum | https://www.oriklab.com/de/impressum |
| OrikLab Datenschutz | https://www.oriklab.com/de/datenschutz |

---

## 7. Letzte Commits (Zusammenfassung)

| Commit | Beschreibung |
|---|---|
| `Initial commit` | Repo-Grundstruktur |
| `Intial FISI LabBook MVP` | Vollständiges MVP mit Auth-Workspace und PWA |
| *(aktuell)* | Mobile App-Layout gefixt, PWA-Manifest ergänzt, alle CRUD-Seiten fertiggestellt |

---

## 8. Geplante nächste Schritte

### Kurzfristig

- [ ] **oriklab-v2:** FISI LabBook als zweites Projekt in der OrikOS-Ecosystem-Sektion der Hauptseite hinzufügen
- [ ] **oriklab-v2:** Eigenen Bereich / Card für FISI LabBook auf der OrikLab Homepage ergänzen

> ⚠️ Arbeiten an der OrikLab-Hauptseite gehören in das Repo `oriklab-v2` — **nicht** in dieses Repo.

### Mittelfristig

- [ ] Service Worker für Offline-Zugriff auf gecachte Inhalte
- [ ] KI-gestützte Zusammenfassungen von Notizen / Fehleranalysen
- [ ] Topologie-Diagramme für Systemdokumentation
- [ ] Export-Button auf Einzel-Labor-Seite

### Langfristig / Optional

- [ ] Echte relationale Verknüpfung zwischen Befehlen/Fehleranalysen und Laboren (foreign key in DB)
- [ ] Offline-Modus mit Service Worker

---

## 9. Lokale Entwicklung

```bash
# Repository klonen und Abhängigkeiten installieren
npm install

# .env.local anlegen
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Entwicklungsserver starten
npm run dev
# → http://localhost:3000

# Code-Qualität prüfen
npm run lint

# Produktions-Build testen
npm run build
```

---

## 10. Sicherheitshinweise

| Regel | Erläuterung |
|---|---|
| `.env.local` niemals committen | Enthält Supabase-Zugangsdaten — muss in `.gitignore` bleiben |
| Kein `service_role`-Key im Frontend | Nur `anon`-Key wird verwendet — RLS übernimmt die Absicherung |
| OrikLab Hauptseite bleibt getrennt | Änderungen an `www.oriklab.com` gehören in `oriklab-v2`, nicht hier |
| Öffentliche Demo-Tabellen schreibgeschützt | RLS-Policies lassen kein INSERT/UPDATE/DELETE durch anonyme Nutzer zu |
| Nutzer-Daten strikt isoliert | Jede Query gegen `fisi_user_*` Tabellen filtert auf `user_id = auth.uid()` |

---

## 11. Projektstruktur (Überblick)

```
fisi-labbook/
├── public/
│   ├── manifest.webmanifest        # PWA Manifest
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── fisi-labbook-icon.svg
├── src/
│   ├── app/
│   │   ├── (public)/               # Landing, Login, Registrieren
│   │   └── (app)/                  # Dashboard + alle Modul-Seiten
│   ├── components/                 # AppShell, Navigation, Forms, Cards …
│   ├── contexts/
│   │   └── AuthContext.tsx         # Zentraler Auth-State via Supabase
│   └── lib/
│       ├── supabase.ts             # Supabase Client (anon-Key)
│       └── types.ts                # TypeScript-Interfaces für alle Tabellen
├── supabase/
│   ├── fisi_user_notes.sql
│   └── fisi_user_workspace.sql
├── PROJECT_STATUS.md               # Diese Datei
└── README.md                       # Setup-Anleitung
```
