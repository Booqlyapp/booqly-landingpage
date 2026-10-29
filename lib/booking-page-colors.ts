export interface BookingPageColors {
  pageBackground: string;
  text: string;
  buttons: string;
  /** null / omitted = auto contrast against buttons */
  buttonText: string | null;
}

export const DEFAULT_BOOKING_PAGE_COLORS: BookingPageColors = {
  pageBackground: '#FFFFFF',
  text: '#111111',
  buttons: '#111111',
  buttonText: null,
};

export const PAGE_BACKGROUND_SWATCHES = [
  '#FFFFFF',
  '#F7F5F2',
  '#F3F0EB',
  '#E8E4DE',
  '#D9D4CC',
  '#1A1A1A',
  '#8B5E3C',
];

export const TEXT_SWATCHES = [
  '#111111',
  '#2C2C2C',
  '#4A4A4A',
  '#6B6B6B',
  '#FFFFFF',
  '#8B5E3C',
];

export const BUTTON_SWATCHES = [
  '#111111',
  '#2C2C2C',
  '#4A4A4A',
  '#6B6B6B',
  '#8B5E3C',
  '#FFFFFF',
];

export const PRESET_PICKER_COLORS = [
  '#E53935',
  '#00BCD4',
  '#1E88E5',
  '#76FF03',
  '#D500F9',
  '#FFEB3B',
  '#000000',
  '#FFFFFF',
];

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export function isValidHexColor(value: string | null | undefined): value is string {
  return typeof value === 'string' && HEX_RE.test(value.trim());
}

export function normalizeBookingPageColors(
  input: Partial<BookingPageColors> | null | undefined
): BookingPageColors {
  const pageBackground = isValidHexColor(input?.pageBackground)
    ? input!.pageBackground!.toUpperCase()
    : DEFAULT_BOOKING_PAGE_COLORS.pageBackground;
  const text = isValidHexColor(input?.text)
    ? input!.text!.toUpperCase()
    : DEFAULT_BOOKING_PAGE_COLORS.text;
  const buttons = isValidHexColor(input?.buttons)
    ? input!.buttons!.toUpperCase()
    : DEFAULT_BOOKING_PAGE_COLORS.buttons;
  const buttonText =
    input?.buttonText === null || input?.buttonText === undefined
      ? null
      : isValidHexColor(input.buttonText)
        ? input.buttonText.toUpperCase()
        : null;

  return { pageBackground, text, buttons, buttonText };
}

/** Relative luminance 0–1 for #RRGGBB */
export function hexLuminance(hex: string): number {
  const raw = hex.replace('#', '');
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function autoButtonText(buttonBg: string): string {
  return hexLuminance(buttonBg) > 0.55 ? '#111111' : '#FFFFFF';
}

export function resolveButtonText(colors: BookingPageColors): string {
  if (isValidHexColor(colors.buttonText)) return colors.buttonText;
  return autoButtonText(colors.buttons);
}

export function colorsToCssVars(
  colors: BookingPageColors
): Record<string, string> {
  const resolved = normalizeBookingPageColors(colors);
  return {
    ['--booking-bg']: resolved.pageBackground,
    ['--booking-text']: resolved.text,
    ['--booking-btn']: resolved.buttons,
    ['--booking-btn-text']: resolveButtonText(resolved),
    backgroundColor: resolved.pageBackground,
    color: resolved.text,
  };
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const raw = hex.replace('#', '');
  let r = parseInt(raw.slice(0, 2), 16) / 255;
  let g = parseInt(raw.slice(2, 4), 16) / 255;
  let b = parseInt(raw.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}

export function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Pull a few dominant-ish colors from an image URL (CORS permitting). */
export async function extractSuggestedColors(
  imageUrl: string | null | undefined,
  limit = 6
): Promise<string[]> {
  if (!imageUrl) return [];
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        const buckets = new Map<string, number>();
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 200) continue;
          // quantize
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const hex = `#${[qr, qg, qb]
            .map((n) => Math.min(255, n).toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase()}`;
          buckets.set(hex, (buckets.get(hex) || 0) + 1);
        }
        const sorted = [...buckets.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([hex]) => hex)
          .filter((hex) => hex !== '#000000' && hex !== '#FFFFFF')
          .slice(0, limit);
        resolve(sorted);
      } catch {
        resolve([]);
      }
    };
    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}
