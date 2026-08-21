import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/sidebar';
import { LanguageProvider } from '@/components/shared/language-provider';

vi.mock('@/app/(app)/settings/actions', () => ({ signOutAction: vi.fn() }));

function renderSidebar(isOperator: boolean) {
  return render(
    <LanguageProvider>
      <Sidebar
        open
        onClose={() => {}}
        history={[]}
        activeHistory={-1}
        onSelectHistory={() => {}}
        onNewQuery={() => {}}
        profileName="Ing. Ramiro Martínez"
        profileEmail="rmartinez@iepsa.mx"
        onOpenSettings={() => {}}
        isOperator={isOperator}
      />
    </LanguageProvider>
  );
}

describe('operator entry', () => {
  it('does not exist for a regular user', () => {
    renderSidebar(false);

    // Not disabled, not hidden: absent from the tree (addendum, "Access").
    expect(screen.queryByRole('link', { name: 'Operación' })).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/dashboard"]')).toBeNull();
  });

  it('leads the operator to the dashboard', () => {
    renderSidebar(true);

    expect(screen.getByRole('link', { name: 'Operación' })).toHaveAttribute('href', '/dashboard');
  });
});
