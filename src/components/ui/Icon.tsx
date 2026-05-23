import clsx from 'clsx';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export function Icon({ name, className, filled, size }: IconProps) {
  return (
    <span
      className={clsx('material-symbols-outlined leading-none', filled && 'filled', className)}
      style={size ? { fontSize: `${size}px` } : undefined}
    >
      {name}
    </span>
  );
}
