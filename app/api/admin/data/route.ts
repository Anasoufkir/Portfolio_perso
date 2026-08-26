// app/api/admin/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session && session.value === 'authenticated';
}

function slugify(input: string) {
  const slug = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  return slug || 'projet';
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const [hero, experiences, projects, skills, certifications] = await Promise.all([
      client.query('SELECT * FROM portfolio_profile ORDER BY id DESC LIMIT 1'),
      client.query('SELECT * FROM experiences ORDER BY sort_order ASC'),
      client.query('SELECT * FROM projects ORDER BY sort_order ASC'),
      client.query('SELECT * FROM skills ORDER BY sort_order ASC'),
      client.query('SELECT * FROM certifications ORDER BY sort_order ASC'),
    ]);
    return NextResponse.json({
      hero: hero.rows[0] || {},
      experiences: experiences.rows,
      projects: projects.rows,
      skills: skills.rows,
      certifications: certifications.rows,
    });
  } catch (err) {
    console.error('GET /api/admin/data failed:', err);
    return NextResponse.json({ error: 'Erreur lors du chargement des données' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { hero, experiences = [], projects = [], skills = [], certifications = [] } = body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (hero) {
      const existing = await client.query('SELECT id FROM portfolio_profile ORDER BY id DESC LIMIT 1');
      if (existing.rows[0]) {
        await client.query(
          `UPDATE portfolio_profile
           SET name=$1, title=$2, description=$3, email=$4, linkedin=$5, github=$6, website=$7, location=$8, available=$9
           WHERE id=$10`,
          [hero.name, hero.title, hero.description, hero.email, hero.linkedin, hero.github, hero.website, hero.location, !!hero.available, existing.rows[0].id]
        );
      } else {
        await client.query(
          `INSERT INTO portfolio_profile (name, title, description, email, linkedin, github, website, location, available)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [hero.name, hero.title, hero.description, hero.email, hero.linkedin, hero.github, hero.website, hero.location, !!hero.available]
        );
      }
    }

    await client.query('DELETE FROM experiences');
    for (let i = 0; i < experiences.length; i++) {
      const e = experiences[i];
      await client.query(
        `INSERT INTO experiences (sort_order, period, type, title, company, location, badge, points, techs)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [i, e.period, e.type, e.title, e.company, e.location, e.badge, e.points || [], e.techs || []]
      );
    }

    await client.query('DELETE FROM projects');
    const usedSlugs = new Set<string>();
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      let slug = slugify(p.slug?.trim() || p.title || `projet-${i + 1}`);
      const base = slug;
      let n = 2;
      while (usedSlugs.has(slug)) {
        slug = `${base}-${n++}`;
      }
      usedSlugs.add(slug);

      await client.query(
        `INSERT INTO projects (sort_order, title, category, description, stack, slug, long_description, repo_url, demo_url, images)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          i,
          p.title,
          p.category,
          p.description,
          p.stack || [],
          slug,
          p.long_description || null,
          p.repo_url || null,
          p.demo_url || null,
          p.images || [],
        ]
      );
    }

    await client.query('DELETE FROM skills');
    for (let i = 0; i < skills.length; i++) {
      const s = skills[i];
      await client.query(
        `INSERT INTO skills (sort_order, category, items) VALUES ($1,$2,$3)`,
        [i, s.category, s.items || []]
      );
    }

    await client.query('DELETE FROM certifications');
    for (let i = 0; i < certifications.length; i++) {
      const c = certifications[i];
      await client.query(
        `INSERT INTO certifications (sort_order, name, issuer) VALUES ($1,$2,$3)`,
        [i, c.name, c.issuer]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/admin/data failed:', err);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  } finally {
    client.release();
  }
}
