import type { Category, ParsedReceipt } from '@/types';

const KEYWORD_PATTERNS: RegExp[] = [
  /total\s*(?:a\s*pagar)?[\s:r$]*([\d.,]+)/i,
  /valor\s*(?:total|líquido|liquido|bruto)?[\s:r$]*([\d.,]+)/i,
  /total\s*geral[\s:r$]*([\d.,]+)/i,
];

const CATEGORY_RULES: Array<{ category: Category; regex: RegExp }> = [
  { category: 'FOOD', regex: /supermercado|mercado|padaria|restaurante|ifood|rappi|açougue|hortifrut|lanchonete|pizzaria|cafeter|coffee|starbucks/i },
  { category: 'TRANSPORT', regex: /posto\s*ipiranga|posto\s*shell|posto\s*br|petrobr|uber|99\b|99\s*pop|taxi|combust[íi]vel|gasolina|estacionamento|metr[ôo]|sptrans|cptm|aeroporto|latam|gol\b|azul/i },
  { category: 'SOFTWARE', regex: /aws|amazon\s*web|azure|google\s*cloud|gcp|netflix|spotify|adobe|figma|notion|slack|zoom|github|jetbrains|linear|vercel|cloudflare|openai|claude/i },
  { category: 'UTILITIES', regex: /energia.*el[ée]trica|enel|cemig|cpfl|gás|telefone|claro|vivo|tim|oi\b|internet|net\s*combo|sabesp|comgás|copel/i },
  { category: 'SUPPLIES', regex: /papelaria|material.*escrit[óo]rio|toner|impressora|kalunga|amazon|magazine|magalu|mercado\s*livre/i },
  { category: 'SERVICES', regex: /contador|advocacia|consultoria|manuten[çc][ãa]o|reparo|cl[íi]nica|m[ée]dic|odontolog|fisio|psic[óo]logo/i },
];

function normalizeAmount(input: string): number | null {
  const cleaned = input.replace(/\s/g, '').replace(/r\$/i, '');
  if (!cleaned) return null;
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');
  let normalized = cleaned;
  if (hasComma && hasDot) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.');
  }
  const value = parseFloat(normalized);
  if (Number.isNaN(value) || value <= 0 || value > 1_000_000) return null;
  return Math.round(value * 100) / 100;
}

function extractAmount(text: string): number | null {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    for (const pat of KEYWORD_PATTERNS) {
      const m = line.match(pat);
      if (m && m[1]) {
        const v = normalizeAmount(m[1]);
        if (v !== null) return v;
      }
    }
  }
  const moneyMatches = text.match(/[\d]{1,3}(?:[.,][\d]{3})*[.,]\d{2}|[\d]+[.,]\d{2}/g) ?? [];
  const values = moneyMatches
    .map(normalizeAmount)
    .filter((v): v is number => v !== null && v >= 0.5);
  if (!values.length) return null;
  return Math.max(...values);
}

function extractMerchant(text: string): string | null {
  const REMOVE_PATTERNS: RegExp[] = [
    /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/,
    /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/,
    /^(nf-?e|nota\s+fiscal|cupom|cnpj|cpf|danfe|sat|extrato)/i,
    /^\d[\d\s./:-]*$/,
    /https?:\/\/|www\./i,
    /^\s*[-=*_]+\s*$/,
  ];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 10);
  for (const line of lines) {
    if (REMOVE_PATTERNS.some((p) => p.test(line))) continue;
    if (line.length < 3 || line.length > 60) continue;
    if (!/[a-zA-ZÀ-ÿ]/.test(line)) continue;
    return line.replace(/\s+/g, ' ').toUpperCase();
  }
  return null;
}

function extractDate(text: string): string | null {
  const m = text.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
  if (!m) return null;
  let [, dd, mm, yyyy] = m;
  if (yyyy.length === 2) yyyy = '20' + yyyy;
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function inferCategory(merchant: string | null, fullText: string): Category {
  const haystack = `${merchant ?? ''} ${fullText}`;
  for (const rule of CATEGORY_RULES) {
    if (rule.regex.test(haystack)) return rule.category;
  }
  return 'OTHER';
}

export function parseReceiptText(rawText: string): ParsedReceipt {
  const amount = extractAmount(rawText);
  const merchant = extractMerchant(rawText);
  const date = extractDate(rawText);
  const category = inferCategory(merchant, rawText);
  return { amount, merchant, category, date, currency: 'BRL', rawText };
}
