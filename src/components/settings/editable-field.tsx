'use client';

import { useState } from 'react';
import { GhostButton } from '@/components/ui/ghost-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/components/shared/language-provider';
import { SavedMark, SettingsError } from './settings-primitives';
import type { SettingsErrorCode, SettingsResult } from '@/app/(app)/settings/actions';
import type { TranslationKey } from '@/types/ui';

/**
 * One field, one save. The addendum rejects a global save button: with per-field
 * confirmation, closing the modal at any moment discards nothing, so there is
 * no "are you sure you want to leave?" step to write.
 *
 * The committed value is local state seeded from the server. After a successful
 * save the row returns to its read state showing the value it just wrote, which
 * is why it does not wait for a refetch.
 */
export function EditableField({
  id,
  labelKey,
  initialValue,
  type = 'text',
  onSave,
}: {
  id: string;
  labelKey: TranslationKey;
  initialValue: string;
  type?: 'text' | 'email';
  onSave: (value: string) => Promise<SettingsResult>;
}) {
  const { t } = useLanguage();
  const [committed, setCommitted] = useState(initialValue);
  const [draft, setDraft] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<SettingsErrorCode | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const result = await onSave(draft);
    setSaving(false);
    if (!result.ok) {
      setError(result.code);
      return;
    }
    setCommitted(draft);
    setEditing(false);
    setSaved(true);
  }

  if (!editing) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium tracking-[0.01em] text-muted2">{t(labelKey)}</span>
          {saved ? <SavedMark /> : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-base text-ink">{committed}</span>
          <GhostButton
            type="button"
            onClick={() => {
              setDraft(committed);
              setSaved(false);
              setError(null);
              setEditing(true);
            }}
          >
            {t('settings.edit')}
          </GhostButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <TextField
        id={id}
        type={type}
        label={t(labelKey)}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
      />
      {error ? <SettingsError code={error} /> : null}
      <div className="flex items-center gap-2">
        <PrimaryButton
          type="button"
          onClick={save}
          disabled={saving || draft.trim() === ''}
          className="px-3 py-[7px] text-sm"
        >
          {t('settings.save')}
        </PrimaryButton>
        <GhostButton type="button" onClick={() => setEditing(false)}>
          {t('settings.cancel')}
        </GhostButton>
      </div>
    </div>
  );
}
