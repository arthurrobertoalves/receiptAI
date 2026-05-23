-- ReceiptAI — Schema Supabase
-- Execute este SQL no Supabase: Dashboard > SQL Editor > New Query

-- Extensão para UUID
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════════
-- TABELA: users
-- ══════════════════════════════════════════════
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  email         text not null unique,
  name          text not null,
  password_hash text not null,
  profile_type  text not null default 'MEI'
                  check (profile_type in ('MEI', 'FREELANCER', 'SMALL_BUSINESS')),
  created_at    timestamptz not null default now()
);

-- ══════════════════════════════════════════════
-- TABELA: receipts
-- ══════════════════════════════════════════════
create table if not exists public.receipts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  image_url     text not null,
  raw_text      text,
  status        text not null default 'PENDING'
                  check (status in ('PENDING','PROCESSING','PROCESSED','FAILED')),
  error_message text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists receipts_user_id_idx on public.receipts(user_id);

-- ══════════════════════════════════════════════
-- TABELA: expenses
-- ══════════════════════════════════════════════
create table if not exists public.expenses (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  receipt_id    uuid references public.receipts(id) on delete set null,
  amount        numeric(12,2) not null,
  merchant      text not null,
  category      text not null default 'OTHER'
                  check (category in ('FOOD','TRANSPORT','SUPPLIES','SOFTWARE','UTILITIES','SERVICES','OTHER')),
  expense_date  date,
  notes         text,
  is_recurring  boolean not null default false,
  currency      varchar(3) not null default 'BRL',
  confirmed     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists expenses_user_id_idx    on public.expenses(user_id);
create index if not exists expenses_category_idx   on public.expenses(category);
create index if not exists expenses_expense_date_idx on public.expenses(expense_date);

-- ══════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- (desativado — a app usa service_role key no servidor)
-- ══════════════════════════════════════════════
alter table public.users    disable row level security;
alter table public.receipts disable row level security;
alter table public.expenses disable row level security;

-- ══════════════════════════════════════════════
-- STORAGE: bucket "receipts" para imagens
-- ══════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

-- Política para permitir upload/leitura via service_role
create policy "service role full access receipts"
  on storage.objects for all
  using (bucket_id = 'receipts')
  with check (bucket_id = 'receipts');
