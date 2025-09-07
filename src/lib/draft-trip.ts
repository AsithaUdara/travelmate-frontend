"use client";

import { Trip, mockTrip } from "./trip-data";
import { useEffect, useState } from "react";

const DRAFT_KEY = 'tm_draft_trip';

export function loadDraftTrip(): Trip {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null;
    if (raw) return JSON.parse(raw) as Trip;
  } catch {}
  return { ...mockTrip, name: "Udara's Sri Lankan Adventure" };
}

export function saveDraftTrip(trip: Trip) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(trip));
    }
  } catch {}
}

export function clearDraftTrip() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRAFT_KEY);
    }
  } catch {}
}

export function useDraftTrip() {
  const [trip, setTrip] = useState<Trip>(loadDraftTrip());
  useEffect(() => { saveDraftTrip(trip); }, [trip]);
  return [trip, setTrip] as const;
}
