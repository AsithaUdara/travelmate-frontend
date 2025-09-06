export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number; // in hours
  cost: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  title: string;
  activities: Activity[];
  latitude: number;
  longitude: number;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
}

// This is the AI-generated trip for Sarah's 10-day adventure
export const mockTrip: Trip = {
  id: 'sarah-trip-1',
  name: "Sarah's Sri Lankan Adventure",
  startDate: "2025-10-05",
  endDate: "2025-10-15",
  days: [
    { day: 1, date: "2025-10-05", location: "Colombo", title: "Arrival & City Exploration", activities: [{id: 'act-c1', name: 'Check into Hotel', type: 'Accommodation', duration: 1, cost: 0}, {id: 'act-c2', name: 'Galle Face Green Sunset', type: 'Sightseeing', duration: 2, cost: 0}], latitude: 6.9271, longitude: 79.8612 },
    { day: 2, date: "2025-10-06", location: "Colombo", title: "Cultural Immersion", activities: [{id: 'act-c3', name: 'Gangaramaya Temple', type: 'Cultural', duration: 3, cost: 500}, {id: 'act-c4', name: 'Pettah Market Tour', type: 'Local Experience', duration: 3, cost: 200}], latitude: 6.9271, longitude: 79.8612 },
    { day: 3, date: "2025-10-07", location: "Kandy", title: "Travel to the Hill Capital", activities: [{id: 'act-k1', name: 'Scenic Train to Kandy', type: 'Travel', duration: 3, cost: 1500}], latitude: 7.2906, longitude: 80.6337 },
    { day: 4, date: "2025-10-08", location: "Kandy", title: "Sacred Sites & Gardens", activities: [{id: 'act-k2', name: 'Temple of the Tooth Relic', type: 'Cultural', duration: 3, cost: 2000}, {id: 'act-k3', name: 'Peradeniya Botanical Gardens', type: 'Nature', duration: 4, cost: 2000}], latitude: 7.2906, longitude: 80.6337 },
    { day: 5, date: "2025-10-09", location: "Ella", title: "Journey to the Highlands", activities: [{id: 'act-e1', name: 'Iconic Train to Ella', type: 'Travel', duration: 6, cost: 3000}], latitude: 6.8667, longitude: 81.0466 },
    { day: 6, date: "2025-10-10", location: "Ella", title: "Hiking & Views", activities: [{id: 'act-e2', name: 'Hike Little Adam\'s Peak', type: 'Hiking', duration: 3, cost: 0}, {id: 'act-e3', name: 'Nine Arch Bridge Visit', type: 'Sightseeing', duration: 2, cost: 0}], latitude: 6.8667, longitude: 81.0466 },
    { day: 7, date: "2025-10-11", location: "Yala", title: "Safari Adventure", activities: [{id: 'act-y1', name: 'Travel to Yala', type: 'Travel', duration: 4, cost: 8000}, {id: 'act-y2', name: 'Evening Safari in Yala National Park', type: 'Wildlife', duration: 4, cost: 15000}], latitude: 6.3667, longitude: 81.4667 },
    { day: 8, date: "2025-10-12", location: "Yala", title: "Morning Game Drive", activities: [{id: 'act-y3', name: 'Morning Safari', type: 'Wildlife', duration: 4, cost: 15000}], latitude: 6.3667, longitude: 81.4667 },
    { day: 9, date: "2025-10-13", location: "Mirissa", title: "Coastal Relaxation", activities: [{id: 'act-m1', name: 'Travel to Mirissa', type: 'Travel', duration: 3, cost: 6000}, {id: 'act-m2', name: 'Relax at Mirissa Beach', type: 'Leisure', duration: 5, cost: 0}], latitude: 5.9482, longitude: 80.4548 },
    { day: 10, date: "2025-10-14", location: "Mirissa", title: "Whales & Departure Prep", activities: [{id: 'act-m3', name: 'Whale Watching Tour', type: 'Activity', duration: 4, cost: 12000}], latitude: 5.9482, longitude: 80.4548 },
  ]
};

export const searchablePlaces = [
  { id: 'place-sigiriya', name: 'Sigiriya', type: 'UNESCO Site', latitude: 7.9575, longitude: 80.7600 },
  { id: 'place-galle', name: 'Galle', type: 'Coastal City', latitude: 6.0535, longitude: 80.2210 },
  { id: 'place-nuwara-eliya', name: 'Nuwara Eliya', type: 'Hill Station', latitude: 6.9497, longitude: 80.7891 },
  { id: 'place-anuradhapura', name: 'Anuradhapura', type: 'Ancient City', latitude: 8.3114, longitude: 80.4037 },
];