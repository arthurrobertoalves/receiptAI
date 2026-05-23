import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { setSessionCookie, signSession, toPublicUser } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Body inválido' }, { status: 400 });

  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  const user = await db.users.findByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 });
  }

  const token = await signSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ user: toPublicUser(user) });
}
