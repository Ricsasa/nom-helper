import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Label plus input. `trailing` carries the "Recuperar acceso" link that sits on
 * the right of the password label row; `hint` carries the password rule shown
 * on the register screen (design 7.1).
 */
export function TextField({
  id,
  label,
  trailing,
  hint,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  trailing?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium tracking-[0.01em] text-muted2">
          {label}
        </label>
        {trailing}
      </div>
      <input
        {...props}
        id={id}
        aria-describedby={hint ? `${id}-hint` : props['aria-describedby']}
        className={[
          'w-full border border-lineInput bg-surface px-[11px] py-[9px] text-[14px] text-ink',
          'outline-none transition-colors focus:border-green',
          className,
        ].join(' ')}
      />
      {hint ? (
        <p id={`${id}-hint`} className="font-mono text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
