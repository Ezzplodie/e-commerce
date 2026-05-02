/** Splits multiline CMS/API text into trimmed non-empty lines for display. */
export function splitTextToParagraphs(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  return trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
