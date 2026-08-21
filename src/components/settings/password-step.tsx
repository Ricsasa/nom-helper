'use client';

import { useState } from 'react';
import { GhostButton } from '@/components/ui/ghost-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/components/shared/language-provider';
import { SettingsError } from './settings-primitives';
import type { SettingsErrorCode, SettingsResult } from '@/app/(app)/settings/actions';

/**
 * A step inside the same modal, not a second modal on top of it (addendum). The
 * parent swaps its body for this component, so there is one dialog, one Escape
 * target and one focus trap.
 */
export function PasswordStep({
  onSave,
  onDone,
  onCancel,
}: {
  onSave: (current: string, next: string, confirmation: string) => Promise<SettingsResult>;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<SettingsErrorCode | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const result = await onSave(current, next, confirmation);
    setSaving(false);
    if (!result.ok) {
      setError(result.code);
      return;
    }
    onDone();
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
      <h3 className="text-base font-medium text-ink">{t('settings.password.title')}</h3>

      <TextField
        id="settings-password-current"
        type="password"
        autoComplete="current-password"
        label={t('settings.password.current')}
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
      />
      <TextField
        id="settings-password-new"
        type="password"
        autoComplete="new-password"
        label={t('settings.password.new')}
        hint={t('settings.password.hint')}
        value={next}
        onChange={(event) => setNext(event.target.value)}
      />
      <TextField
        id="settings-password-confirm"
        type="password"
        autoComplete="new-password"
        label={t('settings.password.confirm')}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />

      {error ? <SettingsError code={error} /> : null}

      <div className="flex items-center gap-2">
        <PrimaryButton
          type="button"
          onClick={save}
          disabled={saving || !current || !next || !confirmation}
          className="px-3 py-[7px] text-sm"
        >
          {t('settings.save')}
        </PrimaryButton>
        <GhostButton type="button" onClick={onCancel}>
          {t('settings.back')}
        </GhostButton>
      </div>
    </div>
  );
}
