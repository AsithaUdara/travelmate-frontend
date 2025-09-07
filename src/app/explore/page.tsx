"use client";

import React, { useState, Suspense } from 'react';
import { mockPlaces } from '@/lib/mock-data';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ResultsPane } from '@/components/explore/ResultsPane';

const ExploreMap = dynamic(() =>
  import('@/components/explore/ExploreMap').then(mod => mod.ExploreMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

function ExplorePageContent() {
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') || 'sights') as 'stay' | 'activity' | 'eat' | 'flight' | 'sights';

  const filteredPlaces = mockPlaces.filter(p => p.category === category);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden">
      <ResultsPane 
        places={filteredPlaces} 
        onPlaceHover={setHoveredPlaceId}
        hoveredPlaceId={hoveredPlaceId}
        category={category}
      />
      <div className="hidden lg:block h-full">
        <ExploreMap 
          places={filteredPlaces} 
          hoveredPlaceId={hoveredPlaceId}
          onMarkerHover={setHoveredPlaceId}
          category={category}
        />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-slate-100 flex items-center justify-center">Loading Trip Data...</div>}>
      <ExplorePageContent />
    </Suspense>
  );
}

// Avoid prerendering to prevent build error with useSearchParams during static export
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;