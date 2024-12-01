// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Anas@2026!';
const SESSION_TOKEN = 'admin_session';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_TOKEN, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
