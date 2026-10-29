'use client';

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import {
  BookingPageColors,
  BUTTON_SWATCHES,
  DEFAULT_BOOKING_PAGE_COLORS,
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

  const handleSwatch = (field: ColorField, hex: string | null) => {
    applyColors({ ...colors, [field]: hex });
  };

  const handleUseSuggested = () => {
    if (suggested.length === 0) return;
    applyColors(
      normalizeBookingPageColors({
        pageBackground: suggested[0] || colors.pageBackground,
        text: suggested[1] || colors.text,
        buttons: suggested[2] || colors.buttons,
        buttonText: null,
      })
    );
  };

  const handleSetFromPicker = () => {
    if (!pickerField || !isValidHexColor(draftHex)) return;
    const hex = draftHex.toUpperCase();
    applyColors({ ...colors, [pickerField]: hex });
    setPickerField(null);
  };

  const handleReset = () => {
    applyColors(DEFAULT_BOOKING_PAGE_COLORS);
    setSaveError(null);
  };

  const handleDismiss = () => {
    // Drop unsaved preview and restore last saved colors.
    onColorsChange(normalizeBookingPageColors(initialColors));
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const next = normalizeBookingPageColors(colors);
      await saveBookingPageColors(marketplaceId, next, accessToken);
      onColorsChange(next);
      onClose();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Failed to save colors'
      );
    } finally {
      setSaving(false);
    }
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
        onClick={handleDismiss}
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
              onClick={handleDismiss}
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
                onClick={handleUseSuggested}
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
            onSelect={(hex) => handleSwatch('pageBackground', hex)}
            onPlus={() => openPicker('pageBackground')}
          />

          <ColorRow
            label="Text"
            value={colors.text}
            swatches={TEXT_SWATCHES}
            selected={colors.text}
            onSelect={(hex) => handleSwatch('text', hex)}
            onPlus={() => openPicker('text')}
          />

          <ColorRow
            label="Buttons"
            value={colors.buttons}
            swatches={BUTTON_SWATCHES}
            selected={colors.buttons}
            onSelect={(hex) => handleSwatch('buttons', hex)}
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
                onClick={() => handleSwatch('buttonText', null)}
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
                  onClick={() => handleSwatch('buttonText', hex)}
                />
              ))}
              <PlusSwatch onClick={() => openPicker('buttonText')} />
            </div>
          </div>

          {saveError && (
            <p className="mb-3 text-sm text-red-600">{saveError}</p>
          )}

          <div className="mb-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex-1 rounded-full border border-neutral-300 bg-white py-3.5 text-sm font-bold text-black disabled:opacity-60"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="flex-[1.35] rounded-full bg-[#0B1B3A] py-3.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save colors'}
            </button>
          </div>
        </div>
      </div>

      {pickerField && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/40 px-5">
          <div className="w-full max-w-[300px] rounded-2xl bg-white px-5 pb-2 pt-5 shadow-[0_11px_15px_-7px_rgba(0,0,0,0.2),0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12)]">
            <h3 className="mb-5 font-sans text-[20px] font-normal leading-7 tracking-[0.15px] text-[rgba(0,0,0,0.87)]">
              Select colour
            </h3>

            {pickerMode === 'grid' ? (
              <>
                <div className="mb-5 grid grid-cols-4 gap-3">
                  {PRESET_PICKER_COLORS.map((hex) => {
                    const selected = draftHex.toUpperCase() === hex;
                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => {
                          setDraftHex(hex);
                          setHsv(hexToHsv(hex));
                        }}
                        aria-label={hex}
                        aria-pressed={selected}
                        className={`aspect-square border bg-white p-[4px] ${
                          selected
                            ? 'border-[rgba(0,0,0,0.87)]'
                            : 'border-[rgba(0,0,0,0.54)]'
                        }`}
                      >
                        <span
                          className={`block h-full w-full ${
                            hex === '#FFFFFF'
                              ? 'border border-[rgba(0,0,0,0.12)]'
                              : ''
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPickerMode('custom')}
                    className="font-sans text-[14px] font-medium tracking-[0.1px] text-[#2196F3]"
                  >
                    Customised
                  </button>
                  <ChosenColourPreview hex={draftHex} />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 space-y-4">
                  <MaterialHsvSlider
                    label="Hue"
                    min={0}
                    max={360}
                    value={Math.round(hsv.h)}
                    trackStyle={{
                      backgroundImage:
                        'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                    }}
                    onChange={(h) => {
                      const next = { ...hsv, h };
                      setHsv(next);
                      setDraftHex(hsvToHex(next.h, next.s, next.v));
                    }}
                  />
                  <MaterialHsvSlider
                    label="Saturation"
                    min={0}
                    max={100}
                    value={Math.round(hsv.s * 100)}
                    trackStyle={{
                      backgroundImage: `linear-gradient(to right, #fff, ${hsvToHex(hsv.h, 1, 1)})`,
                    }}
                    onChange={(s) => {
                      const next = { ...hsv, s: s / 100 };
                      setHsv(next);
                      setDraftHex(hsvToHex(next.h, next.s, next.v));
                    }}
                  />
                  <MaterialHsvSlider
                    label="Value"
                    min={0}
                    max={100}
                    value={Math.round(hsv.v * 100)}
                    trackStyle={{
                      backgroundImage:
                        'linear-gradient(to right, #000, #fff)',
                    }}
                    onChange={(v) => {
                      const next = { ...hsv, v: v / 100 };
                      setHsv(next);
                      setDraftHex(hsvToHex(next.h, next.s, next.v));
                    }}
                  />
                </div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPickerMode('grid')}
                    className="font-sans text-[14px] font-medium tracking-[0.1px] text-[#2196F3]"
                  >
                    Suggestions
                  </button>
                  <ChosenColourPreview hex={draftHex} />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pb-1">
              <button
                type="button"
                onClick={() => setPickerField(null)}
                className="min-w-[64px] px-2 py-2.5 font-sans text-[14px] font-medium tracking-[0.1px] text-[#2196F3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetFromPicker}
                className="min-w-[64px] px-2 py-2.5 font-sans text-[14px] font-medium tracking-[0.1px] text-[#2196F3]"
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

function ChosenColourPreview({ hex }: { hex: string }) {
  return (
    <div className="flex items-center gap-2.5 font-sans text-[14px] text-[rgba(0,0,0,0.87)]">
      Chosen colour
      <span
        className={`inline-block h-8 w-8 shrink-0 border border-[rgba(0,0,0,0.54)] ${
          hex.toUpperCase() === '#FFFFFF' ? 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]' : ''
        }`}
        style={{ backgroundColor: hex }}
        aria-hidden
      />
    </div>
  );
}

/**
 * Flutter / Material HSV slider: solid gradient track + blue house marker under it.
 * Matches the classic "Select colour → Customised" dialog.
 */
function MaterialHsvSlider({
  label,
  min,
  max,
  value,
  trackStyle,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  trackStyle: CSSProperties;
  onChange: (value: number) => void;
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="select-none">
      <p className="mb-1.5 font-sans text-[12px] font-normal leading-4 text-[rgba(0,0,0,0.6)]">
        {label}
      </p>
      <div className="relative h-[42px]">
        {/* Track */}
        <div
          className="absolute left-0 right-0 top-0 h-[20px] w-full"
          style={trackStyle}
        />
        {/* House marker under the track (points up at value) */}
        <div
          className="pointer-events-none absolute top-[20px] z-[1] -translate-x-1/2"
          style={{ left: `${pct}%` }}
          aria-hidden
        >
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0L16 7.5V20H0V7.5L8 0Z"
              fill="#2196F3"
            />
          </svg>
        </div>
        {/* Invisible hit target */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0"
        />
      </div>
    </div>
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
  // Cap so swatches + "+" always fit one row on small phones.
  const unique = [...new Set(swatches.map((s) => s.toUpperCase()))].slice(
    0,
    7
  );
  const columns = unique.length + 1;
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-black">{label}</p>
        <p className="text-xs text-neutral-500">{value}</p>
      </div>
      <div
        className="grid w-full items-center gap-1.5 sm:gap-2.5"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
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
      className={`mx-auto aspect-square w-full max-w-10 rounded-full border ${
        selected ? 'ring-2 ring-black ring-offset-1 sm:ring-offset-2' : ''
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
      className="mx-auto flex aspect-square w-full max-w-10 items-center justify-center rounded-full border border-dashed border-neutral-400 text-lg font-light text-neutral-600"
    >
      +
    </button>
  );
}
