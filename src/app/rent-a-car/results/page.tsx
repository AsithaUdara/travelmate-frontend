"use client";

import React, { useMemo, useState } from 'react';
import { mockVehicles, Vehicle } from '@/lib/trip-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StarIcon, MapPinIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { useSearchParams, useRouter } from 'next/navigation';

const ResultCard = ({ v, onBook }: { v: Vehicle; onBook: (v: Vehicle) => void }) => (
  <div className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
    <div className="flex gap-4 p-3">
      <div className="relative w-40 h-28 flex-shrink-0 rounded-lg overflow-hidden">
        <Image src={v.image} alt={v.name} fill style={{ objectFit: 'cover' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{v.provider}</span>
              {typeof v.distanceKm === 'number' && (
                <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{v.distanceKm.toFixed(1)} km</span>
              )}
            </div>
            <h3 className="font-bold text-lg truncate">{v.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <span>{v.capacity} seats</span>
              <span>• {v.fuel}</span>
              <span>• {v.transmission}</span>
              {v.driverAvailable && <span className="text-green-700 font-medium">• Driver Available</span>}
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm font-semibold bg-green-100 text-green-800 w-fit px-2 py-0.5 rounded-full">
              {v.rating}
              <StarIcon className="h-4 w-4" />
              <span className="font-normal text-slate-600">({v.reviews} reviews)</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {v.features?.map((f: string) => (
                <span key={f} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{f}</span>
              ))}
            </div>
          </div>
          <div className="text-right flex flex-col items-end justify-between">
            <div>
              <div className="text-slate-500 text-xs">Estimated Total</div>
              <div className="text-green-700 font-extrabold text-xl">LKR {v.pricePerDay.toLocaleString()}</div>
            </div>
            <Button onClick={() => onBook(v)} className="rounded-full font-semibold mt-4">Book Now</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function RentResultsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'distance' | 'rating'>('recommended');
  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [type, setType] = useState<'All' | 'Car' | 'Van' | 'Tuk-tuk'>('All');

  const filtered = useMemo(() => {
    let list = mockVehicles.filter(v => v.pricePerDay >= minPrice && v.pricePerDay <= maxPrice);
    if (type !== 'All') list = list.filter(v => v.type === type);
    switch (sortBy) {
      case 'price-asc': list.sort((a,b)=>a.pricePerDay-b.pricePerDay); break;
      case 'price-desc': list.sort((a,b)=>b.pricePerDay-a.pricePerDay); break;
      case 'distance': list.sort((a,b)=>(a.distanceKm??0)-(b.distanceKm??0)); break;
      case 'rating': list.sort((a,b)=>(b.rating??0)-(a.rating??0)); break;
      case 'recommended': default: list.sort((a,b)=> (b.rating??0)-(a.rating??0) || (b.reviews??0)-(a.reviews??0));
    }
    return list;
  }, [sortBy, minPrice, maxPrice, type]);

  const onBook = (v: Vehicle) => {
    const query = new URLSearchParams({ id: v.id }).toString();
    router.push(`/rent-a-car/book?${query}`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold">Available Vehicles</h1>
          <div className="mt-4 grid grid-cols-12 gap-4">
            {/* Filters */}
            <aside className="col-span-3">
              <div className="p-4 bg-white border rounded-xl">
                <div className="font-semibold mb-3 flex items-center gap-2"><FunnelIcon className="h-5 w-5"/>Filters</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-slate-600 mb-1">Vehicle Type</label>
                    <select className="w-full border rounded-md p-2" value={type} onChange={e=>setType(e.target.value as any)}>
                      <option>All</option>
                      <option>Car</option>
                      <option>Van</option>
                      <option>Tuk-tuk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Price Range (LKR)</label>
                    <div className="flex items-center gap-2">
                      <input className="w-1/2 border rounded-md p-2" type="number" value={minPrice} onChange={e=>setMinPrice(Number(e.target.value))} />
                      <span className="text-slate-500">-</span>
                      <input className="w-1/2 border rounded-md p-2" type="number" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            {/* Results */}
            <section className="col-span-9">
              <div className="flex items-center justify-between mb-3">
                <div className="text-slate-600 text-sm">{filtered.length} Vehicles Available</div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">Sort by:</label>
                  <select className="border rounded-md p-2" value={sortBy} onChange={e=>setSortBy(e.target.value as any)}>
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(v => (
                  <ResultCard key={v.id} v={v} onBook={onBook} />
                ))}
              </div>
            </section>
          </div>
    </div>
  );
}
