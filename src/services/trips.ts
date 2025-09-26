"use client";

import { Trip } from '@/lib/trip-data';
import { getAuth } from 'firebase/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface CreateTripRequest {
  name: string;
  startDate: string;
  endDate: string;
  days: any[];
  coverImage?: string;
  interests?: string[];
}

export interface SavedTrip extends Trip {
  _id: string;
  user: string;
  createdAt: string;
}

function coerceDate(input?: string): string {
  if (!input) return new Date().toISOString().slice(0, 10);
  // Accept YYYY-MM-DD or ISO; normalize to YYYY-MM-DD
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

function sanitizeTripPayload(trip: Trip, coverImage?: string): CreateTripRequest {
  // Ensure day/activity required fields exist to satisfy backend schema
  const days = (trip.days || []).map((d, i) => {
    const safeActivities = (d.activities || []).map((a, j) => ({
      id: a?.id || `act-${i + 1}-${j + 1}-${Date.now()}`,
      name: a?.name || 'Activity',
      type: a?.type,
      duration: typeof a?.duration === 'number' ? a.duration : undefined,
      cost: typeof a?.cost === 'number' ? a.cost : undefined,
      bookingDetails: a?.bookingDetails,
    }));
    return {
      day: typeof d?.day === 'number' ? d.day : i + 1,
      date: coerceDate(d?.date),
      location: d?.location || 'Unknown',
      title: d?.title || '',
      activities: safeActivities,
      latitude: typeof d?.latitude === 'number' ? d.latitude : undefined,
      longitude: typeof d?.longitude === 'number' ? d.longitude : undefined,
      aiMessage: d?.aiMessage,
    } as any;
  });

  const startDate = coerceDate(trip.startDate || days[0]?.date);
  const endDate = coerceDate(trip.endDate || days[days.length - 1]?.date || startDate);

  return {
    name: trip.name || 'My Trip',
    startDate,
    endDate,
    days,
    coverImage,
    interests: trip.interests,
  };
}

async function ensureBackendUser(): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  // Best-effort upsert of the user in our backend DB so protected routes succeed
  try {
    await fetch(`${API_BASE}/api/auth/social-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseUid: user.uid,
        email: user.email,
        name: user.displayName || user.email || 'TravelMate User',
      }),
    });
  } catch {
    // non-fatal
  }
}

export async function saveTrip(trip: Trip, coverImage?: string): Promise<SavedTrip> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('You must be logged in to save a trip');
  }

  const token = await user.getIdToken();
  
  const defaultCover = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const tripData: CreateTripRequest = sanitizeTripPayload(trip, coverImage || defaultCover);
  
  // Helper to perform the POST
  const postTrip = async () => {
    const res = await fetch(`${API_BASE}/api/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });
    return res;
  };

  // First attempt
  let response = await postTrip();

  // If backend says the user record is missing in DB, upsert and retry once
  if (!response.ok && response.status === 401) {
    try {
      const err = await response.clone().json().catch(() => ({}));
      if (typeof err?.message === 'string' && err.message.toLowerCase().includes('user not found')) {
        await ensureBackendUser();
        response = await postTrip();
      }
    } catch {
      // fall through
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const details = Array.isArray(error?.details) ? `: ${error.details.join('; ')}` : '';
    throw new Error((error.message || `Failed to save trip (HTTP ${response.status})`) + details);
  }

  return response.json();
}

export async function getMyTrips(): Promise<SavedTrip[]> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('You must be logged in to view your trips');
  }

  const token = await user.getIdToken();
  
  const response = await fetch(`${API_BASE}/api/trips/mytrips`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch trips');
  }

  return response.json();
}

export async function getTripById(tripId: string): Promise<SavedTrip> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('You must be logged in to view this trip');
  }

  const token = await user.getIdToken();
  
  const response = await fetch(`${API_BASE}/api/trips/${tripId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch trip');
  }

  return response.json();
}

export async function updateTripById(tripId: string, payload: Partial<CreateTripRequest>): Promise<SavedTrip> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to update this trip');
  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE}/api/trips/${tripId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const details = Array.isArray(error?.details) ? `: ${error.details.join('; ')}` : '';
    throw new Error((error.message || `Failed to update trip (HTTP ${response.status})`) + details);
  }
  return response.json();
}