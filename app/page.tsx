import { Pool } from 'pg';
import PageClient from './page-client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getData() {
  const client = await pool.connect();
  try {
    const [profile, experiences, projects, skills, certifications] = await Promise.all([
      client.query('SELECT * FROM portfolio_profile ORDER BY id DESC LIMIT 1'),
      client.query('SELECT * FROM experiences ORDER BY sort_order ASC'),
      client.query('SELECT * FROM projects ORDER BY sort_order ASC'),
      client.query('SELECT * FROM skills ORDER BY sort_order ASC'),
      client.query('SELECT * FROM certifications ORDER BY sort_order ASC'),
    ]);
    return {
      profile: profile.rows[0] || {},
      experiences: experiences.rows,
      projects: projects.rows,
      skills: skills.rows,
      certifications: certifications.rows,
    };
  } finally {
    client.release();
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const data = await getData();
  return <PageClient data={data} />;
}
