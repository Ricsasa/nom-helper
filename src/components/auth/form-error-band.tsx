import type { FormError } from '@/types/ui';

/**
 * The error band never apologises and never uses colour alone: the `!` glyph
 * and the weight of the title carry the state as much as the earthy red does
 * (design 7.7, spec section 7).
 */
export function FormErrorBand({ error }: { error: FormError }) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-2.5 border border-errBorder bg-errBg px-3.5 py-3"
    >
      <span className="font-mono text-sm font-medium text-errMark" aria-hidden="true">
        !
      </span>
      <div>
        <p className="text-base font-medium text-errTitle">{error.title}</p>
        <p className="mt-0.5 text-[13px] text-errBody">{error.help}</p>
      </div>
    </div>
  );
}
