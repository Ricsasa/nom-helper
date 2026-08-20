import type { ReactNode } from 'react';

type MarkerTone = 'green' | 'violet' | 'notice' | 'none';

const MARKER: Record<Exclude<MarkerTone, 'none'>, string> = {
  green: 'bg-green',
  violet: 'bg-violet',
  notice: 'bg-noticeRule',
};

/**
 * Mono small-caps label, almost always preceded by a 7px square marker
 * (design 6). The marker colour is meaning, not decoration: green for user
 * action, violet for provenance, amber for the persistent warning.
 */
export function SectionLabel({
  children,
  marker = 'none',
  className = '',
}: {
  children: ReactNode;
  marker?: MarkerTone;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {marker !== 'none' ? (
        <span className={`h-[7px] w-[7px] shrink-0 -translate-y-px ${MARKER[marker]}`} aria-hidden="true" />
      ) : null}
      <span className="font-mono text-micro uppercase tracking-label text-faint">{children}</span>
    </div>
  );
}
