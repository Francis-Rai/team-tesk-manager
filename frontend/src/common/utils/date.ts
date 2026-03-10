export function formatDateTimeShort(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
