'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import SubdomainNavbar from '@/components/subdomain-navbar';

interface BookingSuccessData {
  services: Array<{
    name: string;
    imageUrl: string | null;
    duration: number;
    price: number | string;
    selectedAddOns?: Array<{ title: string; price: number | string }>;
  }>;
  date: string | null;
  time: string | null;
  total: number;
  businessName: string;
  /** Selected provider name, or "No preference", or null if service has no team. */
  professionalName?: string | null;
}

function formatSeeYouLine(dateStr: string | null, timeStr: string | null): string {
  if (!dateStr) {
    return timeStr
      ? `See you at ${timeStr}.`
      : 'Your appointment has been confirmed.';
  }

  const parts = dateStr.split('-').map(Number);
  const date =
    parts.length === 3 && parts.every((n) => !Number.isNaN(n))
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date(dateStr);

  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (!timeStr) return `See you ${datePart}.`;
  return `See you ${datePart} at ${timeStr}.`;
}

export default function SuccessPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [bookingData] = useState<BookingSuccessData | null>(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('bookingSuccessData');
      if (data) {
        localStorage.removeItem('bookingSuccessData');
        return JSON.parse(data);
      }
    }
    return null;
  });

  const seeYouLine = formatSeeYouLine(
    bookingData?.date ?? null,
    bookingData?.time ?? null
  );

  const professionalName = bookingData?.professionalName?.trim() || null;
  const professionalLine =
    professionalName == null
      ? null
      : professionalName === 'No preference'
        ? 'No preference'
        : `With ${professionalName}`;

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      <SubdomainNavbar businessName={bookingData?.businessName || 'Booking'} />

      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-16 sm:pt-20 pb-12 text-center">
        <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-black flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 sm:w-9 sm:h-9 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-booking-serif text-4xl sm:text-5xl font-bold text-black mb-3">
          You&apos;re booked
        </h1>

        <p className="text-[15px] sm:text-base text-neutral-500 max-w-md leading-relaxed">
          {seeYouLine}
        </p>

        {professionalLine && (
          <p className="mt-2 text-[15px] sm:text-base font-medium text-black max-w-md">
            {professionalLine}
          </p>
        )}

        <a
          href={`/book/${subdomain}`}
          className="mt-6 inline-flex items-center justify-center min-w-[220px] px-8 py-3.5 bg-black text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:bg-neutral-900 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
