import { redirect } from 'next/navigation';
import { getSessionUser, toPublicUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';

const PROFILE_LABELS = {
  MEI: 'MEI',
  FREELANCER: 'Freelancer',
  SMALL_BUSINESS: 'Pequeno negócio',
} as const;

export default async function SettingsPage() {
  const session = await getSessionUser();
  if (!session) redirect('/login');
  const user = toPublicUser(session);
  const expenses = await db.expenses.listForUser(user.id);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <section>
        <h1 className="font-sora text-headline-md md:text-headline-lg">Ajustes</h1>
        <p className="text-on-surface-variant mt-1">Sua conta e preferências.</p>
      </section>

      <GlassCard radius="4xl" className="p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-on flex items-center justify-center font-sora text-2xl font-semibold shadow-liquid">
          {user.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sora text-xl font-semibold">{user.name}</p>
          <p className="text-on-surface-variant truncate">{user.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-primary-container text-primary-on-container font-grotesk text-[10px] uppercase tracking-wider">
            <Icon name="badge" size={12} /> {PROFILE_LABELS[user.profileType]}
          </span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard radius="3xl" className="p-5">
          <p className="font-grotesk text-[10px] uppercase tracking-wider text-on-surface-variant">
            Recibos escaneados
          </p>
          <p className="font-sora text-3xl font-semibold text-primary tabular-nums mt-1">
            {expenses.length}
          </p>
        </GlassCard>
        <GlassCard radius="3xl" className="p-5">
          <p className="font-grotesk text-[10px] uppercase tracking-wider text-on-surface-variant">
            Confirmados
          </p>
          <p className="font-sora text-3xl font-semibold text-primary tabular-nums mt-1">
            {expenses.filter((e) => e.confirmed).length}
          </p>
        </GlassCard>
      </div>

      <GlassCard radius="4xl" className="p-6 space-y-4">
        <h3 className="font-sora text-lg">Preferências</h3>
        <SettingRow icon="dark_mode" label="Tema claro" hint="Em breve" />
        <SettingRow icon="notifications" label="Notificações de processamento" hint="Em breve" />
        <SettingRow icon="cloud_download" label="Exportar dados (CSV / PDF)" hint="Em breve" />
        <SettingRow icon="lock" label="Alterar senha" hint="Em breve" />
      </GlassCard>

      <GlassCard radius="4xl" className="p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-sora text-lg">Sair da conta</h3>
          <p className="text-sm text-on-surface-variant">Encerra a sessão atual neste navegador.</p>
        </div>
        <LogoutButton />
      </GlassCard>
    </div>
  );
}

function SettingRow({ icon, label, hint }: { icon: string; label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-primary-container/40 text-primary flex items-center justify-center">
        <Icon name={icon} size={20} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        {hint && (
          <p className="font-grotesk text-[10px] uppercase tracking-wider text-on-surface-variant">
            {hint}
          </p>
        )}
      </div>
      <Icon name="chevron_right" className="text-outline" />
    </div>
  );
}
