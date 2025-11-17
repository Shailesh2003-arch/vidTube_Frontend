export function groupByDay(history) {
  // history: [{ video, watchedAt, ... }, ...]
  // returns array like [{ dayLabel: 'Today', dateKey: '2025-11-16', items: [...] }, ...]
  const map = new Map();

  history.forEach((item) => {
    const d = new Date(item.watchedAt);
    // dateKey in YYYY-MM-DD to keep consistent ordering
    const dateKey = d.toISOString().slice(0, 10);
    const label = formatDayLabel(d);
    if (!map.has(dateKey))
      map.set(dateKey, { dayLabel: label, dateKey, items: [] });
    map.get(dateKey).items.push(item);
  });

  // sort by date desc
  const arr = Array.from(map.values()).sort((a, b) =>
    b.dateKey > a.dateKey ? 1 : -1
  );

  return arr;
}

function formatDayLabel(date) {
  const today = new Date();
  const diff = Math.floor(
    (new Date(date.toDateString()) - new Date(today.toDateString())) /
      (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  // else nice long label
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
