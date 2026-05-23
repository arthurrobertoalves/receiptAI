import clsx from 'clsx';

type Tone = 'processed' | 'pending' | 'new' | 'neutral' | 'recurring';

const TONES: Record<Tone, { wrap: string; dot?: string }> = {
  processed: { wrap: 'bg-primary-container text-primary-on-container', dot: 'bg-primary' },
  pending: {
    wrap: 'bg-surface-container-highest text-on-surface-variant',
    dot: 'bg-outline',
  },
  new: { wrap: 'bg-primary text-primary-on' },
  neutral: { wrap: 'bg-surface-container-high text-on-surface-variant' },
  recurring: { wrap: 'bg-tertiary-container text-tertiary-on-container', dot: 'bg-tertiary' },
};

interface StatusChipProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function StatusChip({ tone = 'processed', children, className, dot = true }: StatusChipProps) {
  const t = TONES[tone];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-grotesk text-[10px] uppercase tracking-[0.08em]',
        t.wrap,
        className,
      )}
    >
      {dot && t.dot && <span className={clsx('w-1.5 h-1.5 rounded-full', t.dot)} />}
      {children}
    </span>
  );
}
