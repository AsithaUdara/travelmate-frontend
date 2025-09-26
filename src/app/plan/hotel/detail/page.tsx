"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { BookingPanel } from '@/components/plan/BookingPanel';
import type { Place } from '@/lib/mock-data';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/solid';
import { DEFAULT_HOTEL_IMAGES } from '@/config/images';

function HotelDetailPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeParam = searchParams.get('place');

  let place: Place | null = null;
  try {
    if (placeParam) {
      const json = typeof window !== 'undefined' ? atob(placeParam) : '';
      if (json) place = JSON.parse(json);
    }
  } catch (e) {
    place = null;
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2">Stay not found</h1>
          <p className="text-slate-600 mb-6">We couldn't load that accommodation. Try again from the stays list.</p>
          <button onClick={() => router.push('/plan/accommodation')} className="px-4 py-2 border rounded">Back to Stays</button>
        </div>
      </div>
    );
  }

  // ALWAYS use the default hotel image for stays per requirement
  const images = DEFAULT_HOTEL_IMAGES;

  return (
    <div className="bg-white h-full min-h-0 overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 font-semibold text-slate-800 hover:text-slate-900 mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to results
          </button>
          <h1 className="text-4xl font-bold">{place.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{place.rating}</span>
            <span className="text-slate-500">({place.reviews?.toLocaleString?.() || place.reviews} reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative">
            <Image src={images[0]} alt={place.name} fill style={{objectFit: 'cover'}} className="hover:opacity-90 transition-opacity" />
          </div>
          {images.slice(1, 5).map((src, idx) => (
            <div key={idx} className="col-span-1 row-span-1 relative">
              <Image src={src} alt={`${place.name} ${idx + 2}`} fill style={{objectFit: 'cover'}} className="hover:opacity-90 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-12 mt-12">
          <div className="col-span-7">
            <div className="pb-8 border-b">
              <h2 className="text-2xl font-semibold">About this place</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Enjoy a comfortable stay at {place.name}. This is a placeholder description; in production, pull rich content from your CMS.
              </p>
            </div>
          </div>
          <div className="col-span-5">
            <BookingPanel place={place as Place} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center p-8">Loading…</div>}>
      <HotelDetailPageInner />
    </Suspense>
  );
}
