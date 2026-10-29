'use client';

import { useMemo, useState } from 'react';
import { Service, ServiceAddOn } from '@/lib/types';
import AppointmentSummaryFooter from './appointment-summary-footer';

interface AddOnsSelectionProps {
  service: Service;
  onContinue: (selectedAddOns: ServiceAddOn[]) => void;
}

export default function AddOnsSelection({
  service,
  onContinue,
}: AddOnsSelectionProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<ServiceAddOn[]>(
    service.selectedAddOns || []
  );

  const activeAddOns = useMemo(() => {
    const all = service.addOns || [];
    // Treat missing isActive as active so app-created add-ons always show
    return all.filter((addon) => addon && addon.isActive !== false);
  }, [service.addOns]);

  const toggleAddOn = (addon: ServiceAddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const isSelected = (addonId: string) =>
    selectedAddOns.some((a) => a.id === addonId);

  const formatAddonPrice = (addon: ServiceAddOn) => {
    const price = Number(addon.price);
    if (!price || price <= 0) return 'Included';
    return `+$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <h2 className="font-booking-serif text-3xl sm:text-4xl font-bold text-black mb-2">
          Add to your appointment
        </h2>
        <p className="text-neutral-500 text-[15px] mb-8">
          Optional extras. Skip this step if you don&apos;t need any.
        </p>

        {activeAddOns.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">
            No add-ons available for this service.
          </p>
        ) : (
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {activeAddOns.map((addon) => {
              const checked = isSelected(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddOn(addon)}
                  className="w-full flex items-start gap-3 py-4 text-left"
                >
                  <span
                    className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                      checked
                        ? 'bg-black border-black text-white'
                        : 'border-gray-400 bg-white'
                    }`}
                    aria-hidden
                  >
                    {checked && (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-black text-[15px]">
                      {addon.title}
                    </span>
                  </span>

                  <span className="shrink-0 font-semibold text-black text-[15px]">
                    {formatAddonPrice(addon)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <AppointmentSummaryFooter
            service={service}
            selectedAddOns={selectedAddOns}
            onContinue={() => onContinue(selectedAddOns)}
          />
        </div>
      </div>
    </div>
  );
}
