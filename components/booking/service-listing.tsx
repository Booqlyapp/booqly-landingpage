'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Marketplace, Service } from '@/lib/types';
import { richTextToPlain } from '@/lib/rich-text';
import ReviewsSection from './reviews-section';
import PoweredBy from './powered-by';
import ServiceContinueBar from './service-continue-bar';

const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

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

function formatDuration(duration: string | number | undefined): string {
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

export default function ServiceListing({
  marketplace,
  selectedServices,
  setSelectedServices,
  onProceedToBooking,
}: ServiceListingProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfWidth, setPdfWidth] = useState<number>(390);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const headerMediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerMediaRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = Math.floor(el.getBoundingClientRect().width);
      if (width > 0) setPdfWidth(width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [marketplace.bookingPageHeaderPdf]);

  const handleAddToCart = (service: Service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([]);
    } else {
      setSelectedServices([{ ...service, selectedAddOns: [] }]);
    }
  };

  const isInCart = (serviceId: string) =>
    selectedServices.some((s) => s.id === serviceId);

  const selected = selectedServices[0];

  const formatSchedule = (day: string) => {
    const schedule =
      marketplace.schedule?.[
        day.toLowerCase() as keyof typeof marketplace.schedule
      ];
    if (!schedule || typeof schedule === 'string') {
      return (schedule as string) || 'Closed';
    }
    return schedule.isOpen
      ? `${schedule.startTime} - ${schedule.endTime}`
      : 'Closed';
  };

  const isClosedDay = (scheduleText: string) => {
    const t = scheduleText.trim().toLowerCase();
    return !t || t === 'closed' || t === '—';
  };

  const hasReviews = Boolean(
    marketplace.reviews?.some((r) => r.status === 'approved' && r.isPublic)
  );
  const hasHeaderMedia = Boolean(
    marketplace.bookingPageHeaderPdf || marketplace.bookingPageHeaderImage
  );
  const aboutText = richTextToPlain(marketplace.bio);
  const policiesText = richTextToPlain(marketplace.policyRules);

  const days = useMemo(
    () => [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    []
  );

  return (
    <div className={`min-h-screen bg-white ${selected ? 'pb-28' : 'pb-10'}`}>
      {/* Hero: full uploaded header image or PDF — no crop / edge cut */}
      {hasHeaderMedia ? (
        <div ref={headerMediaRef} className="w-full bg-white overflow-x-hidden">
          {marketplace.bookingPageHeaderPdf ? (
            <div className="w-full bg-white booking-header-pdf">
              <Document
                file={marketplace.bookingPageHeaderPdf}
                onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                loading={
                  <div className="flex items-center justify-center h-64 w-full">
                    <div className="text-gray-500 text-sm">Loading…</div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-40 w-full">
                    <div className="text-red-500 text-sm">Failed to load PDF</div>
                  </div>
                }
                className="w-full"
              >
                {numPages &&
                  Array.from(new Array(numPages), (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={pdfWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="booking-header-pdf-page"
                    />
                  ))}
              </Document>
            </div>
          ) : (
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={marketplace.bookingPageHeaderImage!}
                alt={marketplace.businessName}
                className="w-full h-auto block object-contain"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 pt-8 pb-2 max-w-3xl mx-auto">
          {(marketplace.bookingPageTitle || marketplace.bookingPageSubtitle) && (
            <div className="text-center mb-2">
              {marketplace.bookingPageTitle && (
                <h2 className="font-booking-serif text-3xl font-bold text-black mb-2">
                  {marketplace.bookingPageTitle}
                </h2>
              )}
              {marketplace.bookingPageSubtitle && (
                <p className="text-gray-600 text-base">
                  {marketplace.bookingPageSubtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Services */}
        <section id="services" className="scroll-mt-28 pt-10 pb-4">
          <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-8">
            Services
          </h2>

          {marketplace.services.length === 0 ? (
            <p className="text-gray-500 py-8">No services available at this time.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {marketplace.services.map((service) => {
                const selected = isInCart(service.id);
                const description = service.description?.trim() || '';
                const isLong = description.length > 140;
                const expanded = expandedDescriptions[service.id];
                const shownDescription =
                  !isLong || expanded
                    ? description
                    : `${description.slice(0, 140).trimEnd()}…`;

                return (
                  <div key={service.id} className="py-6 first:pt-0">
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={
                            service.imageUrl || '/images/beautybrushes.png'
                          }
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-booking-serif text-xl sm:text-2xl font-bold text-black leading-tight truncate">
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">
                              {formatDuration(service.duration)}
                              {formatDuration(service.duration) ? ' · ' : ''}
                              <span className="font-semibold text-black">
                                ${Number(service.price).toFixed(2)}
                              </span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(service)}
                            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold tracking-wide uppercase transition-colors ${
                              selected
                                ? 'bg-white text-black border border-black'
                                : 'bg-black text-white border border-black hover:bg-gray-900'
                            }`}
                          >
                            {selected ? (
                              <>
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Added
                              </>
                            ) : (
                              'Select'
                            )}
                          </button>
                        </div>

                        {description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {shownDescription}
                            </p>
                            {isLong && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedDescriptions((prev) => ({
                                    ...prev,
                                    [service.id]: !prev[service.id],
                                  }))
                                }
                                className="mt-2 text-xs font-bold tracking-wide uppercase text-black"
                              >
                                {expanded ? 'Show less' : 'Show all'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {hasReviews && marketplace.reviews && (
          <ReviewsSection reviews={marketplace.reviews} />
        )}

        <section
          id="about"
          className="scroll-mt-28 py-10 border-t border-gray-100"
        >
          <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-5">
            About
          </h2>
          {aboutText ? (
            <p className="text-[15px] sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {aboutText}
            </p>
          ) : null}
        </section>

        <section
          id="policies"
          className="scroll-mt-28 py-10 border-t border-gray-100"
        >
          <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-5">
            Policies &amp; Rules
          </h2>
          {policiesText ? (
            <p className="text-[15px] sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {policiesText}
            </p>
          ) : null}
        </section>

        <section
          id="hours"
          className="scroll-mt-28 py-10 border-t border-gray-100"
        >
          <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-6">
            Opening hours
          </h2>
          {marketplace.schedule ? (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="divide-y divide-gray-100">
                {days.map((day) => {
                  const schedule = formatSchedule(day);
                  const closed = isClosedDay(String(schedule));

                  return (
                    <div
                      key={day}
                      className="flex items-center gap-2 sm:gap-4 px-4 py-3.5"
                    >
                      <span className="w-[5.5rem] sm:w-28 text-sm font-medium text-black shrink-0">
                        {day}
                      </span>
                      <span className="flex-1 text-sm text-gray-600 text-center sm:text-left">
                        {closed ? '—' : schedule}
                      </span>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          closed
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            closed ? 'bg-gray-400' : 'bg-emerald-500'
                          }`}
                        />
                        {closed ? 'Closed' : 'Open'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>

        <div className="pt-4 pb-8">
          <PoweredBy />
        </div>
      </div>

      {selected && (
        <ServiceContinueBar
          service={selected}
          onContinue={() => onProceedToBooking(selectedServices)}
        />
      )}
    </div>
  );
}
