import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { HistoryClient } from './HistoryClient';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const session = await getSessionUser();
  if (!session) redirect('/login');
  const expenses = await db.expenses.listForUser(session.id);
  return <HistoryClient initialExpenses={expenses} />;
}
