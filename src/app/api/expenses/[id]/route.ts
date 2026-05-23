import { NextResponse } from 'next/server';
import { HttpError, requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import type { Category } from '@/types';

const VALID_CATEGORIES: Category[] = [
  'FOOD',
  'TRANSPORT',
  'SUPPLIES',
  'SOFTWARE',
  'UTILITIES',
  'SERVICES',
  'OTHER',
];

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const expense = await db.expenses.findById(params.id, user.id);
    if (!expense) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json({ expense });
  } catch (err) {
    if (err instanceof HttpError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const patch: Record<string, unknown> = {};
    if (typeof body.merchant === 'string') patch.merchant = body.merchant.trim();
    if (typeof body.amount === 'number' && body.amount >= 0) patch.amount = body.amount;
    if (typeof body.category === 'string' && VALID_CATEGORIES.includes(body.category as Category))
      patch.category = body.category;
    if (typeof body.expenseDate === 'string' || body.expenseDate === null)
      patch.expenseDate = body.expenseDate;
    if (typeof body.notes === 'string' || body.notes === null) patch.notes = body.notes;
    if (typeof body.confirmed === 'boolean') patch.confirmed = body.confirmed;

    const updated = await db.expenses.update(params.id, user.id, patch);
    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json({ expense: updated });
  } catch (err) {
    if (err instanceof HttpError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const ok = await db.expenses.remove(params.id, user.id);
    if (!ok) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof HttpError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
