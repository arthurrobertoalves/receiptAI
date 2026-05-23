import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { setSessionCookie, signSession, toPublicUser } from '@/lib/auth';
import type { ProfileType, User } from '@/types';

const VALID_PROFILES: ProfileType[] = ['MEI', 'FREELANCER', 'SMALL_BUSINESS'];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Body inválido' }, { status: 400 });

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const profileType: ProfileType = VALID_PROFILES.includes(body.profileType)
    ? body.profileType
    : 'MEI';

  if (name.length < 2) return NextResponse.json({ error: 'Nome muito curto' }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email))
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 });

  const existing = await db.users.findByEmail(email);
  if (existing) return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: randomUUID(),
    email,
    name,
    passwordHash,
    profileType,
    createdAt: new Date().toISOString(),
  };
  await db.users.create(user);

  const token = await signSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
}
