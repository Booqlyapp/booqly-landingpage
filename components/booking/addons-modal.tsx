'use client';

import { useState } from 'react';
import { Service, ServiceAddOn } from '@/lib/types';

interface AddOnsModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAddOns: ServiceAddOn[]) => void;
}

export default function AddOnsModal({ service, isOpen, onClose, onConfirm }: AddOnsModalProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<ServiceAddOn[]>([]);

  if (!isOpen) return null;

  const activeAddOns = service.addOns?.filter(addon => addon.isActive) || [];

  if (activeAddOns.length === 0) {
    // No addons, proceed directly
    onConfirm([]);
    return null;
  }

  const toggleAddOn = (addon: ServiceAddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const isSelected = (addonId: string) => {
    return selectedAddOns.some(a => a.id === addonId);
  };

  const totalAddOnsPrice = selectedAddOns.reduce((sum, addon) => {
    return sum + Number(addon.price);
  }, 0);

  const totalPrice = Number(service.price) + totalAddOnsPrice;

  const handleConfirm = () => {
    onConfirm(selectedAddOns);
    setSelectedAddOns([]);
    onClose();
  };

  const handleSkip = () => {
    onConfirm([]);
    setSelectedAddOns([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add-ons</h2>
              <p className="text-gray-600 mt-1">Enhance your {service.name} experience</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Add-ons List */}
        <div className="p-6 space-y-4">
          {activeAddOns.map((addon) => (
            <label
              key={addon.id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected(addon.id)
                  ? 'border-[#759CC9] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isSelected(addon.id)}
                  onChange={() => toggleAddOn(addon)}
                  className="w-5 h-5 text-[#759CC9] border-gray-300 rounded focus:ring-[#759CC9]"
                />
                <div>
                  <p className="font-semibold text-gray-900">{addon.title}</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">${Number(addon.price).toFixed(2)}</p>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-3xl">
          <div className="mb-4">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Service</span>
              <span>${Number(service.price).toFixed(2)}</span>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Add-ons ({selectedAddOns.length})</span>
                <span>${totalAddOnsPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 px-6 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-6 rounded-2xl font-semibold text-white bg-[#759CC9] hover:bg-[#6a8bb8] transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
