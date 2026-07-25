export function interpolateText(
  template: string | undefined,
  values: Record<string, string>,
): string {
  if (!template) {
    return "";
  }

  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    return values[key] ?? match;
  });
}
