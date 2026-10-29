'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Service, ServiceAddOn } from '@/lib/types';

interface AddOnsSelectionProps {
  service: Service;
  onContinue: (selectedAddOns: ServiceAddOn[]) => void;
}

function formatDurationShort(duration: string | number | undefined): string {
  if (duration == null || duration === '') return '';
  const raw = String(duration).trim();
  if (/hr|hour/i.test(raw)) {
    return raw.replace(/hours?/i, (m) => (m.toLowerCase().startsWith('hour') ? 'hrs' : 'hr'));
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

export default function AddOnsSelection({
  service,
  onContinue,
}: AddOnsSelectionProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<ServiceAddOn[]>(
    service.selectedAddOns || []
  );

  const activeAddOns = useMemo(
    () => service.addOns?.filter((addon) => addon.isActive) || [],
    [service.addOns]
  );

  const toggleAddOn = (addon: ServiceAddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const isSelected = (addonId: string) =>
    selectedAddOns.some((a) => a.id === addonId);

  const addOnsTotal = selectedAddOns.reduce(
    (sum, addon) => sum + Number(addon.price),
    0
  );
  const servicePrice = Number(service.price);
  const totalPrice = servicePrice + addOnsTotal;
  const deposit = computeDeposit(service, totalPrice);
  const durationLabel = formatDurationLong(service.duration);
  const durationShort = formatDurationShort(service.duration);

  const formatAddonPrice = (addon: ServiceAddOn) => {
    const price = Number(addon.price);
    if (!price || price <= 0) return 'Included';
    return `+$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-white pb-72">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-2">
          Add to your appointment
        </h2>
        <p className="text-neutral-500 text-[15px] mb-8">
          Optional extras. Skip this step if you don&apos;t need any.
        </p>

        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {activeAddOns.map((addon) => {
            const checked = isSelected(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddOn(addon)}
                className="w-full flex items-start gap-3 py-4 text-left"
              >
                <span
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                    checked
                      ? 'bg-black border-black text-white'
                      : 'border-gray-400 bg-white'
                  }`}
                  aria-hidden
                >
                  {checked && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>

                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-black text-[15px]">
                    {addon.title}
                  </span>
                </span>

                <span className="shrink-0 font-semibold text-black text-[15px]">
                  {formatAddonPrice(addon)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* YOUR APPOINTMENT summary */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase mb-3">
            Your appointment
          </p>

          <div className="rounded-xl border border-gray-200 p-3.5 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={service.imageUrl || '/images/beautybrushes.png'}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-booking-serif text-lg font-bold text-black truncate">
                  {service.name}
                </p>
                <p className="text-sm text-neutral-500">
                  {durationLabel}
                  {durationLabel ? ' · ' : ''}
                  ${servicePrice.toFixed(2)}
                </p>
              </div>
            </div>

            {selectedAddOns.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                {selectedAddOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-neutral-700 truncate">
                      + {addon.title}
                    </span>
                    <span className="font-medium text-black shrink-0">
                      {Number(addon.price) > 0
                        ? `$${Number(addon.price).toFixed(2)}`
                        : 'Included'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-black">Total</p>
                <p className="text-sm text-neutral-500">{durationShort || '—'}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-black">${totalPrice.toFixed(2)}</p>
                {deposit != null && (
                  <p className="text-sm text-neutral-500">
                    ${deposit.toFixed(2)} deposit due today
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onContinue(selectedAddOns)}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-gray-900 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
