'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Marketplace, BookingData, Service, ServiceAddOn } from '@/lib/types';
import { createExternalAppointment, createExternalAppointmentWithDeposit } from '@/lib/api';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CustomerDetailsProps {
  marketplace: Marketplace;
  selectedServices: Service[];
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onBack: () => void;
}

export default function CustomerDetails({
  marketplace,
  selectedServices,
  bookingData,
  setBookingData,
  onBack,
}: CustomerDetailsProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Calculate total from all services and add-ons
  const calculateTotal = (): number => {
    return selectedServices.reduce((total: number, service: Service) => {
      const servicePrice = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
      const addOnsTotal = (service.selectedAddOns || []).reduce((sum: number, addon: ServiceAddOn) => {
        const addonPrice = typeof addon.price === 'string' ? parseFloat(addon.price) : addon.price;
        return sum + addonPrice;
      }, 0);
      return total + servicePrice + addOnsTotal;
    }, 0);
  };

  const totalPrice = calculateTotal();
  const requiresDeposit = selectedServices.some(s => s.requireDeposit && s.depositAmount);
  const depositAmount = requiresDeposit ? totalPrice * 0.5 : 0; // 50% deposit
  const totalCharge = depositAmount;
  console.log('Total charge:', totalCharge); // Used for payment processing

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingData.acceptedTerms) {
      setError('You must accept the cancellation policy to continue');
      return;
    }

    if (selectedServices.length === 0 || !bookingData.date || !bookingData.time) {
      setError('Missing booking information');
      return;
    }

    // If deposit is required, show payment form
    if (requiresDeposit) {
      setShowPayment(true);
      return;
    }

    // Otherwise, submit directly
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0 || !bookingData.date || !bookingData.time) {
      setError('Missing booking information');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Combine date and time into a DateTime string
      const [hours, minutes, period] = bookingData.time.match(/(\d+):(\d+)\s*(AM|PM)/)?.slice(1) || [];
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;

      const dateTime = new Date(bookingData.date);
      dateTime.setHours(hour, parseInt(minutes), 0, 0);

      // Format services array with add-ons
      const services = selectedServices.map(service => ({
        serviceId: service.id,
        addOnIds: (service.selectedAddOns || []).map((addon: ServiceAddOn) => addon.id)
      }));

      const appointmentData = {
        marketplaceId: marketplace.id,
        services: services, // NEW: Array of services with add-ons
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        dateTime: dateTime.toISOString(),
        price: totalPrice,
        depositAmount: requiresDeposit ? depositAmount : undefined,
        remainingBalance: requiresDeposit ? totalPrice - depositAmount : undefined,
        acceptedTerms: bookingData.acceptedTerms,
        marketingConsent: bookingData.marketingConsent,
        notes: bookingData.notes || undefined,
      };

      // If deposit required and on payment screen, process payment
      if (requiresDeposit && showPayment) {
        if (!stripe || !elements) {
          setError('Payment system not loaded. Please refresh the page.');
          return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
          setError('Card information not found.');
          return;
        }

        // Create payment method
        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
          billing_details: {
            name: `${bookingData.firstName} ${bookingData.lastName}`,
            email: bookingData.email,
            phone: bookingData.phone,
          },
        });

        if (pmError) {
          setError(pmError.message || 'Payment failed. Please check your card details.');
          return;
        }

        // Create appointment with deposit
        await createExternalAppointmentWithDeposit({
          ...appointmentData,
          paymentMethodId: paymentMethod.id,
        });
      } else {
        // Create appointment without deposit
        await createExternalAppointment(appointmentData);
      }

      // Store booking data for success page
      const successData = {
        services: selectedServices.map(service => ({
          name: service.name,
          imageUrl: service.imageUrl,
          duration: service.duration,
          price: service.price,
          selectedAddOns: service.selectedAddOns || []
        })),
        date: bookingData.date,
        time: bookingData.time,
        total: calculateTotal(),
        businessName: marketplace.businessName
      };
      localStorage.setItem('bookingSuccessData', JSON.stringify(successData));

      // Redirect to success page
      router.push(`/book/${marketplace.customLink}/success`);
    } catch (err) {
      setError((err as Error).message || 'Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Services Summary */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-black mb-6">Order Summary</h3>
        <div className="space-y-3">
          {selectedServices.map((service, index) => (
            <div key={index}>
              <div className="flex justify-between items-start pb-3">
                <h4 className="font-semibold text-black">{service.name}</h4>
                <span className="font-semibold text-black">
                  ${typeof service.price === 'string' ? service.price : service.price.toFixed(2)}
                </span>
              </div>
              {service.selectedAddOns && service.selectedAddOns.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {service.selectedAddOns.map((addon: ServiceAddOn, addonIndex: number) => (
                    <div key={addonIndex} className="flex justify-between text-sm text-gray-600">
                      <span>+ {addon.title}</span>
                      <span>${typeof addon.price === 'string' ? addon.price : addon.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-gray-300 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-black">Subtotal:</span>
            <span className="text-base font-bold text-black">${totalPrice.toFixed(2)}</span>
          </div>
          {requiresDeposit && (
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Deposit Due Now (50%):</span>
              <span className="font-semibold">${depositAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-black mb-6">
        {showPayment ? 'PAYMENT INFORMATION' : 'YOUR INFORMATION'}
      </h2>

      <form onSubmit={showPayment ? (e) => { e.preventDefault(); handleSubmit(); } : handleNext}>
        {/* Customer Information - Hidden when showing payment */}
        {!showPayment && (
          <>
            {/* First Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={bookingData.firstName}
                onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Last Name"
                value={bookingData.lastName}
                onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <input
                type="tel"
                placeholder="Phone"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Marketing Consent */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingData.marketingConsent}
                  onChange={(e) => setBookingData({ ...bookingData, marketingConsent: e.target.checked })}
                  className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black mb-1">
                    Get important appointment updates from {marketplace.businessName}!
                  </p>
                  <p className="text-xs text-gray-600">
                    By checking the box, you consent to receive automated text messages at this number from{' '}
                    {marketplace.businessName} that may include messages on service offers. Consent is not a
                    condition of purchase. Text STOP to stop and HELP for help. Msg frequency varies. Msg&data
                    rates may apply. View{' '}
                    <a href="https://booqlyapp.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      TERMS
                    </a>{' '}
                    &{' '}
                    <a href="https://booqlyapp.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      PRIVACY
                    </a>
                    .
                  </p>
                </div>
              </label>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingData.acceptedTerms}
                  onChange={(e) => setBookingData({ ...bookingData, acceptedTerms: e.target.checked })}
                  required
                  className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">
                    I acknowledge & accept the Cancellation Policy. 48hrs advance notice & a 50% cancellation fee.
                  </p>
                </div>
              </label>
            </div>
          </>
        )}

        {/* Payment Section - Only shown when deposit is required */}
        {showPayment && requiresDeposit && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-black mb-6">Credit Card</h3>
            
            {/* Card Number */}
            <div className="mb-4">
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardNumberElement
                  options={{
                    placeholder: 'Card number',
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#374151',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                      invalid: {
                        color: '#EF4444',
                      },
                    },
                  }}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Expiry Date */}
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardExpiryElement
                  options={{
                    placeholder: 'MM / YY',
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#374151',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                      invalid: {
                        color: '#EF4444',
                      },
                    },
                  }}
                />
              </div>

              {/* CVV */}
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardCvcElement
                  options={{
                    placeholder: 'CVV',
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#374151',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                      invalid: {
                        color: '#EF4444',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Deposit Information */}
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-lg font-bold text-black mb-2">
                ${depositAmount.toFixed(2)} Non-Refundable Deposit Required
              </h4>
              <p className="text-sm text-gray-700">
                The deposit will be charged upon booking and applied to the appointment total. 
                If you cancel or no show, you will lose your deposit.
              </p>
            </div>
          </div>
        )}

        {/* Terms */}
        {!showPayment && (
          <p className="text-xs text-gray-600 mb-6">
            By clicking Next, you agree to {marketplace.businessName}&apos;s{' '}
            <a href="https://booqlyapp.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Terms of Service
            </a>
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              if (showPayment) {
                setShowPayment(false);
                setError(null);
              } else {
                onBack();
              }
            }}
            disabled={loading}
            className="px-8 py-3 border-2 border-black rounded-full font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || !bookingData.acceptedTerms || (showPayment && !cardComplete)}
            className={`flex-1 px-8 py-3 rounded-full font-medium transition-colors
              ${loading || !bookingData.acceptedTerms || (showPayment && !cardComplete)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
              }
            `}
          >
            {loading ? 'Processing...' : showPayment ? 'Complete Booking' : 'Next'}
          </button>
        </div>

        {/* Payment FAQ */}
        {showPayment && (
          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">What happens if I&apos;m a no-show or cancel?</p>
            <p className="text-xs text-gray-600 mb-1">Will I be charged before the service?</p>
            <p className="text-xs text-gray-600">Will I get my deposit back?</p>
          </div>
        )}
      </form>
    </div>
  );
}
