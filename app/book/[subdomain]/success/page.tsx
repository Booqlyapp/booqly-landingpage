'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SubdomainNavbar from '@/components/subdomain-navbar';
import Image from 'next/image';

interface BookingSuccessData {
  services: Array<{
    name: string;
    imageUrl: string | null;
    duration: number;
    price: number | string;
    selectedAddOns?: Array<{ title: string; price: number | string }>;
  }>;
  date: string | null;
  time: string | null;
  total: number;
  businessName: string;
}

export default function SuccessPage() {
  const params = useParams();
  const _subdomain = params.subdomain as string;
  
  // Use lazy initialization to avoid setState in effect
  const [bookingData] = useState<BookingSuccessData | null>(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('bookingSuccessData');
      if (data) {
        // Clear the data after retrieving
        localStorage.removeItem('bookingSuccessData');
        return JSON.parse(data);
      }
    }
    return null;
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return 'N/A';
    return timeStr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SubdomainNavbar businessName={bookingData?.businessName || 'Loading...'} />

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <Image
            src='/images/done.png'
            alt="Sucess image"
            width={200}
            height={200}
          />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-black mb-3">You&apos;re all set!</h1>
        <p className="text-center text-gray-600 mb-8 md:mb-12">Your appointment has been confirmed.</p>

        {/* Booking Details Card */}
        {bookingData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            {/* Services */}
            {bookingData.services.map((service, index) => (
              <div key={index} className="mb-6 pb-6 last:mb-0 last:pb-0">
                <div className="flex gap-4 mb-4">
                  {/* Service Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={service.imageUrl || '/images/beautybrushes.png'}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Service Details */}
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-black mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">With any professional</p>
                  </div>
                </div>

                {/* Add-ons if any */}
                {service.selectedAddOns && service.selectedAddOns.length > 0 && (
                  <div className="ml-0 md:ml-28 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons:</p>
                    {service.selectedAddOns.map((addon, addonIndex) => (
                      <div key={addonIndex} className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>+ {addon.title}</span>
                        <span>${typeof addon.price === 'string' ? addon.price : addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Appointment Details */}
            <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
              {/* Date */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                  <p className="text-sm md:text-base text-gray-600 md:font-medium">Date</p>
                  <p className="font-semibold text-black md:text-right">{formatDate(bookingData.date)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                  <p className="text-sm md:text-base text-gray-600 md:font-medium">Time</p>
                  <p className="font-semibold text-black md:text-right">{formatTime(bookingData.time)}</p>
                </div>
              </div>

              {/* Professional */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                  <p className="text-sm md:text-base text-gray-600 md:font-medium">Professional</p>
                  <p className="font-semibold text-black md:text-right">Any Professional</p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-black">Total</span>
                <span className="text-2xl font-bold text-black">${bookingData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Go to Home Button */}
        <a 
          href="https://booqlyapp.com" 
          rel="noopener noreferrer"
          className="w-full py-4 bg-[#759CC9] text-white rounded-2xl font-semibold text-lg hover:bg-[#6a8bb8] transition-colors flex items-center justify-center gap-3 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Home
        </a>
      </div>
    </div>
  );
}
