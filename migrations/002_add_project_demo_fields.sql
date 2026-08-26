-- Ajoute les champs nécessaires pour afficher une démo/case-study par projet.
-- Idempotent : peut être exécutée plusieurs fois sans casser une base existante.
--
-- Usage : psql -d votre_base -f migrations/002_add_project_demo_fields.sql

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS repo_url TEXT,
  ADD COLUMN IF NOT EXISTS demo_url TEXT,
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Un slug est unique quand il est renseigné (plusieurs projets sans slug restent possibles).
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_idx ON projects (slug) WHERE slug IS NOT NULL;
