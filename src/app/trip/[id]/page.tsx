"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import type { Trip, ItineraryDay } from '@/lib/trip-data';
import { getTripById, saveTrip } from '@/lib/trip-manager';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import dynamic from 'next/dynamic';
import { ItineraryTimeline } from '@/components/trip-detail/ItineraryTimeline';
import { DetailPanel } from '@/components/trip-detail/DetailPanel';
import { DayDetailPanel } from '@/components/trip-detail/DayDetailPanel';
import { toast } from 'sonner';

export type SelectedItem = { type: 'day'; data: ItineraryDay };

const DetailMap = dynamic(() => import('@/components/trip-detail/DetailMap').then(m => m.DetailMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" />,
});

function TripDetailPageContent() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  useEffect(() => {
    const savedTrip = getTripById(tripId);
    if (savedTrip) setTrip(savedTrip);
  }, [tripId]);

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
    toast.success('Itinerary updated!');
    // Refresh active day to avoid stale panel data
    if (selectedItem?.type === 'day') {
      const updatedDay = updatedTrip.days.find(d => d.day === selectedItem.data.day);
      if (updatedDay) setSelectedItem({ type: 'day', data: updatedDay });
    }
  };

  if (!trip) {
    return (
      <div className="h-screen w-screen flex flex-col bg-slate-50">
        <ExploreHeader />
        <div className="flex-1 flex items-center justify-center">Loading Trip...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50">
      <ExploreHeader />
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Main Itinerary Timeline */}
        <div className="col-span-4 overflow-y-auto p-6 border-r bg-white">
          <ItineraryTimeline trip={trip} onDaySelect={(day) => setSelectedItem({ type: 'day', data: day })} />
        </div>

        {/* Map and Detail Panel Area */}
        <div className="col-span-8 relative">
          <div className="absolute inset-0 z-0">
            <DetailMap trip={trip} activeDay={selectedItem?.type === 'day' ? selectedItem.data : null} />
          </div>

          <DetailPanel
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            title={selectedItem?.type === 'day' ? `Day ${selectedItem.data.day}: ${selectedItem.data.location}` : 'Details'}
          >
            {selectedItem?.type === 'day' && (
              <DayDetailPanel key={trip.id + selectedItem.data.day} day={selectedItem.data} trip={trip} setTrip={handleUpdateTrip} />
            )}
          </DetailPanel>
        </div>
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
  <TripDetailPageContent />
    </Suspense>
  );
}