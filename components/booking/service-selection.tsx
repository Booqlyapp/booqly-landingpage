'use client';

import { useState } from 'react';
import { Marketplace, Service } from '@/lib/types';
import PoweredBy from './powered-by';

interface ServiceSelectionProps {
  marketplace: Marketplace;
  selectedServices: Service[];
  onSelectService: (service: Service) => void;
}

export default function ServiceSelection({ marketplace, selectedServices, onSelectService }: ServiceSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Use selectedServices from cart instead of all marketplace services
  const availableServices = selectedServices.length > 0 ? selectedServices : marketplace.services;

  // Get unique categories from selected services
  const categories = ['all', ...new Set(availableServices.map(s => s.category))];

  const filteredServices = selectedCategory === 'all'
    ? availableServices
    : availableServices.filter(s => s.category === selectedCategory);

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-2">SELECT A SERVICE</h2>
      <p className="text-gray-600 mb-8">Choose which service you&apos;d like to book first ({selectedServices.length} services in cart)</p>

      {/* Category Filter */}
      {categories.length > 2 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Select a Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectService(service)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">{service.name}</h3>
                {service.requireDeposit && service.depositAmount && (
                  <p className="text-xs text-gray-500 mb-2">
                    ${Number(service.depositAmount).toFixed(2)} deposit required
                  </p>
                )}
              </div>
              <button className="px-6 py-2 border-2 border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors">
                Select
              </button>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>

            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-bold text-black">${Number(service.price).toFixed(2)}</span>
              </div>
              <div className="text-gray-600">
                {service.duration} min
              </div>
            </div>

            {/* Payment Options */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded">Klarna</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Affirm</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Afterpay</span>
            </div>

            {service.requireDeposit && service.depositAmount && (
              <p className="mt-2 text-xs text-gray-600">
                As low as ${(Number(service.depositAmount) / 4).toFixed(2)} / month or interest-free.{' '}
                <button className="text-blue-600 underline">See plans</button>
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No services available in this category.</p>
        </div>
      )}

      {/* Powered By Booqly */}
      <PoweredBy />
    </div>
  );
}
