'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Service } from '@/lib/types';

interface ServiceContinueBarProps {
  service: Service;
  onContinue: () => void;
}

function formatDurationShort(duration: string | number | undefined): string {
  if (duration == null || duration === '') return '';
  const raw = String(duration).trim();
  if (/hr|hour/i.test(raw)) {
    return raw.replace(/hours?/i, (m) =>
      m.toLowerCase().startsWith('hour') ? 'hr' : 'hr'
    );
  }
  if (/min/i.test(raw)) return raw;
  const n = Number(raw);
  if (!Number.isNaN(n)) {
    if (n >= 60 && n % 60 === 0) {
      const hours = n / 60;
      return hours === 1 ? '1hr' : `${hours}hr`;
    }
    return `${n}min`;
  }
  return raw;
}

export default function ServiceContinueBar({
  service,
  onContinue,
}: ServiceContinueBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const price = Number(service.price);
  const duration = formatDurationShort(service.duration);
  const meta = [service.name, duration].filter(Boolean).join(' · ');

  const bar = (
    <div
      className="booking-service-continue-bar"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        width: '100%',
        backgroundColor: 'var(--booking-bg, #ffffff)',
        borderTop:
          '1px solid color-mix(in srgb, var(--booking-text, #111) 12%, transparent)',
        color: 'var(--booking-text, #111111)',
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="min-w-0">
          <p className="text-xl font-bold leading-tight">
            ${Number.isNaN(price) ? '0.00' : price.toFixed(2)}
          </p>
          <p className="truncate text-sm opacity-70">{meta}</p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="booking-primary-btn shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
        >
          Continue
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(bar, document.body);
}
