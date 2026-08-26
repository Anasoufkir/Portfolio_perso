import { Pool } from 'pg';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface ProjectDetail {
  id: number;
  title: string;
  category: string;
  description: string;
  long_description: string | null;
  stack: string[];
  slug: string;
  repo_url: string | null;
  demo_url: string | null;
  images: string[];
}

async function getProject(slug: string): Promise<ProjectDetail | null> {
  const { rows } = await pool.query('SELECT * FROM projects WHERE slug = $1 LIMIT 1', [slug]);
  return rows[0] || null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Anas Oufkir`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <Link
          href="/#projets"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-700"
        >
          <ArrowLeft size={14} /> Retour aux projets
        </Link>

        <div className="mt-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{project.category}</span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">{project.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                <GitBranch size={15} /> Voir le repo
              </a>
            )}
            {project.demo_url && !project.demo_url.includes('github.com') && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ExternalLink size={15} /> Voir la démo
              </a>
            )}
          </div>

          {project.images?.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {project.images.map((src, i) => (
                <div
                  key={src + i}
                  className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — capture ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {project.long_description && (
            <div className="mt-10 whitespace-pre-line text-sm leading-7 text-slate-600">
              {project.long_description}
            </div>
          )}

          {project.stack?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-7">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
