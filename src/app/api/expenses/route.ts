import { NextResponse } from 'next/server';
import { HttpError, requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let expenses = await db.expenses.listForUser(user.id);
    if (category) expenses = expenses.filter((e) => e.category === category);
    if (startDate) {
      expenses = expenses.filter(
        (e) => (e.expenseDate ?? e.createdAt.slice(0, 10)) >= startDate,
      );
    }
    if (endDate) {
      expenses = expenses.filter(
        (e) => (e.expenseDate ?? e.createdAt.slice(0, 10)) <= endDate,
      );
    }
    return NextResponse.json({ data: expenses });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
