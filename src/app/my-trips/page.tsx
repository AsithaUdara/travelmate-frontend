"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon, MapPinIcon, CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getMyTrips, SavedTrip } from '@/services/trips';
import { format } from 'date-fns';
import { toast } from 'sonner';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const TripCard = ({ trip }: { trip: SavedTrip }) => {
  const router = useRouter();
  
  return (
    <div className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={trip.coverImage || DEFAULT_COVER}
          alt={trip.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold">{trip.name}</h3>
          <div className="flex items-center gap-4 text-sm opacity-90 mt-1">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{trip.days.length} days</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <p>Created {format(new Date(trip.createdAt), 'MMM d, yyyy')}</p>
            <p className="mt-1">{trip.days.length} locations • {trip.days.reduce((acc, day) => acc + day.activities.length, 0)} activities</p>
          </div>
          <Button
            onClick={() => router.push(`/trip/${trip._id}`)}
            className="rounded-full flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            View Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function MyTripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const myTrips = await getMyTrips();
        setTrips(myTrips);
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to load your trips');
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col bg-slate-50">
        <ExploreHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col bg-slate-50">
        <ExploreHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load trips</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ExploreHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Trips</h1>
            <p className="text-slate-600 mt-2">
              {trips.length === 0 
                ? "Start planning your first adventure" 
                : `${trips.length} ${trips.length === 1 ? 'trip' : 'trips'} planned`
              }
            </p>
          </div>
          <Link href="/plan">
            <Button size="lg" className="rounded-full flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Plan New Trip
            </Button>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <MapPinIcon className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No trips yet</h3>
              <p className="text-slate-600 mb-8">
                Ready to explore Sri Lanka? Start planning your perfect adventure today.
              </p>
              <Link href="/plan">
                <Button size="lg" className="rounded-full flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Plan Your First Trip
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}