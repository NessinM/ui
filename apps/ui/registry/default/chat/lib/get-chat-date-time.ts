export function getChatDateTime(value: Date | string): string | undefined {
  if (typeof value === "string") return value;
  if (Number.isNaN(value.getTime())) return undefined;
  return value.toISOString();
}
