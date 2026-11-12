-- FISI LabBook: public reference content must remain readable after login.
-- Run once in the Supabase SQL Editor for the OrikLab project.
-- Only SELECT access for the five demo tables is changed.
-- Personal fisi_user_* policies are intentionally untouched.

BEGIN;

ALTER POLICY "Allow public read fisi_labs"
  ON public.fisi_labs TO anon, authenticated;

ALTER POLICY "Allow public read fisi_systems"
  ON public.fisi_systems TO anon, authenticated;

ALTER POLICY "Allow public read fisi_commands"
  ON public.fisi_commands TO anon, authenticated;

ALTER POLICY "Allow public read fisi_troubleshooting_cases"
  ON public.fisi_troubleshooting_cases TO anon, authenticated;

ALTER POLICY "Allow public read fisi_docker_services"
  ON public.fisi_docker_services TO anon, authenticated;

COMMIT;
