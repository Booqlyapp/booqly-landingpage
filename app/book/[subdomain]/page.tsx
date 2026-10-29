'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import SubdomainNavbar from '@/components/subdomain-navbar';
import BookingStepHeader from '@/components/booking/booking-step-header';
import PageColorsEditor from '@/components/booking/page-colors-editor';
import { Service, ServiceAddOn, Marketplace, BookingData } from '@/lib/types';
import { getMarketplaceByCustomLink } from '@/lib/api';
import ServiceListing from '@/components/booking/service-listing';
import AddOnsSelection from '@/components/booking/addons-selection';
import StylistSelection from '@/components/booking/stylist-selection';
import DateTimeSelection from '@/components/booking/datetime-selection';
import CustomerDetails from '@/components/booking/customer-details';
import StripeWrapper from '@/components/booking/stripe-wrapper';
import {
  BookingPageColors,
  colorsToCssVars,
  normalizeBookingPageColors,
} from '@/lib/booking-page-colors';

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
  const [pageColors, setPageColors] = useState<BookingPageColors>(
    normalizeBookingPageColors(null)
  );
  const [editToken, setEditToken] = useState<string | null>(null);
  const [colorsEditorOpen, setColorsEditorOpen] = useState(false);

  useEffect(() => {
    async function fetchMarketplace() {
      try {
        setLoading(true);
        const data = await getMarketplaceByCustomLink(subdomain);
        setMarketplace(data);
        setPageColors(normalizeBookingPageColors(data?.bookingPageColors));
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

  // Owner/provider edit mode: ?editColors=1#access_token=JWT
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = new URLSearchParams(window.location.search);
    if (query.get('editColors') !== '1') return;

    const hash = window.location.hash.replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);
    const token =
      hashParams.get('access_token') || query.get('access_token');

    if (token) {
      setEditToken(token);
      setColorsEditorOpen(true);
      // Strip token from the URL so it is not left in history/share links.
      window.history.replaceState({}, '', `${window.location.pathname}?editColors=1`);
    }
  }, []);

  // Keep booking steps in browser history so mobile/web Back goes
  // to the previous step instead of leaving the custom link.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.history.replaceState({ bookingStep: 0 }, '');

    const onPopState = (event: PopStateEvent) => {
      const step = event.state?.bookingStep;
      if (typeof step === 'number' && step >= 0 && step <= 4) {
        setCurrentStep(step);
        return;
      }
      setCurrentStep(0);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectedService = selectedServices[0];

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      window.history.pushState({ bookingStep: step }, '');
    }
  };

  const handleProceedFromServices = (services: Service[]) => {
    setSelectedServices(services);
    goToStep(nextAfterServiceExtras(services[0], 'services'));
  };

  const handleAddOnsContinue = (selectedAddOns: ServiceAddOn[]) => {
    if (!selectedService) return;
    const updated = {
      ...selectedService,
      selectedAddOns,
    };
    setSelectedServices([updated]);
    goToStep(nextAfterServiceExtras(updated, 'addons'));
  };

  const handleStylistContinue = (selectedProviderId: string | null) => {
    if (!selectedService) return;
    setSelectedServices([
      {
        ...selectedService,
        selectedProviderId,
      },
    ]);
    goToStep(3);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData((prev) => ({ ...prev, date, time }));
    goToStep(4);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && currentStep > 0) {
      window.history.back();
      return;
    }
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

  const themeStyle = useMemo(() => colorsToCssVars(pageColors), [pageColors]);
  const canEditColors = Boolean(editToken && marketplace?.id);

  return (
    <div className="booking-themed min-h-screen" style={themeStyle}>
      {currentStep === 0 && (
        <SubdomainNavbar
          businessName={marketplace.businessName}
          cartCount={selectedServices.length}
          onCartClick={() => {
            document
              .getElementById('services')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          navItems={listingNavItems}
          onEditColors={
            canEditColors ? () => setColorsEditorOpen(true) : undefined
          }
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

      {canEditColors && editToken && (
        <PageColorsEditor
          marketplaceId={marketplace.id}
          accessToken={editToken}
          headerImageUrl={marketplace.bookingPageHeaderImage}
          initialColors={pageColors}
          open={colorsEditorOpen}
          onClose={() => setColorsEditorOpen(false)}
          onColorsChange={setPageColors}
        />
      )}
    </div>
  );
}
