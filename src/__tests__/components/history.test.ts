import { describe, expect, it } from 'vitest';
import { addHistoryTopic, toHistoryTopic } from '@/lib/utils/history';

describe('toHistoryTopic', () => {
  it('leaves a short query untouched', () => {
    expect(toHistoryTopic('Distancia mínima')).toBe('Distancia mínima');
  });

  it('truncates to 38 characters and appends an ellipsis', () => {
    const long = 'a'.repeat(50);
    const topic = toHistoryTopic(long);
    expect(topic).toHaveLength(39);
    expect(topic.endsWith('…')).toBe(true);
  });
});

describe('addHistoryTopic', () => {
  it('prepends a new topic and marks it active', () => {
    const result = addHistoryTopic(['Anterior'], 'Nueva');
    expect(result.history).toEqual(['Nueva', 'Anterior']);
    expect(result.activeIndex).toBe(0);
  });

  it('does not duplicate an existing topic, it selects it', () => {
    const result = addHistoryTopic(['Nueva', 'Anterior'], 'Anterior');
    expect(result.history).toEqual(['Nueva', 'Anterior']);
    expect(result.activeIndex).toBe(1);
  });
});
