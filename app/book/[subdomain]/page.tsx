'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SubdomainNavbar from '@/components/subdomain-navbar';
import PoweredBy from '@/components/booking/powered-by';
import { Service, Marketplace, BookingData } from '@/lib/types';
import { getMarketplaceByCustomLink } from '@/lib/api';
import ServiceListing from '@/components/booking/service-listing';
import DateTimeSelection from '@/components/booking/datetime-selection';
import CustomerDetails from '@/components/booking/customer-details';
import StripeWrapper from '@/components/booking/stripe-wrapper';

export default function BookingPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0=service listing, 1=date/time, 2=details
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: null,
    time: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptedTerms: false,
    marketingConsent: false,
    notes: '',
  });

  useEffect(() => {
    async function fetchMarketplace() {
      try {
        setLoading(true);
        const data = await getMarketplaceByCustomLink(subdomain);
        setMarketplace(data);
      } catch (err) {
        setError('Marketplace not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (subdomain) {
      fetchMarketplace();
    }
  }, [subdomain]);

  const handleProceedToBooking = (services: Service[]) => {
    setSelectedServices(services);
    // Go directly to date/time for all cases (single or multiple services)
    setCurrentStep(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SubdomainNavbar businessName="Loading..." />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !marketplace) {
    return (
      <div className="min-h-screen bg-white">
        <SubdomainNavbar businessName="Error" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace Not Found</h1>
            <p className="text-gray-600">We couldn&apos;t find this booking page.</p>
          </div>
        </div>
      </div>
    );
  }


  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }));
    setCurrentStep(3); // Go to customer details
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 1) {
        // Going back to service listing
        setBookingData(prev => ({ ...prev, service: null }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SubdomainNavbar 
        businessName={marketplace.businessName} 
        cartCount={selectedServices.length}
        onCartClick={() => setCurrentStep(0)}
      />

      {/* Progress Indicator - Hidden on step 0 (service listing) */}
      {currentStep > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Step 1: Select Service - Always Completed */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 bg-black border-black text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium text-black text-center">SELECT SERVICE</p>
              </div>

              {/* Connector */}
              <div className={`h-0.5 w-12 md:w-24 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-300'}`}></div>

              {/* Step 2: Date & Location */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep === 2
                      ? 'bg-[#759CC9] border-[#759CC9] text-white'
                      : currentStep > 2
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium text-black text-center">DATE & LOCATION</p>
              </div>

              {/* Connector */}
              <div className={`h-0.5 w-12 md:w-24 ${currentStep >= 3 ? 'bg-black' : 'bg-gray-300'}`}></div>

              {/* Step 3: Your Details */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep === 3
                      ? 'bg-[#759CC9] border-[#759CC9] text-white'
                      : currentStep > 3
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium text-black text-center">YOUR DETAILS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={currentStep === 0 ? '' : 'max-w-4xl mx-auto px-4 py-8'}>
        {currentStep === 0 && (
          <ServiceListing
            marketplace={marketplace}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            onProceedToBooking={handleProceedToBooking}
          />
        )}
        {currentStep === 2 && selectedServices.length > 0 && (
          <DateTimeSelection
            marketplace={marketplace}
            selectedServices={selectedServices}
            onSelectDateTime={handleDateTimeSelect}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && selectedServices.length > 0 && bookingData.date && bookingData.time && (
          <StripeWrapper>
            <CustomerDetails
              marketplace={marketplace}
              selectedServices={selectedServices}
              bookingData={bookingData}
              setBookingData={setBookingData}
              onBack={handleBack}
            />
          </StripeWrapper>
        )}
      </div>

      {/* Powered by Booqly - Show on steps 1-3 */}
      {currentStep > 0 && (
        <div className="max-w-4xl mx-auto px-4">
          <PoweredBy />
        </div>
      )}
    </div>
  );
}
