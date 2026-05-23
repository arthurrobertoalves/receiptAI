import { parseReceiptText } from './parser';
import type { ParsedReceipt } from '@/types';

const VISION_API_URL =
  'https://vision.googleapis.com/v1/images:annotate';

interface VisionResponse {
  responses: Array<{
    fullTextAnnotation?: {
      text: string;
      pages?: unknown[];
    };
    error?: { message: string; code: number };
  }>;
  error?: { message: string; code: number };
}

export async function analyzeReceiptImage(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ParsedReceipt> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GOOGLE_VISION_API_KEY não configurada. Adicione ao .env.local ou variáveis do Render.',
    );
  }

  const base64Image = imageBuffer.toString('base64');

  const requestBody = {
    requests: [
      {
        image: { content: base64Image },
        features: [
          { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 },
        ],
        imageContext: {
          languageHints: ['pt-BR', 'pt', 'en'],
        },
      },
    ],
  };

  const response = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Vision API erro ${response.status}: ${errorText}`);
  }

  const data: VisionResponse = await response.json();

  if (data.error) {
    throw new Error(`Google Vision API: ${data.error.message}`);
  }

  const result = data.responses?.[0];
  if (result?.error) {
    throw new Error(`Google Vision: ${result.error.message}`);
  }

  const rawText = result?.fullTextAnnotation?.text ?? '';
  if (!rawText.trim()) {
    return {
      amount: null,
      merchant: null,
      category: 'OTHER',
      date: null,
      currency: 'BRL',
      rawText: '',
    };
  }

  return parseReceiptText(rawText);
}
