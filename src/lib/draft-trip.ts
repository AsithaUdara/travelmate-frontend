"use client";

import { Trip, mockTrip } from "./trip-data";
import { useEffect, useMemo, useState } from "react";
import { auth } from "./firbase";

const DRAFT_KEY = 'tm_draft_trip';

export function loadDraftTrip(): Trip {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null;
    if (raw) return JSON.parse(raw) as Trip;
  } catch {}
  // Personalize the default trip name with the logged-in user's name/email if available
  const user = auth?.currentUser;
  const who = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Your');
  const pretty = who.endsWith("'s") ? who : `${who}'s`;
  return { ...mockTrip, name: `${pretty} Sri Lankan Adventure` };
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
  // Initialize with a generic draft first
  const [trip, setTrip] = useState<Trip>(loadDraftTrip());

  // When auth state is ready on the client, personalize name if we still have the placeholder
  useEffect(() => {
    const u = auth?.currentUser;
    if (!u) return;
    const who = u.displayName || (u.email ? u.email.split('@')[0] : null);
    if (!who) return;
    const pretty = who.endsWith("'s") ? who : `${who}'s`;
    setTrip((prev) => {
      // If the previous name looks like the old hard-coded default or generic "Your's" one, replace it
      const looksDefault = prev.name.includes("Sri Lankan Adventure");
      return looksDefault ? { ...prev, name: `${pretty} Sri Lankan Adventure` } : prev;
    });
  }, []);

  useEffect(() => { saveDraftTrip(trip); }, [trip]);
  return [trip, setTrip] as const;
}
