import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'panel';
  radius?: 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  glow?: boolean;
}

const RADIUS_CLASS: Record<NonNullable<GlassCardProps['radius']>, string> = {
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[28px]',
  '3xl': 'rounded-[32px]',
  '4xl': 'rounded-4xl',
  '5xl': 'rounded-5xl',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { variant = 'default', radius = '3xl', glow, className, children, ...rest },
  ref,
) {
  const base =
    variant === 'strong' ? 'glass-strong' : variant === 'panel' ? 'glass-panel' : 'glass';
  return (
    <div
      ref={ref}
      className={clsx(base, RADIUS_CLASS[radius], 'refractive-edge', glow && 'liquid-glow', className)}
      {...rest}
    >
      {children}
    </div>
  );
});
