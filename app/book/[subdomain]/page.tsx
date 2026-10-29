'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SubdomainNavbar from '@/components/subdomain-navbar';
import BookingStepHeader from '@/components/booking/booking-step-header';
import { Service, ServiceAddOn, Marketplace, BookingData } from '@/lib/types';
import { getMarketplaceByCustomLink } from '@/lib/api';
import ServiceListing from '@/components/booking/service-listing';
import AddOnsSelection from '@/components/booking/addons-selection';
import StylistSelection from '@/components/booking/stylist-selection';
import DateTimeSelection from '@/components/booking/datetime-selection';
import CustomerDetails from '@/components/booking/customer-details';
import StripeWrapper from '@/components/booking/stripe-wrapper';

function serviceHasActiveAddOns(service: Service | undefined): boolean {
  return Boolean(
    service?.addOns?.some((addon) => addon && addon.isActive !== false)
  );
}

function serviceHasTeamMembers(service: Service | undefined): boolean {
  return Boolean(service?.providerTeamMembers && service.providerTeamMembers.length > 0);
}

/** Next step after services / add-ons / stylist decisions. */
function nextAfterServiceExtras(
  service: Service | undefined,
  from: 'services' | 'addons' | 'stylist'
): number {
  // 0=services, 1=addons, 2=stylist, 3=datetime, 4=details
  if (from === 'services') {
    if (serviceHasActiveAddOns(service)) return 1;
    if (serviceHasTeamMembers(service)) return 2;
    return 3;
  }
  if (from === 'addons') {
    if (serviceHasTeamMembers(service)) return 2;
    return 3;
  }
  return 3;
}

function previousBefore(
  service: Service | undefined,
  current: number
): number {
  if (current === 1) return 0;
  if (current === 2) {
    return serviceHasActiveAddOns(service) ? 1 : 0;
  }
  if (current === 3) {
    if (serviceHasTeamMembers(service)) return 2;
    if (serviceHasActiveAddOns(service)) return 1;
    return 0;
  }
  if (current === 4) return 3;
  return 0;
}

export default function BookingPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 0=services, 1=add-ons, 2=stylist, 3=date/time, 4=details
  const [currentStep, setCurrentStep] = useState(0);
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

  const selectedService = selectedServices[0];

  const handleProceedFromServices = (services: Service[]) => {
    setSelectedServices(services);
    setCurrentStep(nextAfterServiceExtras(services[0], 'services'));
  };

  const handleAddOnsContinue = (selectedAddOns: ServiceAddOn[]) => {
    if (!selectedService) return;
    const updated = {
      ...selectedService,
      selectedAddOns,
    };
    setSelectedServices([updated]);
    setCurrentStep(nextAfterServiceExtras(updated, 'addons'));
  };

  const handleStylistContinue = (selectedProviderId: string | null) => {
    if (!selectedService) return;
    setSelectedServices([
      {
        ...selectedService,
        selectedProviderId,
      },
    ]);
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData((prev) => ({ ...prev, date, time }));
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(previousBefore(selectedService, currentStep));
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Marketplace Not Found
            </h1>
            <p className="text-gray-600">
              We couldn&apos;t find this booking page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const listingNavItems =
    currentStep === 0
      ? [
          { id: 'services', label: 'Services' },
          { id: 'about', label: 'About' },
          { id: 'policies', label: 'Policies & Rules' },
          { id: 'hours', label: 'Hours' },
        ]
      : [];

  const showRedesignedStep = currentStep >= 1 && currentStep <= 4;
  const headerStepNumber =
    currentStep === 1
      ? 2
      : currentStep === 2
        ? 3
        : currentStep === 3
          ? 4
          : currentStep === 4
            ? 5
            : 1;

  return (
    <div className="min-h-screen bg-white">
      {currentStep === 0 && (
        <SubdomainNavbar
          businessName={marketplace.businessName}
          cartCount={selectedServices.length}
          onCartClick={() => setCurrentStep(0)}
          navItems={listingNavItems}
        />
      )}

      {showRedesignedStep && (
        <BookingStepHeader
          businessName={marketplace.businessName}
          stepNumber={headerStepNumber}
          onBack={handleBack}
        />
      )}

      <div>
        {currentStep === 0 && (
          <ServiceListing
            marketplace={marketplace}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            onProceedToBooking={handleProceedFromServices}
          />
        )}

        {currentStep === 1 && selectedService && (
          <AddOnsSelection
            service={selectedService}
            onContinue={handleAddOnsContinue}
          />
        )}

        {currentStep === 2 && selectedService && (
          <StylistSelection
            service={selectedService}
            onContinue={handleStylistContinue}
          />
        )}

        {currentStep === 3 && selectedServices.length > 0 && (
          <DateTimeSelection
            marketplace={marketplace}
            selectedServices={selectedServices}
            onSelectDateTime={handleDateTimeSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 &&
          selectedServices.length > 0 &&
          bookingData.date &&
          bookingData.time && (
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

    </div>
  );
}
