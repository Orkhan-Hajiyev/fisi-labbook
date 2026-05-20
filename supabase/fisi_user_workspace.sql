-- ============================================================
-- FISI LabBook — User Workspace Tables
-- Run this SQL manually in the Supabase SQL Editor.
-- https://supabase.com/dashboard → project → SQL Editor
-- ============================================================
-- Creates 5 user-specific tables for personal CRUD content.
-- Each table uses Row Level Security (RLS) so users can only
-- access their own rows (user_id = auth.uid()).
-- ============================================================

-- ── 1. fisi_user_labs ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fisi_user_labs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text NOT NULL,
  topic        text,
  environment  text,
  goal         text,
  description  text,
  status       text DEFAULT 'planned',
  started_at   date,
  completed_at date,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.fisi_user_labs_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fisi_user_labs_updated_at ON public.fisi_user_labs;
CREATE TRIGGER fisi_user_labs_updated_at
  BEFORE UPDATE ON public.fisi_user_labs
  FOR EACH ROW EXECUTE FUNCTION public.fisi_user_labs_set_updated_at();

ALTER TABLE public.fisi_user_labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fisi_user_labs: select own rows"
  ON public.fisi_user_labs FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "fisi_user_labs: insert own rows"
  ON public.fisi_user_labs FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_labs: update own rows"
  ON public.fisi_user_labs FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_labs: delete own rows"
  ON public.fisi_user_labs FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- ── 2. fisi_user_systems ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fisi_user_systems (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id      uuid REFERENCES public.fisi_user_labs(id) ON DELETE SET NULL,
  hostname    text NOT NULL,
  os          text,
  role        text,
  ip_address  text,
  gateway     text,
  dns         text,
  domain_name text,
  services    text,
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.fisi_user_systems_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fisi_user_systems_updated_at ON public.fisi_user_systems;
CREATE TRIGGER fisi_user_systems_updated_at
  BEFORE UPDATE ON public.fisi_user_systems
  FOR EACH ROW EXECUTE FUNCTION public.fisi_user_systems_set_updated_at();

ALTER TABLE public.fisi_user_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fisi_user_systems: select own rows"
  ON public.fisi_user_systems FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "fisi_user_systems: insert own rows"
  ON public.fisi_user_systems FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_systems: update own rows"
  ON public.fisi_user_systems FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_systems: delete own rows"
  ON public.fisi_user_systems FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- ── 3. fisi_user_commands ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fisi_user_commands (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command          text NOT NULL,
  platform         text,
  category         text,
  purpose          text,
  example          text,
  typical_use_case text,
  notes            text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.fisi_user_commands_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fisi_user_commands_updated_at ON public.fisi_user_commands;
CREATE TRIGGER fisi_user_commands_updated_at
  BEFORE UPDATE ON public.fisi_user_commands
  FOR EACH ROW EXECUTE FUNCTION public.fisi_user_commands_set_updated_at();

ALTER TABLE public.fisi_user_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fisi_user_commands: select own rows"
  ON public.fisi_user_commands FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "fisi_user_commands: insert own rows"
  ON public.fisi_user_commands FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_commands: update own rows"
  ON public.fisi_user_commands FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_commands: delete own rows"
  ON public.fisi_user_commands FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- ── 4. fisi_user_troubleshooting_cases ───────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fisi_user_troubleshooting_cases (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  category   text,
  difficulty text,
  symptoms   text,
  checks     text,
  root_cause text,
  solution   text,
  result     text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.fisi_user_troubleshooting_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fisi_user_troubleshooting_updated_at ON public.fisi_user_troubleshooting_cases;
CREATE TRIGGER fisi_user_troubleshooting_updated_at
  BEFORE UPDATE ON public.fisi_user_troubleshooting_cases
  FOR EACH ROW EXECUTE FUNCTION public.fisi_user_troubleshooting_set_updated_at();

ALTER TABLE public.fisi_user_troubleshooting_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fisi_user_troubleshooting: select own rows"
  ON public.fisi_user_troubleshooting_cases FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "fisi_user_troubleshooting: insert own rows"
  ON public.fisi_user_troubleshooting_cases FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_troubleshooting: update own rows"
  ON public.fisi_user_troubleshooting_cases FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_troubleshooting: delete own rows"
  ON public.fisi_user_troubleshooting_cases FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- ── 5. fisi_user_docker_services ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fisi_user_docker_services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  image           text,
  port            text,
  service_type    text,
  status          text,
  purpose         text,
  compose_snippet text,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.fisi_user_docker_services_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fisi_user_docker_services_updated_at ON public.fisi_user_docker_services;
CREATE TRIGGER fisi_user_docker_services_updated_at
  BEFORE UPDATE ON public.fisi_user_docker_services
  FOR EACH ROW EXECUTE FUNCTION public.fisi_user_docker_services_set_updated_at();

ALTER TABLE public.fisi_user_docker_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fisi_user_docker_services: select own rows"
  ON public.fisi_user_docker_services FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "fisi_user_docker_services: insert own rows"
  ON public.fisi_user_docker_services FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_docker_services: update own rows"
  ON public.fisi_user_docker_services FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "fisi_user_docker_services: delete own rows"
  ON public.fisi_user_docker_services FOR DELETE
  TO authenticated USING (user_id = auth.uid());
