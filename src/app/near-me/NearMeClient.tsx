"use client";

import React from 'react';
import { mockPlaces } from '@/lib/mock-data';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const MapComponent = dynamic(() =>
  import('@/components/organisms/MapComponent').then(mod => mod.MapComponent),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

export function NearMeClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const places = category
    ? mockPlaces.filter(p => p.category === category)
    : mockPlaces;

  return (<MapComponent places={places} />);
}
