'use client';

import Link from 'next/link';
import { StandardsTable } from './standards-table';
import { FooterStrip } from '@/components/shared/footer-strip';
import { SectionLabel } from '@/components/ui/section-label';
import { useLanguage } from '@/components/shared/language-provider';
import {
  formatStandardDate,
  INDEX_UPDATED_ON,
  LOADED_STANDARDS,
} from '@/lib/utils/standards';
import type { TranslationKey } from '@/types/ui';

/**
 * Layer three of the notice hierarchy, and the only one that says everything:
 * what the tool is, which documents it reads, where its scope ends, how to read
 * an answer, and the full disclaimer as the conclusion of all of it (addendum,
 * "Consistency across the three layers"). The two shorter layers link here.
 */
const COVERS: TranslationKey[] = [
  'about.coverage.yes1',
  'about.coverage.yes2',
  'about.coverage.yes3',
  'about.coverage.yes4',
];

const NOT_COVERS: TranslationKey[] = [
  'about.coverage.no1',
  'about.coverage.no2',
  'about.coverage.no3',
  'about.coverage.no4',
];

/** The five fields of the response contract, in the order they are read. */
const ANATOMY: { name: TranslationKey; text: TranslationKey }[] = [
  { name: 'response.summary', text: 'about.anatomy.summary' },
  { name: 'response.explanation', text: 'about.anatomy.explanation' },
  { name: 'response.citations', text: 'about.anatomy.citations' },
  { name: 'response.confidence', text: 'about.anatomy.confidence' },
  { name: 'response.insufficient', text: 'about.anatomy.insufficient' },
];

/** Filled bars per level. The label next to them carries the same meaning. */
const CONFIDENCE: { bars: number; label: TranslationKey; text: TranslationKey }[] = [
  { bars: 3, label: 'response.confidence.high', text: 'about.confidence.high' },
  { bars: 2, label: 'response.confidence.medium', text: 'about.confidence.medium' },
  { bars: 1, label: 'response.confidence.low', text: 'about.confidence.low' },
];

const DISCLAIMER: { title: TranslationKey; text: TranslationKey }[] = [
  { title: 'about.disclaimer.does.title', text: 'about.disclaimer.does.text' },
  { title: 'about.disclaimer.doesNot.title', text: 'about.disclaimer.doesNot.text' },
  { title: 'about.disclaimer.errors.title', text: 'about.disclaimer.errors.text' },
  { title: 'about.disclaimer.liability.title', text: 'about.disclaimer.liability.text' },
];

export function AboutView() {
  const { t, language } = useLanguage();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-topbar shrink-0 items-center gap-3 border-b border-line px-5">
        <h1 className="min-w-0 flex-1 truncate text-base font-medium">{t('about.title')}</h1>
        <Link
          href="/chat"
          className="shrink-0 border border-lineGhost px-2.5 py-[5px] text-sm text-muted2 transition-colors hover:border-[#B9BCB8] hover:text-ink"
        >
          {t('about.back')}
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-doc px-5 pb-24 pt-10">
          <h2 className="text-4xl font-semibold tracking-tight">{t('brand.name')}</h2>
          <p className="mt-3 max-w-[60ch] text-lg text-body">{t('about.p1')}</p>
          <p className="mt-3 max-w-[60ch] text-lg text-body">{t('about.p2')}</p>

          <SectionLabel marker="green" className="mb-3.5 mt-11">
            {t('about.standards.label')}
          </SectionLabel>
          <StandardsTable standards={LOADED_STANDARDS} />
          <p className="mt-2 font-mono text-mini text-faint2">
            {LOADED_STANDARDS.length}
            {t('about.standards.footnote')}
            {formatStandardDate(INDEX_UPDATED_ON, language)}
          </p>

          <SectionLabel marker="violet" className="mb-3.5 mt-12">
            {t('about.coverage.label')}
          </SectionLabel>
          <div className="grid grid-cols-1 gap-px border border-line bg-line shell:grid-cols-2">
            <section className="bg-surface p-[18px]">
              <h3 className="mb-3 text-md font-semibold">{t('about.coverage.yes')}</h3>
              <ul className="flex flex-col gap-[9px]">
                {COVERS.map((key) => (
                  <li key={key} className="flex gap-2.5 text-base leading-[1.5] text-body">
                    <span className="shrink-0 font-mono text-green" aria-hidden="true">
                      +
                    </span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-surface p-[18px]">
              <h3 className="mb-3 text-md font-semibold">{t('about.coverage.no')}</h3>
              <ul className="flex flex-col gap-[9px]">
                {NOT_COVERS.map((key) => (
                  <li key={key} className="flex gap-2.5 text-base leading-[1.5] text-muted2">
                    <span className="shrink-0 font-mono text-faint2" aria-hidden="true">
                      –
                    </span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <SectionLabel marker="green" className="mb-3.5 mt-12">
            {t('about.anatomy.label')}
          </SectionLabel>
          <dl className="border-t border-line">
            {ANATOMY.map((field, index) => (
              <div key={field.text} className="flex gap-4 border-b border-line py-3.5">
                <span className="w-[22px] shrink-0 pt-0.5 font-mono text-xs text-violet">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <dt className="w-[112px] shrink-0 text-base font-semibold">{t(field.name)}</dt>
                <dd className="text-base leading-[1.55] text-body">{t(field.text)}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mb-2.5 mt-[26px] text-base font-semibold">{t('about.confidence.label')}</h3>
          <div className="border border-line bg-surface">
            {CONFIDENCE.map((level, index) => (
              <div
                key={level.label}
                className={[
                  'flex gap-3.5 px-4 py-3.5',
                  index === CONFIDENCE.length - 1 ? '' : 'border-b border-lineSoft',
                ].join(' ')}
              >
                <span className="flex shrink-0 items-center gap-[3px] pt-[3px]" aria-hidden="true">
                  {[0, 1, 2].map((bar) => (
                    <span
                      key={bar}
                      className={`h-[7px] w-[14px] border ${
                        bar < level.bars ? 'border-ink bg-ink' : 'border-barEmpty'
                      }`}
                    />
                  ))}
                </span>
                <span className="w-[52px] shrink-0 text-base font-semibold">{t(level.label)}</span>
                <p className="text-base leading-[1.55] text-body">{t(level.text)}</p>
              </div>
            ))}
          </div>

          <SectionLabel marker="notice" className="mb-3.5 mt-12">
            {t('about.disclaimer.label')}
          </SectionLabel>
          <section className="flex flex-col gap-4 border border-l-[3px] border-noticeBorder border-l-noticeRule bg-noticeBg px-6 py-[22px]">
            {DISCLAIMER.map((block) => (
              <div key={block.title}>
                <h3 className="mb-1 text-base font-semibold">{t(block.title)}</h3>
                <p className="text-base leading-[1.6] text-body">{t(block.text)}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      <FooterStrip />
    </div>
  );
}
