'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Falha ao entrar');
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-on flex items-center justify-center shadow-liquid">
            <Icon name="receipt_long" filled />
          </div>
          <span className="font-sora font-bold text-2xl text-primary">
            Receipt<span className="text-on-surface">AI</span>
          </span>
        </div>
        <h1 className="font-sora text-headline-md text-balance">Tire foto. Pronto.</h1>
        <p className="text-on-surface-variant mt-2">
          Entre para continuar organizando seus gastos no automático.
        </p>
      </div>

      <GlassCard radius="4xl" className="p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="font-grotesk text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-1.5 block">
              E-mail
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-white/70 border border-outline-variant/60 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="font-grotesk text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-1.5 block">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl bg-white/70 border border-outline-variant/60 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-error-container/70 text-error-on-container px-4 py-3 text-sm flex items-center gap-2">
              <Icon name="error" size={18} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary text-primary-on py-3.5 font-semibold shadow-liquid-strong hover:bg-primary/90 active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Icon name="sync" className="animate-spin" size={20} /> : <Icon name="login" size={20} />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </GlassCard>

      <p className="text-center text-sm text-on-surface-variant mt-6">
        Ainda não tem conta?{' '}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Crie em 30 segundos
        </Link>
      </p>
    </div>
  );
}
