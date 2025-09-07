"use client";

import React from 'react';
import { mockVehicles } from '@/lib/trip-data';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function BookVehiclePage() {
  const params = useSearchParams();
  const id = params.get('id');
  const v = mockVehicles.find(m => m.id === id);

  if (!v) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-slate-600">Vehicle not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="bg-white border rounded-xl p-4">
              <h2 className="font-bold text-xl mb-4">Complete Your Booking</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Full Name *</label>
                  <input className="w-full border rounded-md p-2" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Phone Number *</label>
                  <input className="w-full border rounded-md p-2" placeholder="+94 77 123 4567" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Driver Language Preference</label>
                  <select className="w-full border rounded-md p-2">
                    <option>No preference</option>
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Special Requests (Optional)</label>
                  <textarea className="w-full border rounded-md p-2" rows={4} placeholder="Any special requirements or requests..." />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="bg-white border rounded-xl p-4">
              <div className="relative h-36 w-full rounded-lg overflow-hidden">
                <Image src={v.image} alt={v.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="mt-3">
                <div className="font-bold">{v.name}</div>
                <div className="text-sm text-slate-600">{v.provider}</div>
                <div className="text-xs text-slate-500 mt-1">{v.capacity} seats • {v.fuel} • {v.transmission}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {v.features?.map(f => (
                  <span key={f} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
              <div className="mt-4 border-t pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Vehicle base rate</span>
                  <span className="font-semibold">LKR {v.pricePerDay.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Driver fee</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Taxes</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between text-lg font-extrabold text-green-700 mt-2">
                  <span>Total</span>
                  <span>LKR {v.pricePerDay.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
  </div>
  );
}
