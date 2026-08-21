'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/shared/language-provider';
import { GhostButton } from '@/components/ui/ghost-button';
import {
  deleteAccount,
  deleteConversationHistory,
  readQuotaStatus,
  saveDisplayName,
  saveEmail,
  saveLanguage,
  savePassword,
} from '@/app/(app)/settings/actions';
import { DestructiveAction } from './destructive-action';
import { EditableField } from './editable-field';
import { LanguageSetting } from './language-setting';
import { PasswordStep } from './password-step';
import { SavedMark, SettingsSection } from './settings-primitives';
import { UsageBlock } from './usage-block';

/**
 * The account settings modal. One dialog, three blocks in the order the
 * addendum fixes — Account, Usage, Data — and a nested password step that
 * replaces the body instead of stacking a second dialog on top.
 *
 * There is no global save button and no exit confirmation: every field commits
 * on its own, so Escape, the close button and a click on the scrim are all
 * equivalent and none of them can discard work.
 *
 * The server actions are imported here and passed down as plain callbacks. The
 * leaves stay presentational, and nothing below this file knows the data layer
 * exists (spec section 2.1).
 */
export function AccountSettingsModal({
  open,
  onClose,
  profileName,
  profileEmail,
}: {
  open: boolean;
  onClose: () => void;
  profileName: string;
  profileEmail: string;
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'main' | 'password'>('main');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep('main');
    setPasswordSaved(false);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Reading the quota is an effect dependency in UsageBlock, so the identity of
  // the callback has to be stable or the read repeats on every render.
  const readQuota = useCallback(() => readQuotaStatus(), []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('settings.title')}
        className="flex h-full w-full flex-col overflow-y-auto border border-line bg-surface sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-modal"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-md font-medium text-ink">{t('settings.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('settings.close')}
            className="font-mono text-[13px] text-muted2 hover:text-ink"
          >
            ✕
          </button>
        </div>

        {step === 'password' ? (
          <PasswordStep
            onSave={savePassword}
            onDone={() => {
              setPasswordSaved(true);
              setStep('main');
            }}
            onCancel={() => setStep('main')}
          />
        ) : (
          <>
            <SettingsSection titleKey="settings.account">
              <EditableField
                id="settings-name"
                labelKey="settings.name"
                initialValue={profileName}
                onSave={saveDisplayName}
              />
              <EditableField
                id="settings-email"
                labelKey="settings.email"
                type="email"
                initialValue={profileEmail}
                onSave={saveEmail}
              />
              <LanguageSetting onSave={saveLanguage} />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium tracking-[0.01em] text-muted2">
                  {t('settings.password')}
                </span>
                {passwordSaved ? (
                  <SavedMark labelKey="settings.password.saved" />
                ) : (
                  <GhostButton type="button" onClick={() => setStep('password')}>
                    {t('settings.password.action')}
                  </GhostButton>
                )}
              </div>
            </SettingsSection>

            <SettingsSection titleKey="settings.usage">
              <UsageBlock read={readQuota} />
            </SettingsSection>

            <SettingsSection titleKey="settings.data" separated>
              <DestructiveAction
                id="settings-history"
                actionKey="settings.data.history"
                bodyKey="settings.data.historyBody"
                confirmKey="settings.data.historyConfirm"
                doneKey="settings.data.historyDone"
                onConfirm={deleteConversationHistory}
              />
              <DestructiveAction
                id="settings-account"
                actionKey="settings.data.account"
                bodyKey="settings.data.accountBody"
                confirmKey="settings.data.accountConfirm"
                confirmWordKey="settings.data.accountWord"
                onConfirm={deleteAccount}
              />
            </SettingsSection>
          </>
        )}
      </div>
    </div>
  );
}
