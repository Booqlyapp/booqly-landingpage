'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Service, Marketplace, ServiceAddOn } from '@/lib/types';
import { getAvailableTimeSlots } from '@/lib/api';

interface DateTimeSelectionProps {
  marketplace: Marketplace;
  selectedServices: Service[];
  onSelectDateTime: (date: string, time: string) => void;
  onBack: () => void;
}

export default function DateTimeSelection({
  marketplace,
  selectedServices,
  onSelectDateTime,
  onBack,
}: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showReview, setShowReview] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate total price from all services and their add-ons
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

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        // Use first service for time slots (all services will be booked at same time)
        const slots = await getAvailableTimeSlots(marketplace.id, selectedServices[0].id, dateStr);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      setShowReview(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      onSelectDateTime(dateStr, selectedTime);
    }
  };

  const handleBackFromReview = () => {
    setShowReview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If showing review screen
  if (showReview && selectedDate && selectedTime) {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Review & Confirm</h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">Please review your booking details</p>

        {/* Services */}
        {selectedServices.map((service, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 md:p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Service Image */}
              <div className="relative w-full md:w-32 h-48 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={service.imageUrl || '/images/beautybrushes.png'}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Service Details */}
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-black mb-1 md:mb-2">{service.name}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">With any professional</p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm md:text-base">{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base md:text-lg font-semibold">${typeof service.price === 'string' ? service.price : service.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons if any */}
            {service.selectedAddOns && service.selectedAddOns.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons:</p>
                {service.selectedAddOns.map((addon: ServiceAddOn, addonIndex: number) => (
                  <div key={addonIndex} className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>+ {addon.title}</span>
                    <span>${typeof addon.price === 'string' ? addon.price : addon.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Booking Details */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 space-y-4">
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              <span className="text-gray-600">Date</span>
              <p className="font-semibold text-black">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <span className="text-gray-600">Time</span>
              <p className="font-semibold text-black">{selectedTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="flex-1">
              <span className="text-gray-600">Professional</span>
              <p className="font-semibold text-black">Any Professional</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-black">Total</span>
            <span className="text-3xl font-bold text-black">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Secure Booking Notice */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h4 className="font-semibold text-black mb-1">Secure booking</h4>
              <p className="text-sm text-gray-600">Your information is safe and encrypted.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleBackFromReview}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-black rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 sm:px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Verify and Confirm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">SELECT A DAY</h2>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg md:text-xl font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-2 md:gap-3">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-8 sm:h-10 md:h-12"></div>;
            }

            const isPast = date < today;
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const _isToday = date.toDateString() === today.toDateString();

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateSelect(date)}
                disabled={isPast}
                className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all leading-none
                  ${isPast ? 'text-gray-300 cursor-not-allowed border border-gray-200 sm:border-2' : 'cursor-pointer'}
                  ${isSelected 
                    ? 'bg-[#759CC9] text-white hover:bg-[#759CC9] shadow-md border border-[#759CC9] sm:border-2' 
                    : 'border border-gray-300 sm:border-2 text-gray-700 hover:border-[#759CC9] hover:text-[#759CC9]'}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">SELECT A TIME</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading available times...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-4 px-6 rounded-full border-2 font-medium transition-colors
                    ${selectedTime === slot
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:border-black'
                    }
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No available time slots for this date.
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3 border-2 border-black rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className={`flex-1 px-8 py-3 rounded-full font-medium transition-colors
            ${selectedDate && selectedTime
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
