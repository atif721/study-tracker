export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}


