"use client";

import { useState, useCallback } from 'react';
import { Trip } from './trip-data';
import { getTripById, SavedTrip, updateTripById } from '@/services/trips';
import { toast } from 'sonner';

// This is a custom hook to manage fetching and updating a single trip
export const useTrip = (tripId: string) => {
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the trip from the backend
  const fetchTrip = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTripById(tripId);
      setTrip(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [tripId]);
  
  // Function to update the trip optimistically
  const updateTrip = useCallback(async (updatedTrip: SavedTrip) => {
    const prev = trip;
    setTrip(updatedTrip); // Optimistic update for a snappy UI
    try {
      await updateTripById(updatedTrip._id, {
        name: updatedTrip.name,
        startDate: updatedTrip.startDate,
        endDate: updatedTrip.endDate,
        days: updatedTrip.days as any,
        coverImage: updatedTrip.coverImage,
        interests: (updatedTrip as any).interests,
      });
      toast.success('Itinerary updated');
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
      // Revert to server state
      if (prev) setTrip(prev);
      fetchTrip();
    }
  }, [fetchTrip, trip]);

  return { trip, loading, error, fetchTrip, setTrip: updateTrip };
};