'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Marketplace,
  BookingData,
  Service,
  ServiceAddOn,
} from '@/lib/types';
import {
  BookingApiError,
  createExternalAppointment,
  createExternalAppointmentWithDeposit,
} from '@/lib/api';
import { formatWallClockDateTime, parseLocalYmd } from '@/lib/wall-clock';
import {
  NO_PREFERENCE_ID,
  resolveProfessionalName,
  resolveStylistLabel,
} from '@/lib/booking-stylist';
import AppointmentSummaryFooter from './appointment-summary-footer';
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
  /** Same as app: all providers booked → return to date/time step */
  onProvidersUnavailable?: () => void;
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

/** US national digits only (no country code), max 10. */
function usNationalDigits(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Live US display like the mobile app: +1 (XXX) XXX-XXXX */
function formatUsPhoneInput(phone: string): string {
  const digits = usNationalDigits(phone);
  let out = '+1';
  if (digits.length === 0) return out;
  if (digits.length <= 3) return `${out} (${digits}`;
  if (digits.length <= 6) {
    return `${out} (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `${out} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** E.164 for a complete valid US number, else null. */
function toE164Us(phone: string): string | null {
  const digits = usNationalDigits(phone);
  // 10 digits; area code and exchange cannot start with 0 or 1
  if (digits.length !== 10) return null;
  if (/^[01]/.test(digits) || /^...[01]/.test(digits)) return null;
  return `+1${digits}`;
}

function isValidUsPhone(phone: string): boolean {
  return toE164Us(phone) != null;
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
  onProvidersUnavailable,
}: CustomerDetailsProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const service = selectedServices[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!bookingData.phone || !bookingData.phone.startsWith('+1')) {
      setBookingData({
        ...bookingData,
        phone: formatUsPhoneInput(bookingData.phone || ''),
      });
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
    isValidUsPhone(bookingData.phone) &&
    bookingData.acceptedTerms;

  const canSubmit =
    formValid && (!requiresDeposit || (Boolean(stripe) && cardComplete)) && !loading;

  const stylistLabel = service ? resolveStylistLabel(service) : null;

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

      const phone = toE164Us(bookingData.phone);
      if (!phone) {
        setError('Please enter a valid US phone number.');
        return;
      }

      // null = No Preference → backend auto-assigns least-booked free member
      const assignedTeamMemberId =
        service.selectedProviderId &&
        service.selectedProviderId !== NO_PREFERENCE_ID
          ? service.selectedProviderId
          : null;

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
        assignedTeamMemberId,
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
        professionalName: resolveProfessionalName(service),
      };
      localStorage.setItem('bookingSuccessData', JSON.stringify(successData));
      router.push(`/book/${marketplace.customLink}/success`);
    } catch (err) {
      const message =
        (err as Error).message || 'Failed to create booking. Please try again.';
      setError(message);
      console.error(err);

      const reason =
        err instanceof BookingApiError
          ? err.reason
          : (err as { reason?: string }).reason;
      if (
        reason === 'all_providers_booked' ||
        reason === 'provider_occupied'
      ) {
        onProvidersUnavailable?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-10">
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
              inputMode="numeric"
              value={bookingData.phone}
              onChange={(e) => {
                setBookingData({
                  ...bookingData,
                  phone: formatUsPhoneInput(e.target.value),
                });
              }}
              placeholder="+1 (555) 123-4567"
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
            <a
              href="https://booqlyapp.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold underline underline-offset-2"
            >
              Policies &amp; Rules
            </a>
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

        {service && (
          <div className="mt-8">
            <AppointmentSummaryFooter
              service={service}
              selectedAddOns={service.selectedAddOns || []}
              stylistLabel={stylistLabel}
              scheduledLabel={scheduledLabel}
              continueLabel={
                loading
                  ? 'Processing…'
                  : requiresDeposit
                    ? `Pay $${depositAmount.toFixed(2)} Deposit`
                    : 'Confirm booking'
              }
              continueDisabled={!canSubmit}
              onContinue={() => handleSubmit()}
              footerNote={
                requiresDeposit
                  ? 'The deposit is non-refundable and will be applied toward your service.'
                  : null
              }
            />
          </div>
        )}
      </form>
    </div>
  );
}
