"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ItineraryDay, Activity } from '@/lib/trip-data';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { ItineraryTimeline } from '@/components/trip-detail/ItineraryTimeline';
import { DetailPanel } from '@/components/trip-detail/DetailPanel';
import { DayDetailPanel } from '@/components/trip-detail/DayDetailPanel';
import { useTrip } from '@/lib/use-trip';

export type SelectedItem = 
  | { type: 'day'; data: ItineraryDay }
  | { type: 'accommodation'; data: Activity }
  | { type: 'travel'; data: { from: string; to: string; activity: Activity } };

const DetailMap = dynamic(() =>
  import('@/components/trip-detail/DetailMap').then(mod => mod.DetailMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

function TripDetailPageContent() {
  const params = useParams();
  const tripId = params.id as string;
  
  // Use our new hook to manage the trip data
  const { trip, loading, error, fetchTrip, setTrip } = useTrip(tripId);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  if (loading) {
    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50">
            <ExploreHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading Your Trip...</p>
              </div>
            </div>
        </div>
    );
  }
  
  if (error || !trip) {
     return (
        <div className="h-screen w-screen flex flex-col bg-slate-50">
            <ExploreHeader />
            <div className="flex-1 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-xl font-semibold text-red-600">Failed to load trip</h2>
                    <p className="text-slate-500">{error}</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50">
      <ExploreHeader />
      <div className="px-6 pt-4">
        <Button variant="ghost" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back
        </Button>
      </div>
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-4 overflow-y-auto p-6 border-r bg-white">
           <ItineraryTimeline 
              trip={trip}
              onDaySelect={(day) => setSelectedItem({ type: 'day', data: day })}
              onAccommodationSelect={(acc) => setSelectedItem({ type: 'accommodation', data: acc})}
              onTravelSelect={(leg) => setSelectedItem({ type: 'travel', data: leg })}
           />
        </div>
        
        <div className="col-span-8 relative">
           <div className="absolute inset-0 z-0">
                <DetailMap trip={trip} activeDay={selectedItem?.type === 'day' ? selectedItem.data : null} />
           </div>

           <DetailPanel 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
                title={
                    selectedItem?.type === 'day' ? `Day ${selectedItem.data.day}: ${selectedItem.data.location}` :
                    selectedItem?.type === 'accommodation' ? "Accommodation Details" :
                    "Travel Details"
                }
            >
                {selectedItem?.type === 'day' && 
                    <DayDetailPanel 
                        key={selectedItem.data.day}
                        day={selectedItem.data} 
                        trip={trip} 
                        setTrip={(updatedTrip) => setTrip({ ...trip, ...updatedTrip })} 
                    />}
                {/* We can add other panels for accommodation and travel details later */}
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