'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useLanguage } from '@/lib/i18n/useLanguage';

/**
 * Reference page. `useQuery` subscribes: after `create` commits, this list
 * updates on its own, with no invalidation step.
 */
export default function ItemsPage() {
  const { t } = useLanguage();
  const items = useQuery(api.items.list);
  const createItem = useMutation(api.items.create);
  const [name, setName] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    await createItem({ name });
    setName('');
  }

  return (
    <main>
      <h1>Items</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        <button type="submit">{t('common.save')}</button>
      </form>

      {items === undefined ? (
        <p role="status">{t('common.loading')}</p>
      ) : items.length === 0 ? (
        <p>{t('common.empty')}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
