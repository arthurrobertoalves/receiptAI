import { NextResponse } from 'next/server';
import { HttpError, requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const receipt = await db.receipts.findById(params.id, user.id);
    if (!receipt) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json({ receipt });
  } catch (err) {
    if (err instanceof HttpError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
