/*
# Create programs table for church weekly program

1. New Tables
- `programs`
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null) — name of the program, e.g. "Réunion de prière"
  - `description` (text) — details about the program
  - `program_date` (date, not null) — the date of the event
  - `day_name` (text, not null) — day of the week in French, e.g. "Mercredi"
  - `start_time` (text, not null) — start time as string, e.g. "18h30"
  - `location` (text, not null) — where the event takes place
  - `status` (text, not null, default 'draft') — 'published' or 'draft'
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `programs`.
- Public (anon) can SELECT only published programs.
- Authenticated users can SELECT all programs (including drafts).
- Authenticated users can INSERT, UPDATE, and DELETE programs.
- Four separate policies, one per CRUD verb (plus the public SELECT).

3. Notes
- The admin panel requires authentication (email/password via Supabase Auth).
- Visitors see only programs with status = 'published'.
- Programs are sorted by date on the public page.
*/

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  program_date date NOT NULL,
  day_name text NOT NULL,
  start_time text NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Public can read only published programs
DROP POLICY IF EXISTS "public_select_published_programs" ON programs;
CREATE POLICY "public_select_published_programs"
ON programs FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Authenticated can read all programs (including drafts)
DROP POLICY IF EXISTS "auth_select_all_programs" ON programs;
CREATE POLICY "auth_select_all_programs"
ON programs FOR SELECT
TO authenticated
USING (true);

-- Authenticated can insert programs
DROP POLICY IF EXISTS "auth_insert_programs" ON programs;
CREATE POLICY "auth_insert_programs"
ON programs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated can update programs
DROP POLICY IF EXISTS "auth_update_programs" ON programs;
CREATE POLICY "auth_update_programs"
ON programs FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Authenticated can delete programs
DROP POLICY IF EXISTS "auth_delete_programs" ON programs;
CREATE POLICY "auth_delete_programs"
ON programs FOR DELETE
TO authenticated
USING (true);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_programs_date ON programs(program_date);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
