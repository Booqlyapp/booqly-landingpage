/**
 * Bio / policyRules may be plain text or Quill Delta JSON
 * (e.g. [{"insert":"Hello\\n"}]). Convert to readable plain text for the booking page.
 */
export function richTextToPlain(value?: string | null): string {
  if (value == null) return '';
  const raw = String(value).trim();
  if (!raw) return '';

  // Already plain text
  if (!raw.startsWith('[') && !raw.startsWith('{')) {
    return raw;
  }

  try {
    const parsed = JSON.parse(raw);
    const ops: unknown[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.ops)
        ? parsed.ops
        : null;

    if (!ops) return raw;

    return ops
      .map((op) => {
        if (op == null || typeof op !== 'object') return '';
        const insert = (op as { insert?: unknown }).insert;
        if (typeof insert === 'string') return insert;
        // Embeds (image/video) — skip for plain text
        return '';
      })
      .join('')
      .replace(/\n+$/g, '')
      .trim();
  } catch {
    return raw;
  }
}
