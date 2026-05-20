# FISI LabBook

**Systemintegration Labor- und Troubleshooting-Plattform**

Eine praxisorientierte Plattform zur Dokumentation von IT-Laboren, Systemen, Befehlen, Docker-Diensten und Fehleranalysen im Bereich Fachinformatiker für Systemintegration.

---

## Tech Stack

| Technologie | Verwendung |
|---|---|
| Next.js 15 (App Router) | Frontend-Framework |
| TypeScript | Typsicherheit |
| Tailwind CSS | Styling |
| Supabase (PostgreSQL) | Datenbankanbindung |
| Vercel | Deployment |
| lucide-react | Icons |

---

## Voraussetzungen

- Node.js 18 oder neuer
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

Das Supabase-Projekt muss folgende öffentliche Tabellen enthalten:

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
3. Die Übersicht-Seite öffnen — die Stat-Karten zeigen die Anzahl der Datenbankeinträge
4. Fehlt die Konfiguration, erscheint ein gelber Hinweisbanner

---

## Vercel Deployment

1. Repository mit Vercel verbinden
2. Umgebungsvariablen in den Vercel-Projekteinstellungen setzen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy starten — Vercel erkennt Next.js automatisch

---

## Sicherheit

- Nur der `anon`-Key wird im Frontend verwendet (öffentlich sichtbar, aber durch Supabase Row Level Security abgesichert)
- Kein `service_role`-Key im Frontend
- Keine Schreib-, Update- oder Lösch-Operationen in der öffentlichen UI
- Keine Authentifizierung im MVP (geplant für spätere Version)
