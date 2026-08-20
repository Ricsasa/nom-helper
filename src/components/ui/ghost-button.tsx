import type { ButtonHTMLAttributes } from 'react';

export function GhostButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'border border-lineGhost bg-transparent px-2.5 py-[5px] text-sm text-muted2 transition-colors',
        'hover:border-[#B9BCB8] hover:text-ink',
        className,
      ].join(' ')}
    />
  );
}
