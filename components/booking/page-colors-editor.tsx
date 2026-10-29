'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BookingPageColors,
  BUTTON_SWATCHES,
  PAGE_BACKGROUND_SWATCHES,
  PRESET_PICKER_COLORS,
  TEXT_SWATCHES,
  autoButtonText,
  extractSuggestedColors,
  hexToHsv,
  hsvToHex,
  isValidHexColor,
  normalizeBookingPageColors,
  resolveButtonText,
} from '@/lib/booking-page-colors';
import { saveBookingPageColors } from '@/lib/api';

type ColorField = 'pageBackground' | 'text' | 'buttons' | 'buttonText';

interface PageColorsEditorProps {
  marketplaceId: string;
  accessToken: string;
  headerImageUrl?: string | null;
  initialColors?: Partial<BookingPageColors> | null;
  open: boolean;
  onClose: () => void;
  onColorsChange: (colors: BookingPageColors) => void;
}

export default function PageColorsEditor({
  marketplaceId,
  accessToken,
  headerImageUrl,
  initialColors,
  open,
  onClose,
  onColorsChange,
}: PageColorsEditorProps) {
  const [colors, setColors] = useState<BookingPageColors>(() =>
    normalizeBookingPageColors(initialColors)
  );
  const [suggested, setSuggested] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pickerField, setPickerField] = useState<ColorField | null>(null);
  const [pickerMode, setPickerMode] = useState<'grid' | 'custom'>('grid');
  const [draftHex, setDraftHex] = useState('#111111');
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });

  useEffect(() => {
    if (!open) return;
    setColors(normalizeBookingPageColors(initialColors));
    setSaveError(null);
  }, [open, initialColors]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void extractSuggestedColors(headerImageUrl).then((list) => {
      if (!cancelled) setSuggested(list);
    });
    return () => {
      cancelled = true;
    };
  }, [open, headerImageUrl]);

  const applyColors = (next: BookingPageColors) => {
    const normalized = normalizeBookingPageColors(next);
    setColors(normalized);
    onColorsChange(normalized);
  };

  const setField = (field: ColorField, value: string | null) => {
    applyColors({ ...colors, [field]: value });
  };

  const openPicker = (field: ColorField) => {
    const current =
      field === 'buttonText'
        ? colors.buttonText || resolveButtonText(colors)
        : colors[field];
    const hex = isValidHexColor(current) ? current : '#111111';
    setDraftHex(hex);
    setHsv(hexToHsv(hex));
    setPickerMode('grid');
    setPickerField(field);
  };

  const persist = async (next: BookingPageColors) => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveBookingPageColors(marketplaceId, next, accessToken);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Failed to save colors'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSwatch = async (field: ColorField, hex: string | null) => {
    const next = { ...colors, [field]: hex };
    applyColors(next);
    await persist(normalizeBookingPageColors(next));
  };

  const handleUseSuggested = async () => {
    if (suggested.length === 0) return;
    const next = normalizeBookingPageColors({
      pageBackground: suggested[0] || colors.pageBackground,
      text: suggested[1] || colors.text,
      buttons: suggested[2] || colors.buttons,
      buttonText: null,
    });
    applyColors(next);
    await persist(next);
  };

  const handleSetFromPicker = async () => {
    if (!pickerField || !isValidHexColor(draftHex)) return;
    const hex = draftHex.toUpperCase();
    const next = { ...colors, [pickerField]: hex };
    applyColors(next);
    setPickerField(null);
    await persist(normalizeBookingPageColors(next));
  };

  const buttonTextLabel = useMemo(() => {
    if (colors.buttonText === null) {
      return `Auto · ${autoButtonText(colors.buttons)}`;
    }
    return colors.buttonText;
  }, [colors]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[10000] bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="Page colors"
        className="fixed inset-x-0 bottom-0 z-[10001] max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl"
      >
        <div className="mx-auto w-full max-w-3xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-black">Page colors</h2>
              <p className="mt-0.5 text-sm text-neutral-500">
                Changes show on the page as you pick
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {suggested.length > 0 && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-neutral-100 px-3 py-2.5">
              <p className="text-sm text-neutral-700">
                Colors below were detected in your header image
              </p>
              <button
                type="button"
                onClick={() => void handleUseSuggested()}
                className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black shadow-sm border border-neutral-200"
              >
                Use suggested
              </button>
            </div>
          )}

          <ColorRow
            label="Page background"
            value={colors.pageBackground}
            swatches={
              suggested.length
                ? [...suggested.slice(0, 4), ...PAGE_BACKGROUND_SWATCHES]
                : PAGE_BACKGROUND_SWATCHES
            }
            selected={colors.pageBackground}
            onSelect={(hex) => void handleSwatch('pageBackground', hex)}
            onPlus={() => openPicker('pageBackground')}
          />

          <ColorRow
            label="Text"
            value={colors.text}
            swatches={TEXT_SWATCHES}
            selected={colors.text}
            onSelect={(hex) => void handleSwatch('text', hex)}
            onPlus={() => openPicker('text')}
          />

          <ColorRow
            label="Buttons"
            value={colors.buttons}
            swatches={BUTTON_SWATCHES}
            selected={colors.buttons}
            onSelect={(hex) => void handleSwatch('buttons', hex)}
            onPlus={() => openPicker('buttons')}
          />

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-black">Button text</p>
              <p className="text-xs text-neutral-500">{buttonTextLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => void handleSwatch('buttonText', null)}
                className={`h-10 min-w-10 rounded-full px-3 text-xs font-bold border ${
                  colors.buttonText === null
                    ? 'ring-2 ring-black border-transparent bg-[#0B1B3A] text-white'
                    : 'border-neutral-300 bg-[#0B1B3A] text-white'
                }`}
              >
                Auto
              </button>
              {['#FFFFFF', '#111111'].map((hex) => (
                <Swatch
                  key={hex}
                  hex={hex}
                  selected={colors.buttonText === hex}
                  onClick={() => void handleSwatch('buttonText', hex)}
                />
              ))}
              <PlusSwatch onClick={() => openPicker('buttonText')} />
            </div>
          </div>

          {saveError && (
            <p className="mb-3 text-sm text-red-600">{saveError}</p>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="mb-2 w-full rounded-xl bg-black py-3.5 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Done'}
          </button>
        </div>
      </div>

      {pickerField && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-black">Select colour</h3>

            {pickerMode === 'grid' ? (
              <>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {PRESET_PICKER_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => {
                        setDraftHex(hex);
                        setHsv(hexToHsv(hex));
                      }}
                      className={`aspect-square rounded-lg border ${
                        draftHex.toUpperCase() === hex
                          ? 'ring-2 ring-black'
                          : 'border-neutral-200'
                      }`}
                      style={{ backgroundColor: hex }}
                      aria-label={hex}
                    />
                  ))}
                </div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPickerMode('custom')}
                    className="text-sm font-semibold text-blue-600"
                  >
                    Customised
                  </button>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    Chosen colour
                    <span
                      className="h-8 w-8 rounded-md border border-neutral-300"
                      style={{ backgroundColor: draftHex }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 space-y-3">
                  <label className="block text-xs font-medium text-neutral-600">
                    Hue
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={hsv.h}
                      onChange={(e) => {
                        const next = { ...hsv, h: Number(e.target.value) };
                        setHsv(next);
                        setDraftHex(hsvToHex(next.h, next.s, next.v));
                      }}
                      className="mt-1 w-full accent-blue-600"
                      style={{
                        background:
                          'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
                      }}
                    />
                  </label>
                  <label className="block text-xs font-medium text-neutral-600">
                    Saturation
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(hsv.s * 100)}
                      onChange={(e) => {
                        const next = { ...hsv, s: Number(e.target.value) / 100 };
                        setHsv(next);
                        setDraftHex(hsvToHex(next.h, next.s, next.v));
                      }}
                      className="mt-1 w-full accent-blue-600"
                    />
                  </label>
                  <label className="block text-xs font-medium text-neutral-600">
                    Value
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(hsv.v * 100)}
                      onChange={(e) => {
                        const next = { ...hsv, v: Number(e.target.value) / 100 };
                        setHsv(next);
                        setDraftHex(hsvToHex(next.h, next.s, next.v));
                      }}
                      className="mt-1 w-full accent-blue-600"
                    />
                  </label>
                </div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPickerMode('grid')}
                    className="text-sm font-semibold text-blue-600"
                  >
                    Suggestions
                  </button>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    Chosen colour
                    <span
                      className="h-8 w-8 rounded-md border border-neutral-300"
                      style={{ backgroundColor: draftHex }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setPickerField(null)}
                className="text-sm font-semibold text-blue-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSetFromPicker()}
                className="text-sm font-semibold text-blue-600"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ColorRow({
  label,
  value,
  swatches,
  selected,
  onSelect,
  onPlus,
}: {
  label: string;
  value: string;
  swatches: string[];
  selected: string;
  onSelect: (hex: string) => void;
  onPlus: () => void;
}) {
  const unique = [...new Set(swatches.map((s) => s.toUpperCase()))];
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-black">{label}</p>
        <p className="text-xs text-neutral-500">{value}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {unique.map((hex) => (
          <Swatch
            key={hex}
            hex={hex}
            selected={selected.toUpperCase() === hex}
            onClick={() => onSelect(hex)}
          />
        ))}
        <PlusSwatch onClick={onPlus} />
      </div>
    </div>
  );
}

function Swatch({
  hex,
  selected,
  onClick,
}: {
  hex: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={hex}
      className={`h-10 w-10 rounded-full border ${
        selected ? 'ring-2 ring-black ring-offset-2' : ''
      } ${hex === '#FFFFFF' ? 'border-neutral-300' : 'border-transparent'}`}
      style={{ backgroundColor: hex }}
    />
  );
}

function PlusSwatch({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Custom colour"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-neutral-400 text-lg font-light text-neutral-600"
    >
      +
    </button>
  );
}
