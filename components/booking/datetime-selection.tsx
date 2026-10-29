'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Service, Marketplace } from '@/lib/types';
import { getAvailableTimeSlots, getBookableDates } from '@/lib/api';
import { formatLocalDateYmd } from '@/lib/wall-clock';

interface DateTimeSelectionProps {
  marketplace: Marketplace;
  selectedServices: Service[];
  onSelectDateTime: (date: string, time: string) => void;
  onBack: () => void;
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

function monthBounds(month: Date): { from: string; to: string } {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return {
    from: formatLocalDateYmd(start),
    to: formatLocalDateYmd(end),
  };
}

export default function DateTimeSelection({
  marketplace,
  selectedServices,
  onSelectDateTime,
}: DateTimeSelectionProps) {
  const service = selectedServices[0];
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookableDates, setBookableDates] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchDates = async () => {
      try {
        setLoadingDates(true);
        const { from, to } = monthBounds(currentMonth);
        const dates = await getBookableDates(marketplace.id, from, to);
        if (!cancelled) {
          setBookableDates(new Set(dates));
        }
      } catch (error) {
        console.error('Error fetching bookable dates:', error);
        if (!cancelled) setBookableDates(new Set());
      } finally {
        if (!cancelled) setLoadingDates(false);
      }
    };

    void fetchDates();
    return () => {
      cancelled = true;
    };
  }, [currentMonth, marketplace.id]);

  useEffect(() => {
    if (!selectedDate || !service) return;

    let cancelled = false;
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const dateStr = formatLocalDateYmd(selectedDate);
        const slots = await getAvailableTimeSlots(
          marketplace.id,
          service.id,
          dateStr
        );
        if (!cancelled) {
          setAvailableSlots(Array.isArray(slots) ? slots : []);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        if (!cancelled) setAvailableSlots([]);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    void fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, marketplace.id, service]);

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const result: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      result.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      result.push(new Date(year, month, day));
    }
    return result;
  }, [currentMonth]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableSlots([]);
  };

  const canContinue = Boolean(selectedDate && selectedTime);

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    onSelectDateTime(formatLocalDateYmd(selectedDate), selectedTime);
  };

  const selectedAddOns = service?.selectedAddOns || [];
  const servicePrice = Number(service?.price || 0);
  const addOnsTotal = selectedAddOns.reduce(
    (sum, addon) => sum + Number(addon.price),
    0
  );
  const totalPrice = servicePrice + addOnsTotal;
  const deposit = service ? computeDeposit(service, totalPrice) : null;
  const durationLabel = formatDurationLong(service?.duration);
  const durationShort = formatDurationShort(service?.duration);

  const stylistLabel = (() => {
    if (!service) return null;
    if (service.selectedProviderId) {
      const member = service.providerTeamMembers?.find(
        (m) => m.id === service.selectedProviderId
      );
      return member ? `With ${member.name}` : 'With selected stylist';
    }
    if (service.providerTeamMembers && service.providerTeamMembers.length > 0) {
      return 'With First available stylist';
    }
    return null;
  })();

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const scheduledLabel =
    selectedDate && selectedTime
      ? `${selectedDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
        })} at ${selectedTime}`
      : null;

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const canGoPrevMonth = (() => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return prev >= thisMonth;
  })();

  return (
    <div className="min-h-screen bg-white pb-80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-8">
          Pick a date &amp; time
        </h2>

        {/* Month calendar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() =>
                canGoPrevMonth &&
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                )
              }
              disabled={!canGoPrevMonth}
              className={`p-2 rounded-full ${
                canGoPrevMonth
                  ? 'hover:bg-gray-100 text-black'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-base font-semibold text-black">{monthLabel}</h3>
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                )
              }
              className="p-2 rounded-full hover:bg-gray-100 text-black"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div
                key={`${day}-${i}`}
                className="text-center text-xs font-medium text-neutral-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-10" />;
              }

              const ymd = formatLocalDateYmd(date);
              const isPast = date < today;
              const isBookable = bookableDates.has(ymd) && !isPast;
              const isSelected =
                selectedDate != null &&
                formatLocalDateYmd(selectedDate) === ymd;

              return (
                <button
                  key={ymd}
                  type="button"
                  disabled={!isBookable}
                  onClick={() => isBookable && handleDateSelect(date)}
                  className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm transition-colors ${
                    isSelected
                      ? 'bg-black text-white font-semibold'
                      : isBookable
                        ? 'border border-black text-black font-medium hover:bg-gray-50'
                        : 'text-neutral-300 cursor-not-allowed'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {loadingDates && (
            <p className="text-center text-sm text-neutral-500 mt-4">
              Loading available dates…
            </p>
          )}
        </div>

        {/* Date / time area */}
        {!selectedDate ? (
          <div className="pt-2">
            <p className="text-base font-semibold text-black">Choose a date</p>
          </div>
        ) : (
          <div className="pt-2">
            <p className="text-base font-bold text-black mb-4">
              {selectedDateLabel}
            </p>

            {loadingSlots ? (
              <div className="py-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
                <p className="mt-2 text-sm text-neutral-500">Loading times…</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {availableSlots.map((slot) => {
                  const selected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`min-w-[7.5rem] px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                        selected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 py-2">
                No available times for this date.
              </p>
            )}
          </div>
        )}
      </div>

      {/* YOUR APPOINTMENT summary */}
      {service && (
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

              {stylistLabel && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-neutral-600">
                  {stylistLabel}
                </p>
              )}

              {scheduledLabel && (
                <p className="mt-2 text-sm text-neutral-600">{scheduledLabel}</p>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-black">Total</p>
                  <p className="text-sm text-neutral-500">
                    {durationShort || '—'}
                  </p>
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
              onClick={handleContinue}
              disabled={!canContinue}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase transition-colors ${
                canContinue
                  ? 'bg-black text-white hover:bg-gray-900'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
