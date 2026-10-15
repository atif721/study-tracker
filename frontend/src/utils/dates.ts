export function toLocalISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCurrentWeekRange(): { from: string; to: string } {
  const now = new Date();
  const daySinceMonday = (now.getDay() + 6) % 7;

  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daySinceMonday,
  );

  const sunday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 6,
  );

  return { from: toLocalISODate(monday), to: toLocalISODate(sunday) };
}
