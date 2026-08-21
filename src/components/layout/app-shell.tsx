'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Composer } from '@/components/chat/composer';
import { EmptyState } from '@/components/chat/empty-state';
import { ThreadNotice } from '@/components/chat/thread-notice';
import { AccountSettingsModal } from '@/components/settings/account-settings-modal';
import { FooterStrip } from '@/components/shared/footer-strip';
import { useLanguage } from '@/components/shared/language-provider';
import { addHistoryTopic } from '@/lib/utils/history';

/**
 * Owns the state the sidebar, the topbar and the composer all read: the drawer,
 * the history, the draft and the thread-start notice. It is a client component
 * because that state is shared across three siblings; the leaf components stay
 * presentational.
 *
 * Sending a query currently records the topic and collapses the notice. The
 * message thread itself is not built yet: it depends on the RAG route, which
 * belongs to the developer, and on the response contract in ORCHESTRATOR.
 */
export function AppShell({
  profileName,
  profileEmail,
  isOperator = false,
}: {
  profileName: string;
  profileEmail: string;
  isOperator?: boolean;
}) {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [activeHistory, setActiveHistory] = useState(-1);
  const [threadTitle, setThreadTitle] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleSubmit(query: string) {
    const next = addHistoryTopic(history, query);
    setHistory(next.history);
    setActiveHistory(next.activeIndex);
    setThreadTitle(next.history[next.activeIndex]);
    setDraft('');
    setNoticeOpen(false);
  }

  function handleNewQuery() {
    setActiveHistory(-1);
    setThreadTitle(null);
    setDraft('');
    setNoticeOpen(true);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          history={history}
          activeHistory={activeHistory}
          onSelectHistory={setActiveHistory}
          onNewQuery={handleNewQuery}
          profileName={profileName}
          profileEmail={profileEmail}
          onOpenSettings={() => setSettingsOpen(true)}
          isOperator={isOperator}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <Topbar
            title={threadTitle ?? t('thread.defaultTitle')}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 overflow-y-auto" aria-live="polite">
            <div className="mx-auto max-w-thread px-5 pt-[22px]">
              <ThreadNotice open={noticeOpen} onToggle={() => setNoticeOpen((open) => !open)} />
            </div>

            <div className="mx-auto max-w-thread px-5">
              <EmptyState onPickExample={setDraft} />
            </div>
          </div>

          <Composer draft={draft} onDraftChange={setDraft} onSubmit={handleSubmit} />
        </main>
      </div>

      <FooterStrip />

      <AccountSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profileName={profileName}
        profileEmail={profileEmail}
      />
    </div>
  );
}
