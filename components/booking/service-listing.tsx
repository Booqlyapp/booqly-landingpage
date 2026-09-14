'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Marketplace, Service, ServiceAddOn } from '@/lib/types';
import AddOnsModal from './addons-modal';
import ReviewsSection from './reviews-section';
import PoweredBy from './powered-by';

// Dynamically import react-pdf to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

// Configure PDF.js worker (will run on client only)
if (typeof window !== 'undefined') {
  import('react-pdf').then((pdfjs) => {
    pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

interface ServiceListingProps {
  marketplace: Marketplace;
  selectedServices: Service[];
  setSelectedServices: (services: Service[]) => void;
  onProceedToBooking: (selectedServices: Service[]) => void;
}

export default function ServiceListing({ marketplace, selectedServices, setSelectedServices, onProceedToBooking }: ServiceListingProps) {
  const [addOnsModalOpen, setAddOnsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number>(800);

  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== 'undefined') {
        setPdfWidth(Math.min(window.innerWidth - 100, 800));
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleAddToCart = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      // Remove from cart (deselect)
      setSelectedServices([]);
    } else {
      // Check if service has active addons
      const hasAddOns = service.addOns && service.addOns.some(addon => addon.isActive);

      if (hasAddOns) {
        // Show addons modal
        setCurrentService(service);
        setAddOnsModalOpen(true);
      } else {
        // Replace with new service (single selection)
        setSelectedServices([service]);
      }
    }
  };

  const handleAddOnsConfirm = (selectedAddOns: ServiceAddOn[]) => {
    if (currentService) {
      // Replace with service with selected addons (single selection)
      const serviceWithAddOns = {
        ...currentService,
        selectedAddOns,
      };
      setSelectedServices([serviceWithAddOns]);
      setCurrentService(null);
    }
  };

  const isInCart = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const totalAmount = selectedServices.reduce((sum, service) => {
    return sum + Number(service.price);
  }, 0);

  const formatSchedule = (day: string) => {
    const schedule = marketplace.schedule?.[day.toLowerCase() as keyof typeof marketplace.schedule];
    if (!schedule || typeof schedule === 'string') {
      return schedule || 'Closed';
    }
    return schedule.isOpen ? `${schedule.startTime} - ${schedule.endTime}` : 'Closed';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-12 pb-8">
          <div className="flex flex-col items-center text-center">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {marketplace.bookingPageTitle || 'Book your perfect service'}
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {marketplace.bookingPageSubtitle || 'Look your best, feel your best.'}
            </p>
            
            {/* Image or PDF - Centered */}
            <div className="relative w-full flex items-center justify-center">
              {marketplace.bookingPageHeaderPdf ? (
                <div className="w-full flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white shadow-lg">
                  <Document
                    file={marketplace.bookingPageHeaderPdf}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={
                      <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading PDF...</div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-64">
                        <div className="text-red-500">Failed to load PDF</div>
                      </div>
                    }
                    className="w-full"
                  >
                    {numPages && Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={pdfWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="mb-4"
                      />
                    ))}
                  </Document>
                </div>
              ) : (
                <div className="relative w-full max-w-md h-64 md:h-80">
                  <Image
                    src={marketplace.bookingPageHeaderImage || "/images/woman.png"}
                    alt="Beauty Services"
                    fill
                    className="object-contain object-center"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Action Bar - Sticky, only shown when service selected */}
      {selectedServices.length > 0 && (
        <div className="sticky top-20 z-40 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#759CC9] rounded-2xl shadow-lg p-4 md:p-6 my-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Image
                      src="/images/home.svg"
                      alt="Home"
                      width={24}
                      height={24}
                      className="w-8 h-8 filter brightness-0 invert-0"
                    />
                  </button>
                  <button
                    onClick={() => setSelectedServices([])}
                    className="text-white font-semibold text-lg hover:text-gray-200 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
                <button
                  onClick={() => onProceedToBooking(selectedServices)}
                  className="bg-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md"
                >
                  Book Service
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Choose your service</h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {marketplace.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              {/* Service Image */}
              <div className="relative h-56 bg-gradient-to-br from-amber-100 to-stone-200">
                <Image
                  src={service.imageUrl || '/images/beautybrushes.png'}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Service Details */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-500 text-base mb-6 line-clamp-2">{service.description}</p>

                {/* Duration and Price */}
                <div className="flex items-center gap-6 mb-6 text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-medium">{service.duration} min</span>
                  </div>
                  {/* Vertical Divider */}
                  <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-bold">${Number(service.price).toFixed(2)}</span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleAddToCart(service)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-lg transition-all bg-[#759CC9] text-white mt-auto `}
                >
                  {isInCart(service.id) ? 'Added ✓' : 'Book'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {marketplace.services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available at this time.</p>
          </div>
        )}

        {/* Reviews Section */}
        {marketplace.reviews && marketplace.reviews.length > 0 && (
          <ReviewsSection reviews={marketplace.reviews} />
        )}

        {/* Policy/Rules Section */}
        {marketplace.showPolicyRules && marketplace.policyRules && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Rules</h2>
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-200">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{marketplace.policyRules}</p>
              </div>
            </div>
          </div>
        )}

        {/* Availability Section */}
        {marketplace.schedule && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Salon availability</h2>
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-200">
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const schedule = formatSchedule(day);
                  const isClosed = schedule === 'closed';

                  return (
                    <div key={day} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3 md:gap-4">
                        {/* Calendar Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isClosed ? 'bg-red-50' : 'bg-blue-50'
                        }`}>
                          <svg className={`w-6 h-6 ${isClosed ? 'text-red-500' : 'text-[#759CC9]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        
                        {/* Day name with time below on mobile */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-base">{day}</span>
                          {!isClosed && <span className="text-sm text-gray-600 md:hidden">{schedule}</span>}
                        </div>
                      </div>
                      
                      {/* Time and Badge on right side */}
                      <div className="flex items-center gap-4">
                        {/* Time - hidden on mobile, shown on desktop */}
                        {!isClosed && <span className="hidden md:block text-gray-700">{schedule}</span>}
                        
                        {/* Bookable/Closed Badge */}
                        <span className={`font-medium text-sm px-4 py-1.5 rounded-full whitespace-nowrap ${isClosed
                          ? 'text-red-500 bg-red-50'
                          : 'text-[#759CC9] bg-blue-50'
                          }`}>
                          {isClosed ? 'Closed' : 'Bookable'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Powered by Booqly */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PoweredBy />
      </div>

      {/* Floating Cart Summary - Mobile */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#759CC9] text-white p-4 shadow-lg md:hidden z-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Service selected</p>
              <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onProceedToBooking(selectedServices)}
              className="bg-white text-[#759CC9] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              View Booking
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add-Ons Modal */}
      {currentService && (
        <AddOnsModal
          service={currentService}
          isOpen={addOnsModalOpen}
          onClose={() => {
            setAddOnsModalOpen(false);
            setCurrentService(null);
          }}
          onConfirm={handleAddOnsConfirm}
        />
      )}
    </div>
  );
}
