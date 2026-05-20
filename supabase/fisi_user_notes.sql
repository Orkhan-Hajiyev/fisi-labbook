-- ============================================================
-- FISI LabBook — Praxisnotizen
-- Run this SQL manually in the Supabase SQL Editor.
-- https://supabase.com/dashboard → project → SQL Editor
-- ============================================================

-- Table
CREATE TABLE IF NOT EXISTS public.fisi_user_notes (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  content      text,
  category     text,
  priority     text        DEFAULT 'mittel',
  status       text        DEFAULT 'offen',
  tags         text[]      DEFAULT '{}',
  related_area text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.fisi_user_notes_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fisi_user_notes_set_updated_at ON public.fisi_user_notes;
CREATE TRIGGER fisi_user_notes_set_updated_at
  BEFORE UPDATE ON public.fisi_user_notes
  FOR EACH ROW EXECUTE FUNCTION public.fisi_user_notes_set_updated_at();

-- Row Level Security
ALTER TABLE public.fisi_user_notes ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can only access their own rows
CREATE POLICY "Users: select own notes"
  ON public.fisi_user_notes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users: insert own notes"
  ON public.fisi_user_notes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users: update own notes"
  ON public.fisi_user_notes FOR UPDATE
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users: delete own notes"
  ON public.fisi_user_notes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
