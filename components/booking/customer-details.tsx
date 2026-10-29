'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Marketplace,
  BookingData,
  Service,
  ServiceAddOn,
} from '@/lib/types';
import {
  createExternalAppointment,
  createExternalAppointmentWithDeposit,
} from '@/lib/api';
import { formatWallClockDateTime, parseLocalYmd } from '@/lib/wall-clock';
import { richTextToPlain } from '@/lib/rich-text';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface CustomerDetailsProps {
  marketplace: Marketplace;
  selectedServices: Service[];
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
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

function computeServiceDeposit(service: Service, serviceTotal: number): number {
  if (!service.requireDeposit || service.depositAmount == null) return 0;
  const amount = Number(service.depositAmount);
  if (Number.isNaN(amount) || amount <= 0) return 0;
  if (service.depositType === 'percentage') {
    return (serviceTotal * amount) / 100;
  }
  return amount;
}

function ensurePhonePrefix(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '+1';
  if (trimmed.startsWith('+')) return trimmed;
  if (trimmed.startsWith('1') && trimmed.length > 10) return `+${trimmed}`;
  return `+1${trimmed.replace(/^\+?1/, '')}`;
}

const inputClass =
  'w-full px-3.5 py-3 border border-gray-300 rounded-lg text-[15px] text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent';

const stripeStyle = {
  base: {
    fontSize: '16px',
    color: '#171717',
    '::placeholder': { color: '#a3a3a3' },
  },
  invalid: { color: '#dc2626' },
};

export default function CustomerDetails({
  marketplace,
  selectedServices,
  bookingData,
  setBookingData,
  onBack: _onBack,
}: CustomerDetailsProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);

  const service = selectedServices[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!bookingData.phone) {
      setBookingData({ ...bookingData, phone: '+1' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const totalPrice = selectedServices.reduce((total, s) => {
      const servicePrice =
        typeof s.price === 'string' ? parseFloat(s.price) : Number(s.price);
      const addOnsTotal = (s.selectedAddOns || []).reduce(
        (sum: number, addon: ServiceAddOn) => {
          const addonPrice =
            typeof addon.price === 'string'
              ? parseFloat(addon.price)
              : Number(addon.price);
          return sum + addonPrice;
        },
        0
      );
      return total + servicePrice + addOnsTotal;
    }, 0);

    const depositAmount = selectedServices.reduce((sum, s) => {
      const servicePrice =
        typeof s.price === 'string' ? parseFloat(s.price) : Number(s.price);
      const addOnsTotal = (s.selectedAddOns || []).reduce(
        (a: number, addon: ServiceAddOn) => a + Number(addon.price),
        0
      );
      return sum + computeServiceDeposit(s, servicePrice + addOnsTotal);
    }, 0);

    const requiresDeposit = depositAmount > 0;
    return { totalPrice, depositAmount, requiresDeposit };
  }, [selectedServices]);

  const { totalPrice, depositAmount, requiresDeposit } = totals;

  const formValid =
    Boolean(bookingData.firstName.trim()) &&
    Boolean(bookingData.lastName.trim()) &&
    Boolean(bookingData.email.trim()) &&
    bookingData.phone.replace(/\D/g, '').length >= 11 &&
    bookingData.acceptedTerms;

  const canSubmit =
    formValid && (!requiresDeposit || (Boolean(stripe) && cardComplete)) && !loading;

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

  const scheduledLabel =
    bookingData.date && bookingData.time
      ? `${parseLocalYmd(bookingData.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
        })} at ${bookingData.time}`
      : null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit || !service || !bookingData.date || !bookingData.time) {
      if (!bookingData.acceptedTerms) {
        setError('Please agree to the Policies & Rules to continue.');
      } else if (!formValid) {
        setError('Please fill in all required fields.');
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const match = bookingData.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) {
        setError('Invalid time selection.');
        return;
      }
      let hour = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;

      const dateTime = parseLocalYmd(bookingData.date);
      dateTime.setHours(hour, minutes, 0, 0);

      const servicesPayload = selectedServices.map((s) => ({
        serviceId: s.id,
        addOnIds: (s.selectedAddOns || []).map((addon) => addon.id),
      }));

      const phone = ensurePhonePrefix(bookingData.phone);

      const appointmentData = {
        marketplaceId: marketplace.id,
        services: servicesPayload,
        firstName: bookingData.firstName.trim(),
        lastName: bookingData.lastName.trim(),
        email: bookingData.email.trim(),
        phone,
        dateTime: formatWallClockDateTime(dateTime),
        price: totalPrice,
        depositAmount: requiresDeposit ? depositAmount : undefined,
        remainingBalance: requiresDeposit
          ? totalPrice - depositAmount
          : undefined,
        acceptedTerms: bookingData.acceptedTerms,
        marketingConsent: bookingData.marketingConsent,
        notes: bookingData.notes?.trim() || undefined,
      };

      if (requiresDeposit) {
        if (!stripe || !elements) {
          setError('Payment system not loaded. Please refresh the page.');
          return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
          setError('Card information not found.');
          return;
        }

        const { error: pmError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
            billing_details: {
              name: `${appointmentData.firstName} ${appointmentData.lastName}`,
              email: appointmentData.email,
              phone: appointmentData.phone,
            },
          });

        if (pmError || !paymentMethod) {
          setError(
            pmError?.message || 'Payment failed. Please check your card details.'
          );
          return;
        }

        await createExternalAppointmentWithDeposit({
          ...appointmentData,
          paymentMethodId: paymentMethod.id,
        });
      } else {
        await createExternalAppointment(appointmentData);
      }

      const successData = {
        services: selectedServices.map((s) => ({
          name: s.name,
          imageUrl: s.imageUrl,
          duration: s.duration,
          price: s.price,
          selectedAddOns: s.selectedAddOns || [],
        })),
        date: bookingData.date,
        time: bookingData.time,
        total: totalPrice,
        depositAmount: requiresDeposit ? depositAmount : 0,
        businessName: marketplace.businessName,
      };
      localStorage.setItem('bookingSuccessData', JSON.stringify(successData));
      router.push(`/book/${marketplace.customLink}/success`);
    } catch (err) {
      setError(
        (err as Error).message || 'Failed to create booking. Please try again.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedAddOns = service?.selectedAddOns || [];
  const servicePrice = Number(service?.price || 0);
  const durationLabel = formatDurationLong(service?.duration);
  const durationShort = formatDurationShort(service?.duration);

  return (
    <div className="min-h-screen bg-white pb-80">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6"
      >
        <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-2">
          Your information
        </h2>
        <p className="text-neutral-500 text-[15px] mb-8">
          We&apos;ll send your confirmation here.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              First name
            </label>
            <input
              type="text"
              value={bookingData.firstName}
              onChange={(e) =>
                setBookingData({ ...bookingData, firstName: e.target.value })
              }
              required
              autoComplete="given-name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Last name
            </label>
            <input
              type="text"
              value={bookingData.lastName}
              onChange={(e) =>
                setBookingData({ ...bookingData, lastName: e.target.value })
              }
              required
              autoComplete="family-name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={bookingData.phone}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('+1')) {
                  const digits = value.replace(/\D/g, '');
                  value = `+1${digits.replace(/^1/, '')}`;
                }
                setBookingData({ ...bookingData, phone: value });
              }}
              required
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={bookingData.email}
              onChange={(e) =>
                setBookingData({ ...bookingData, email: e.target.value })
              }
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Notes for your stylist{' '}
              <span className="font-normal text-neutral-400">(Optional)</span>
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) =>
                setBookingData({ ...bookingData, notes: e.target.value })
              }
              rows={4}
              className={`${inputClass} resize-y min-h-[6rem]`}
            />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-8">
          <input
            type="checkbox"
            checked={bookingData.acceptedTerms}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                acceptedTerms: e.target.checked,
              })
            }
            required
            className="mt-1 w-4 h-4 rounded border-gray-400 text-black focus:ring-black"
          />
          <span className="text-sm text-neutral-800 leading-relaxed">
            I&apos;ve read and agree to the{' '}
            <button
              type="button"
              onClick={() => setShowPolicies(true)}
              className="font-semibold underline underline-offset-2"
            >
              Policies &amp; Rules
            </button>
            , including the late and cancellation policy.
          </span>
        </label>

        {requiresDeposit && (
          <div className="mb-8">
            <h3 className="text-base font-semibold text-black mb-3">
              Card details
            </h3>
            <div className="space-y-3">
              <div className="px-3.5 py-3 border border-gray-300 rounded-lg">
                <CardNumberElement
                  options={{ placeholder: 'Card number', style: stripeStyle }}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="px-3.5 py-3 border border-gray-300 rounded-lg">
                  <CardExpiryElement
                    options={{ placeholder: 'MM / YY', style: stripeStyle }}
                  />
                </div>
                <div className="px-3.5 py-3 border border-gray-300 rounded-lg">
                  <CardCvcElement
                    options={{ placeholder: 'CVC', style: stripeStyle }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>

      {/* YOUR APPOINTMENT + pay */}
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
                  <p className="font-bold text-black">
                    ${totalPrice.toFixed(2)}
                  </p>
                  {requiresDeposit && (
                    <p className="text-sm text-neutral-500">
                      ${depositAmount.toFixed(2)} deposit due today
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!canSubmit}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase transition-colors ${
                canSubmit
                  ? 'bg-black text-white hover:bg-gray-900'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {loading
                ? 'Processing…'
                : requiresDeposit
                  ? `Pay $${depositAmount.toFixed(2)} Deposit`
                  : 'Confirm booking'}
            </button>

            {requiresDeposit && (
              <p className="mt-2 text-center text-xs text-neutral-500">
                The deposit is non-refundable and will be applied toward your
                service.
              </p>
            )}
          </div>
        </div>
      )}

      {showPolicies && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-booking-serif text-2xl font-bold text-black">
                Policies &amp; Rules
              </h3>
              <button
                type="button"
                onClick={() => setShowPolicies(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[15px] text-neutral-700 whitespace-pre-wrap leading-relaxed">
              {richTextToPlain(marketplace.policyRules) ||
                'Please contact the provider for their late and cancellation policy.'}
            </p>
            <button
              type="button"
              onClick={() => setShowPolicies(false)}
              className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold text-sm uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
