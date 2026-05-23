import type { ParsedReceipt } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const SYSTEM_PROMPT = `Você é um extrator de dados de notas fiscais e recibos brasileiros.
Analise a imagem e retorne APENAS um JSON válido — sem texto extra, sem markdown.

Campos obrigatórios:
{
  "amount": <número decimal (ex: 97.60) ou null se não encontrar>,
  "merchant": <nome do estabelecimento em MAIÚSCULAS ou null>,
  "category": <uma das opções: FOOD | TRANSPORT | SUPPLIES | SOFTWARE | UTILITIES | SERVICES | OTHER>,
  "date": <data no formato YYYY-MM-DD ou null>,
  "raw_text": <todo o texto que você lê na nota, numa única string com \\n entre linhas>
}

Regras de categoria:
- FOOD: supermercado, padaria, restaurante, lanchonete, delivery, café
- TRANSPORT: posto de gasolina, uber, 99, táxi, estacionamento, combustível, passagem
- SUPPLIES: papelaria, material de escritório, Amazon, Mercado Livre, loja de informática
- SOFTWARE: AWS, Azure, Google Cloud, Netflix, Spotify, Adobe, assinaturas digitais
- UTILITIES: conta de luz, água, gás, telefone, internet, operadoras
- SERVICES: contador, advocacia, consultoria, clínica, manutenção
- OTHER: qualquer outro caso

Retorne somente o JSON, nada mais.`;

interface GroqResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

interface ExtractedData {
  amount?: number | null;
  merchant?: string | null;
  category?: string | null;
  date?: string | null;
  raw_text?: string | null;
}

const VALID_CATEGORIES = new Set([
  'FOOD', 'TRANSPORT', 'SUPPLIES', 'SOFTWARE', 'UTILITIES', 'SERVICES', 'OTHER',
]);

export async function analyzeReceiptImage(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ParsedReceipt> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY não configurada. Crie uma chave gratuita em console.groq.com e adicione ao .env.local.',
    );
  }

  const base64 = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const body = {
    model: MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: SYSTEM_PROMPT },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    max_tokens: 512,
    temperature: 0,
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq API erro ${response.status}: ${text}`);
  }

  const data: GroqResponse = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '{}';

  let extracted: ExtractedData = {};
  try {
    extracted = JSON.parse(content) as ExtractedData;
  } catch {
    // fallback: sem dados
  }

  const amount = typeof extracted.amount === 'number' && extracted.amount > 0
    ? Math.round(extracted.amount * 100) / 100
    : null;

  const merchant = typeof extracted.merchant === 'string' && extracted.merchant.trim().length > 0
    ? extracted.merchant.trim().toUpperCase()
    : null;

  const category = typeof extracted.category === 'string' && VALID_CATEGORIES.has(extracted.category)
    ? (extracted.category as ParsedReceipt['category'])
    : 'OTHER';

  const date = typeof extracted.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(extracted.date)
    ? extracted.date
    : null;

  const rawText = typeof extracted.raw_text === 'string' ? extracted.raw_text : '';

  return { amount, merchant, category, date, currency: 'BRL', rawText };
}
