/** The sidebar shows one line per query, so a long topic is cut (design 8). */
const MAX_TOPIC_LENGTH = 38;

export function toHistoryTopic(query: string): string {
  const trimmed = query.trim();
  if (trimmed.length <= MAX_TOPIC_LENGTH) return trimmed;
  return `${trimmed.slice(0, MAX_TOPIC_LENGTH)}…`;
}

/**
 * Puts the topic at the top of the history and returns its index. An existing
 * topic is selected in place rather than duplicated.
 */
export function addHistoryTopic(
  history: string[],
  query: string
): { history: string[]; activeIndex: number } {
  const topic = toHistoryTopic(query);
  const existing = history.indexOf(topic);
  if (existing !== -1) return { history, activeIndex: existing };
  return { history: [topic, ...history], activeIndex: 0 };
}
