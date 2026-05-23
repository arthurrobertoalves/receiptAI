'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import type { ProfileType } from '@/types';

const PROFILES: { value: ProfileType; label: string; icon: string; description: string }[] = [
  { value: 'MEI', label: 'MEI', icon: 'badge', description: 'Microempreendedor' },
  { value: 'FREELANCER', label: 'Freelancer', icon: 'work', description: 'Trabalho autônomo' },
  { value: 'SMALL_BUSINESS', label: 'Pequeno negócio', icon: 'storefront', description: 'Tenho equipe' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    profileType: 'MEI' as ProfileType,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Falha ao criar conta');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-on flex items-center justify-center">
            <Icon name="receipt_long" filled size={20} />
          </div>
          <span className="font-sora font-bold text-xl text-primary">
            Receipt<span className="text-on-surface">AI</span>
          </span>
        </div>
        <h1 className="font-sora text-headline-md text-balance">Conta nova em 30s</h1>
        <p className="text-on-surface-variant mt-2 text-sm">
          Sem cartão de crédito. Sem complicação.
        </p>
      </div>

      <GlassCard radius="4xl" className="p-7">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="font-grotesk text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-1.5 block">
              Como você quer ser chamado?
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl bg-white/70 border border-outline-variant/60 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Ana, Carlos, Time…"
            />
          </div>
          <div>
            <label className="font-grotesk text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-1.5 block">
              E-mail
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl bg-white/70 border border-outline-variant/60 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="font-grotesk text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-2 block">
              Perfil
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PROFILES.map((p) => {
                const active = form.profileType === p.value;
                return (
                  <button
                    type="button"
                    key={p.value}
                    onClick={() => setForm({ ...form, profileType: p.value })}
                    className={clsx(
                      'rounded-2xl p-3 text-center transition border',
                      active
                        ? 'bg-primary text-primary-on border-primary shadow-liquid'
                        : 'bg-white/60 border-outline-variant/40 text-on-surface-variant hover:border-primary/50',
                    )}
                  >
                    <Icon name={p.icon} className="block mx-auto mb-1" size={20} filled={active} />
                    <p className="font-grotesk text-[10px] uppercase tracking-wider">{p.label}</p>
                  </button>
                );
              })}
            </div>
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
            {loading ? <Icon name="sync" className="animate-spin" size={20} /> : <Icon name="arrow_forward" size={20} />}
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </GlassCard>

      <p className="text-center text-sm text-on-surface-variant mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
