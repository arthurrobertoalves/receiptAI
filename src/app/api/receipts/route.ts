import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';
import { requireUser, HttpError } from '@/lib/auth';
import { analyzeReceiptImage } from '@/lib/vision';
import { db } from '@/lib/db';
import type { Expense, Receipt } from '@/types';

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const BUCKET = 'receipts';

async function uploadToSupabase(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw new Error(`Supabase Storage: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Imagem obrigatória' }, { status: 400 });
    }
    if (!ACCEPTED_MIME.has(file.type)) {
      return NextResponse.json({ error: 'Formato não suportado. Use JPG, PNG ou WEBP.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Imagem maior que 10 MB.' }, { status: 400 });
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${user.id}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Upload da imagem para o Supabase Storage
    const imageUrl = await uploadToSupabase(buffer, filename, file.type);

    // 2. Cria receipt com status PROCESSING
    const now = new Date().toISOString();
    const receipt: Receipt = {
      id: randomUUID(),
      userId: user.id,
      imageUrl,
      rawText: null,
      status: 'PROCESSING',
      errorMessage: null,
      createdAt: now,
      updatedAt: now,
    };
    await db.receipts.create(receipt);

    // 3. OCR com Google Cloud Vision (IA real)
    let parsed;
    try {
      parsed = await analyzeReceiptImage(buffer, file.type);
    } catch (visionErr) {
      await db.receipts.update(receipt.id, {
        status: 'FAILED',
        errorMessage: visionErr instanceof Error ? visionErr.message : 'Falha no OCR',
      });
      return NextResponse.json(
        { error: 'Falha ao analisar a imagem com a IA. Tente outra foto.' },
        { status: 422 },
      );
    }

    // 4. Atualiza receipt com texto extraído
    const updatedReceipt = await db.receipts.update(receipt.id, {
      rawText: parsed.rawText,
      status: 'PROCESSED',
    }) ?? receipt;

    // 5. Cria despesa com dados da IA
    const expense: Expense = {
      id: randomUUID(),
      userId: user.id,
      receiptId: receipt.id,
      amount: parsed.amount ?? 0,
      merchant: parsed.merchant ?? 'Estabelecimento desconhecido',
      category: parsed.category,
      expenseDate: parsed.date,
      notes: null,
      isRecurring: false,
      currency: parsed.currency,
      confirmed: false,
      createdAt: now,
      updatedAt: now,
    };
    await db.expenses.create(expense);

    return NextResponse.json({ receipt: updatedReceipt, expense, parsed }, { status: 201 });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('[receipts/upload]', err);
    return NextResponse.json({ error: 'Erro interno ao processar o recibo.' }, { status: 500 });
  }
}
