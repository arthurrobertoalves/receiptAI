export type ProfileType = 'MEI' | 'FREELANCER' | 'SMALL_BUSINESS';

export type Category =
  | 'FOOD'
  | 'TRANSPORT'
  | 'SUPPLIES'
  | 'SOFTWARE'
  | 'UTILITIES'
  | 'SERVICES'
  | 'OTHER';

export type ReceiptStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

// TS types (camelCase) — mapeados de/para snake_case do Supabase na camada db.ts
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  profileType: ProfileType;
  createdAt: string;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface Receipt {
  id: string;
  userId: string;
  imageUrl: string;
  rawText: string | null;
  status: ReceiptStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  receiptId: string | null;
  amount: number;
  merchant: string;
  category: Category;
  expenseDate: string | null;
  notes: string | null;
  isRecurring: boolean;
  currency: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedReceipt {
  amount: number | null;
  merchant: string | null;
  category: Category;
  date: string | null;
  currency: string;
  rawText: string;
}
