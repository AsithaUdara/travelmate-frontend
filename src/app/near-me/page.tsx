"use client";

import React, { useState } from 'react';
import { ExploreSidebar } from '@/components/organisms/ExploreSidebar';
// import { MapComponent } from '@/components/organisms/MapComponent'; // <-- REMOVE this direct import
import { Place, mockPlaces } from '@/lib/mock-data';
import dynamic from 'next/dynamic'; // <-- ADD this import

// Dynamically import the MapComponent with SSR turned off
const MapComponent = dynamic(() =>
  import('@/components/organisms/MapComponent').then(mod => mod.MapComponent),
  { ssr: false }
);


export default function NearMePage() {
  const [places, setPlaces] = useState<Place[]>(mockPlaces);

  const handleCategorySelect = (category: string | null) => {
    if (category === null) {
      setPlaces(mockPlaces);
    } else {
      const filteredPlaces = mockPlaces.filter(p => p.category === category);
      setPlaces(filteredPlaces);
    }
  };

  return (
    <div className="flex h-screen pt-24">
      <ExploreSidebar onCategorySelect={handleCategorySelect} />
      <main className="flex-1">
        <MapComponent places={places} />
      </main>
    </div>
  );
}