'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ProviderTeamMember, Service } from '@/lib/types';
import AppointmentSummaryFooter from './appointment-summary-footer';

interface StylistSelectionProps {
  service: Service;
  onContinue: (selectedProviderId: string | null) => void;
}

const NO_PREFERENCE = '__no_preference__';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function memberSubtitle(member: ProviderTeamMember): string {
  const parts: string[] = [];
  if (member.isOwner) parts.push('Owner');
  parts.push(
    member.jobTitle?.trim() || (member.isOwner ? 'Lead stylist' : 'Stylist')
  );
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
    service.selectedProviderId === undefined ||
      service.selectedProviderId === null
      ? NO_PREFERENCE
      : service.selectedProviderId
  );

  const selectedMember =
    selectedId === NO_PREFERENCE
      ? null
      : members.find((m) => m.id === selectedId) || null;

  const stylistSummaryLabel = selectedMember
    ? `With ${selectedMember.name}`
    : 'With First available stylist';

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-2">
          Choose your stylist
        </h2>
        <p className="text-neutral-500 text-[15px] mb-8">
          Pick who you&apos;d like, or choose no preference to see the most
          times.
        </p>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          <button
            type="button"
            onClick={() => setSelectedId(NO_PREFERENCE)}
            className="w-full flex items-center gap-3 py-4 text-left"
          >
            <span
              className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedId === NO_PREFERENCE ? 'border-black' : 'border-gray-400'
              }`}
              aria-hidden
            >
              {selectedId === NO_PREFERENCE && (
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
              )}
            </span>

            <span className="shrink-0 w-11 h-11 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                  {checked && (
                    <span className="w-2.5 h-2.5 rounded-full bg-black" />
                  )}
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

        <div className="mt-8">
          <AppointmentSummaryFooter
            service={service}
            selectedAddOns={service.selectedAddOns || []}
            stylistLabel={stylistSummaryLabel}
            onContinue={() =>
              onContinue(selectedId === NO_PREFERENCE ? null : selectedId)
            }
          />
        </div>
      </div>
    </div>
  );
}
