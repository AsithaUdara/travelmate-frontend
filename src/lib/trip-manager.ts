"use client";

import { Trip } from "./trip-data";

const TRIPS_STORAGE_KEY = 'travelmate_trips';

// Migrate older trips with placeholder names to richer, definitive details
function migrateTrip(oldTrip: Trip): Trip {
  let changed = false;

  const days = oldTrip.days.map((d) => {
    // Clone activities to avoid mutating originals
    const activities = d.activities.map((a) => ({ ...a }));

    // Day 1 Accommodation upgrade (Colombo)
    if (d.day === 1 && d.location === 'Colombo') {
      const accIdx = activities.findIndex((a) => a.type === 'Accommodation');
      if (accIdx > -1) {
        const acc = activities[accIdx];
        if (acc.name === 'Check into Hotel' || !acc.bookingDetails?.reference) {
          activities[accIdx] = {
            ...acc,
            name: 'Cinnamon Grand Colombo',
            duration: 0,
            cost: 110000,
            bookingDetails: { ...(acc.bookingDetails || {}), reference: 'BK-12345' },
          };
          changed = true;
        }
      }
    }

  // Day 3 Travel upgrade (to Kandy)
    if (d.day === 3 && d.location === 'Kandy') {
      const trIdx = activities.findIndex((a) => a.type === 'Travel');
      if (trIdx > -1) {
        const tr = activities[trIdx];
    if (tr.name === 'Travel to Kandy' || tr.name === 'Intercity Express Train' || !tr.bookingDetails?.provider) {
          activities[trIdx] = {
            ...tr,
      name: 'Udarata Manike (6:00 AM) Train',
            duration: 2.5,
            cost: 2000,
            bookingDetails: { ...(tr.bookingDetails || {}), provider: 'Sri Lanka Railways', contact: '+94112432908' },
          };
          changed = true;
        }
      }
    }

    return changed ? { ...d, activities } : d;
  });

  return changed ? { ...oldTrip, days } : oldTrip;
}

// Function to save a trip
export const saveTrip = (tripToSave: Trip): void => {
  try {
    // Avoid touching localStorage on the server
    if (typeof window === 'undefined') return;

    const existingTrips = getAllTrips();
    // Check if a trip with this ID already exists to prevent duplicates
    const tripIndex = existingTrips.findIndex(trip => trip.id === tripToSave.id);

    if (tripIndex > -1) {
      // Update existing trip
      existingTrips[tripIndex] = tripToSave;
    } else {
      // Add new trip
      existingTrips.push(tripToSave);
    }

    window.localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(existingTrips));
  } catch (error) {
    console.error("Failed to save trip:", error);
  }
};

// Function to get all saved trips
export const getAllTrips = (): Trip[] => {
  try {
    if (typeof window === 'undefined') return [];
    const tripsJson = window.localStorage.getItem(TRIPS_STORAGE_KEY);
    return tripsJson ? JSON.parse(tripsJson) : [];
  } catch (error) {
    console.error("Failed to get all trips:", error);
    return [];
  }
};

// Function to get a single trip by its ID
export const getTripById = (tripId: string): Trip | undefined => {
  try {
    const allTrips = getAllTrips();
    const found = allTrips.find(trip => trip.id === tripId);
    if (!found) return undefined;
    const migrated = migrateTrip(found);
    if (JSON.stringify(migrated) !== JSON.stringify(found)) {
      // Persist migration silently
      saveTrip(migrated);
    }
    return migrated;
  } catch (error) {
    console.error("Failed to get trip by ID:", error);
    return undefined;
  }
};
