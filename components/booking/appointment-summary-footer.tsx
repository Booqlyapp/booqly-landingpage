'use client';

import Image from 'next/image';
import { Service, ServiceAddOn } from '@/lib/types';

interface AppointmentSummaryFooterProps {
  service: Service;
  selectedAddOns?: ServiceAddOn[];
  stylistLabel?: string | null;
  scheduledLabel?: string | null;
  continueLabel?: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  footerNote?: string | null;
}

function formatDurationShort(duration: string | number | undefined): string {
  if (duration == null || duration === '') return '';
  const raw = String(duration).trim();
  if (/hr|hour/i.test(raw)) {
    return raw.replace(/hours?/i, (m) =>
      m.toLowerCase().startsWith('hour') ? 'hrs' : 'hr'
    );
  }
  if (/min/i.test(raw)) return raw;
  const n = Number(raw);
  if (!Number.isNaN(n)) {
    if (n >= 60 && n % 60 === 0) {
      const hours = n / 60;
      return hours === 1 ? '1 hr' : `${hours} hrs`;
    }
    return `${n} min`;
  }
  return raw;
}

function formatDurationLong(duration: string | number | undefined): string {
  if (duration == null || duration === '') return '';
  const raw = String(duration).trim();
  if (/min|hr|hour/i.test(raw)) return raw;
  const n = Number(raw);
  if (!Number.isNaN(n)) {
    if (n >= 60 && n % 60 === 0) {
      const hours = n / 60;
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    return `${n} min`;
  }
  return raw;
}

function computeDeposit(service: Service, total: number): number | null {
  if (!service.requireDeposit || service.depositAmount == null) return null;
  const amount = Number(service.depositAmount);
  if (Number.isNaN(amount) || amount <= 0) return null;
  if (service.depositType === 'percentage') {
    return (total * amount) / 100;
  }
  return amount;
}

export default function AppointmentSummaryFooter({
  service,
  selectedAddOns = [],
  stylistLabel,
  scheduledLabel,
  continueLabel = 'Continue',
  continueDisabled = false,
  onContinue,
  footerNote,
}: AppointmentSummaryFooterProps) {
  const servicePrice = Number(service.price);
  const addOnsTotal = selectedAddOns.reduce(
    (sum, addon) => sum + Number(addon.price),
    0
  );
  const totalPrice = servicePrice + addOnsTotal;
  const deposit = computeDeposit(service, totalPrice);
  const durationLabel = formatDurationLong(service.duration);
  const durationShort = formatDurationShort(service.duration);

  return (
    <div className="w-full border border-gray-200 rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        Your appointment
      </p>

      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
          <Image
            src={service.imageUrl || '/images/beautybrushes.png'}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-booking-serif text-[17px] font-bold leading-tight text-black">
            {service.name}
          </p>
          <p className="mt-0.5 text-sm text-neutral-500">
            {durationLabel}
            {durationLabel ? ' · ' : ''}
            ${servicePrice.toFixed(2)}
          </p>
        </div>
      </div>

      {selectedAddOns.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
          {selectedAddOns.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="truncate text-neutral-700">+ {addon.title}</span>
              <span className="shrink-0 font-medium text-black">
                {Number(addon.price) > 0
                  ? `$${Number(addon.price).toFixed(2)}`
                  : 'Included'}
              </span>
            </div>
          ))}
        </div>
      )}

      {stylistLabel && (
        <p className="mt-3 border-t border-gray-200 pt-3 text-sm text-neutral-600">
          {stylistLabel}
        </p>
      )}

      {scheduledLabel && (
        <p className="mt-2 text-sm text-neutral-600">{scheduledLabel}</p>
      )}

      <div className="mt-3 flex items-start justify-between gap-3 border-t border-gray-200 pt-3">
        <div>
          <p className="text-[15px] font-bold text-black">Total</p>
          <p className="text-sm text-neutral-500">{durationShort || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-[15px] font-bold text-black">
            ${totalPrice.toFixed(2)}
          </p>
          {deposit != null && (
            <p className="text-sm text-neutral-500">
              ${deposit.toFixed(2)} deposit due today
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className={`mt-4 w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wide transition-colors ${
          continueDisabled
            ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
            : 'booking-primary-btn'
        }`}
      >
        {continueLabel}
      </button>

      {footerNote ? (
        <p className="mt-2 text-center text-xs text-neutral-500">{footerNote}</p>
      ) : null}
    </div>
  );
}
