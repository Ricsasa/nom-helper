import type { ButtonHTMLAttributes } from 'react';

/**
 * Filled black button. Hover turns green: green is the colour of user action
 * (design 5.1). Radius stays at zero, like everything else in this interface.
 */
export function PrimaryButton({
  className = '',
  fullWidth = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }) {
  return (
    <button
      {...props}
      className={[
        'px-3.5 py-[11px] text-md font-medium tracking-[0.01em] transition-colors',
        props.disabled
          ? 'cursor-default bg-line text-faint2'
          : 'cursor-pointer bg-ink text-white hover:bg-green',
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    />
  );
}
