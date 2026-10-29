'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ProviderTeamMember, Service } from '@/lib/types';

interface StylistSelectionProps {
  service: Service;
  onContinue: (selectedProviderId: string | null) => void;
}

const NO_PREFERENCE = '__no_preference__';

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function memberSubtitle(member: ProviderTeamMember): string {
  const parts: string[] = [];
  if (member.isOwner) parts.push('Owner');
  parts.push(member.jobTitle?.trim() || (member.isOwner ? 'Lead stylist' : 'Stylist'));
  return parts.join(' · ');
}

export default function StylistSelection({
  service,
  onContinue,
}: StylistSelectionProps) {
  const members = useMemo(
    () => service.providerTeamMembers || [],
    [service.providerTeamMembers]
  );

  const [selectedId, setSelectedId] = useState<string>(
    service.selectedProviderId === undefined
      ? NO_PREFERENCE
      : service.selectedProviderId === null
        ? NO_PREFERENCE
        : service.selectedProviderId
  );

  const selectedAddOns = service.selectedAddOns || [];
  const servicePrice = Number(service.price);
  const addOnsTotal = selectedAddOns.reduce(
    (sum, addon) => sum + Number(addon.price),
    0
  );
  const totalPrice = servicePrice + addOnsTotal;
  const deposit = computeDeposit(service, totalPrice);
  const durationLabel = formatDurationLong(service.duration);
  const durationShort = formatDurationShort(service.duration);

  const selectedMember =
    selectedId === NO_PREFERENCE
      ? null
      : members.find((m) => m.id === selectedId) || null;

  const stylistSummaryLabel = selectedMember
    ? `With ${selectedMember.name}`
    : 'With First available stylist';

  return (
    <div className="min-h-screen bg-white pb-80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-2">
          Choose your stylist
        </h2>
        <p className="text-neutral-500 text-[15px] mb-8">
          Pick who you&apos;d like, or choose no preference to see the most times.
        </p>

        <div className="divide-y divide-gray-200 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setSelectedId(NO_PREFERENCE)}
            className="w-full flex items-center gap-3 py-4 text-left"
          >
            <span
              className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedId === NO_PREFERENCE
                  ? 'border-black'
                  : 'border-gray-400'
              }`}
              aria-hidden
            >
              {selectedId === NO_PREFERENCE && (
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
              )}
            </span>

            <span className="shrink-0 w-11 h-11 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>

            <span className="min-w-0">
              <span className="block font-booking-serif text-lg font-bold text-black">
                No preference
              </span>
              <span className="block text-sm text-neutral-500">
                First available stylist
              </span>
            </span>
          </button>

          {members.map((member) => {
            const checked = selectedId === member.id;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedId(member.id)}
                className="w-full flex items-center gap-3 py-4 text-left"
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                    checked ? 'border-black' : 'border-gray-400'
                  }`}
                  aria-hidden
                >
                  {checked && <span className="w-2.5 h-2.5 rounded-full bg-black" />}
                </span>

                <span className="relative shrink-0 w-11 h-11 rounded-full overflow-hidden bg-neutral-100 text-neutral-700 flex items-center justify-center text-xs font-bold">
                  {member.profilePic ? (
                    <Image
                      src={member.profilePic}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    getInitials(member.name)
                  )}
                </span>

                <span className="min-w-0">
                  <span className="block font-booking-serif text-lg font-bold text-black truncate">
                    {member.name}
                  </span>
                  <span className="block text-sm text-neutral-500 truncate">
                    {memberSubtitle(member)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
                    <span className="text-neutral-700 truncate">+ {addon.title}</span>
                    <span className="font-medium text-black shrink-0">
                      {Number(addon.price) > 0
                        ? `$${Number(addon.price).toFixed(2)}`
                        : 'Included'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-neutral-600">
              {stylistSummaryLabel}
            </p>

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
            onClick={() =>
              onContinue(selectedId === NO_PREFERENCE ? null : selectedId)
            }
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-gray-900 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
