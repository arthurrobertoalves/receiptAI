import { supabase } from './supabase';
import type { Expense, Receipt, User } from '@/types';

// ── Row types (snake_case, espelho do schema do Supabase) ──────────────────────

interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  profile_type: string;
  created_at: string;
}

interface ReceiptRow {
  id: string;
  user_id: string;
  image_url: string;
  raw_text: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

interface ExpenseRow {
  id: string;
  user_id: string;
  receipt_id: string | null;
  amount: number;
  merchant: string;
  category: string;
  expense_date: string | null;
  notes: string | null;
  is_recurring: boolean;
  currency: string;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
}

// ── Mappers camelCase ↔ snake_case ─────────────────────────────────────────────

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    profileType: row.profile_type as User['profileType'],
    createdAt: row.created_at,
  };
}

function fromUser(user: User): UserRow {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password_hash: user.passwordHash,
    profile_type: user.profileType,
    created_at: user.createdAt,
  };
}

function toReceipt(row: ReceiptRow): Receipt {
  return {
    id: row.id,
    userId: row.user_id,
    imageUrl: row.image_url,
    rawText: row.raw_text,
    status: row.status as Receipt['status'],
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fromReceiptPatch(patch: Partial<Receipt>): Partial<ReceiptRow> {
  const row: Partial<ReceiptRow> = {};
  if (patch.userId !== undefined) row.user_id = patch.userId;
  if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl;
  if (patch.rawText !== undefined) row.raw_text = patch.rawText;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.errorMessage !== undefined) row.error_message = patch.errorMessage;
  if (patch.updatedAt !== undefined) row.updated_at = patch.updatedAt;
  return row;
}

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    userId: row.user_id,
    receiptId: row.receipt_id,
    amount: Number(row.amount), // Supabase returns numeric(12,2) as string
    merchant: row.merchant,
    category: row.category as Expense['category'],
    expenseDate: row.expense_date,
    notes: row.notes,
    isRecurring: row.is_recurring,
    currency: row.currency,
    confirmed: row.confirmed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fromExpense(expense: Expense): ExpenseRow {
  return {
    id: expense.id,
    user_id: expense.userId,
    receipt_id: expense.receiptId,
    amount: expense.amount,
    merchant: expense.merchant,
    category: expense.category,
    expense_date: expense.expenseDate,
    notes: expense.notes,
    is_recurring: expense.isRecurring,
    currency: expense.currency,
    confirmed: expense.confirmed,
    created_at: expense.createdAt,
    updated_at: expense.updatedAt,
  };
}

function fromExpensePatch(patch: Partial<Expense>): Partial<ExpenseRow> {
  const row: Partial<ExpenseRow> = {};
  if (patch.merchant !== undefined) row.merchant = patch.merchant;
  if (patch.amount !== undefined) row.amount = patch.amount;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.expenseDate !== undefined) row.expense_date = patch.expenseDate;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.isRecurring !== undefined) row.is_recurring = patch.isRecurring;
  if (patch.confirmed !== undefined) row.confirmed = patch.confirmed;
  if (patch.updatedAt !== undefined) row.updated_at = patch.updatedAt;
  return row;
}

// ── Data Access ────────────────────────────────────────────────────────────────

export const db = {
  users: {
    async findByEmail(email: string): Promise<User | null> {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
      return data ? toUser(data as UserRow) : null;
    },
    async findById(id: string): Promise<User | null> {
      const { data } = await supabase.from('users').select('*').eq('id', id).single();
      return data ? toUser(data as UserRow) : null;
    },
    async create(user: User): Promise<User> {
      const { data, error } = await supabase
        .from('users')
        .insert(fromUser(user))
        .select()
        .single();
      if (error) throw new Error(`DB users.create: ${error.message}`);
      return toUser(data as UserRow);
    },
  },

  receipts: {
    async create(receipt: Receipt): Promise<Receipt> {
      const row: ReceiptRow = {
        id: receipt.id,
        user_id: receipt.userId,
        image_url: receipt.imageUrl,
        raw_text: receipt.rawText,
        status: receipt.status,
        error_message: receipt.errorMessage,
        created_at: receipt.createdAt,
        updated_at: receipt.updatedAt,
      };
      const { data, error } = await supabase.from('receipts').insert(row).select().single();
      if (error) throw new Error(`DB receipts.create: ${error.message}`);
      return toReceipt(data as ReceiptRow);
    },
    async update(id: string, patch: Partial<Receipt>): Promise<Receipt | null> {
      const { data, error } = await supabase
        .from('receipts')
        .update({ ...fromReceiptPatch(patch), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return null;
      return toReceipt(data as ReceiptRow);
    },
    async findById(id: string, userId: string): Promise<Receipt | null> {
      const { data } = await supabase
        .from('receipts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      return data ? toReceipt(data as ReceiptRow) : null;
    },
  },

  expenses: {
    async listForUser(userId: string): Promise<Expense[]> {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return ((data as ExpenseRow[]) ?? []).map(toExpense);
    },
    async findById(id: string, userId: string): Promise<Expense | null> {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      return data ? toExpense(data as ExpenseRow) : null;
    },
    async create(expense: Expense): Promise<Expense> {
      const { data, error } = await supabase
        .from('expenses')
        .insert(fromExpense(expense))
        .select()
        .single();
      if (error) throw new Error(`DB expenses.create: ${error.message}`);
      return toExpense(data as ExpenseRow);
    },
    async update(id: string, userId: string, patch: Partial<Expense>): Promise<Expense | null> {
      const { data, error } = await supabase
        .from('expenses')
        .update({ ...fromExpensePatch(patch), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) return null;
      return toExpense(data as ExpenseRow);
    },
    async remove(id: string, userId: string): Promise<boolean> {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      return !error;
    },
  },
};
