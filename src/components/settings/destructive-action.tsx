'use client';

import { useState } from 'react';
import { GhostButton } from '@/components/ui/ghost-button';
import { TextField } from '@/components/ui/text-field';
import { useLanguage } from '@/components/shared/language-provider';
import { SavedMark, SettingsError } from './settings-primitives';
import type { SettingsErrorCode, SettingsResult } from '@/app/(app)/settings/actions';
import type { TranslationKey } from '@/types/ui';

/**
 * Two states: the action, and the confirmation that says exactly what is lost
 * and what is kept. `confirmWordKey` turns the second state into a typed gate —
 * the confirm button stays disabled until the word matches, so account deletion
 * cannot happen on a stray click or a held Enter key.
 *
 * The word is translated: a user reading the interface in English is asked to
 * type an English word, otherwise the gate tests transcription, not intent.
 */
export function DestructiveAction({
  id,
  actionKey,
  bodyKey,
  confirmKey,
  doneKey,
  confirmWordKey,
  onConfirm,
}: {
  id: string;
  actionKey: TranslationKey;
  bodyKey: TranslationKey;
  confirmKey: TranslationKey;
  doneKey?: TranslationKey;
  confirmWordKey?: TranslationKey;
  onConfirm: () => Promise<SettingsResult>;
}) {
  const { t } = useLanguage();
  const [arming, setArming] = useState(false);
  const [typed, setTyped] = useState('');
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<SettingsErrorCode | null>(null);

  const word = confirmWordKey ? t(confirmWordKey) : null;
  const gateOpen = word === null || typed.trim() === word;

  async function confirm() {
    setRunning(true);
    setError(null);
    const result = await onConfirm();
    setRunning(false);
    if (!result.ok) {
      setError(result.code);
      return;
    }
    setArming(false);
    setTyped('');
    if (doneKey) setDone(true);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-base text-ink">{t(actionKey)}</span>
        {done && doneKey ? (
          <SavedMark labelKey={doneKey} />
        ) : arming ? null : (
          <GhostButton
            type="button"
            onClick={() => {
              setDone(false);
              setError(null);
              setArming(true);
            }}
          >
            {t('settings.delete')}
          </GhostButton>
        )}
      </div>

      {arming ? (
        <div className="flex flex-col gap-2.5 border-l-2 border-line pl-3">
          <p className="text-sm text-muted2">{t(bodyKey)}</p>

          {word ? (
            <TextField
              id={`${id}-word`}
              label={t('settings.data.accountPrompt')}
              value={typed}
              autoFocus
              autoComplete="off"
              onChange={(event) => setTyped(event.target.value)}
            />
          ) : null}

          {error ? <SettingsError code={error} /> : null}

          <div className="flex items-center gap-2">
            <GhostButton
              type="button"
              onClick={confirm}
              disabled={running || !gateOpen}
              className={
                gateOpen && !running
                  ? 'border-ink font-medium text-ink'
                  : 'cursor-default text-faint2'
              }
            >
              {t(confirmKey)}
            </GhostButton>
            <GhostButton
              type="button"
              onClick={() => {
                setArming(false);
                setTyped('');
                setError(null);
              }}
            >
              {t('settings.cancel')}
            </GhostButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
