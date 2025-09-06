export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number;
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
  aiMessage?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
}

export const mockTrip: Trip = {
  id: 'sarah-trip-1',
  name: "Sarah's Sri Lankan Adventure",
  startDate: "2025-10-05",
  endDate: "2025-10-15",
  days: [
    { day: 1, date: "2025-10-05", location: "Colombo", title: "Arrival & City Exploration", activities: [{id: 'act-c1', name: 'Check into Hotel', type: 'Accommodation', duration: 1, cost: 0}], latitude: 6.9271, longitude: 79.8612, aiMessage: "We've found some great spots for you to explore in Colombo!" },
    { day: 2, date: "2025-10-06", location: "Colombo", title: "Cultural Immersion", activities: [], latitude: 6.9271, longitude: 79.8612, aiMessage: "Discover more of Colombo's culture with these suggestions." },
    { day: 3, date: "2025-10-07", location: "Kandy", title: "Travel to the Hill Capital", activities: [{id: 'act-k1', name: 'Travel to Kandy', type: 'Travel', duration: 3, cost: 0}], latitude: 7.2906, longitude: 80.6337 },
    { day: 4, date: "2025-10-08", location: "Kandy", title: "Sacred Sites & Gardens", activities: [{id: 'act-k2', name: 'Temple of the Tooth Relic', type: 'Cultural', duration: 3, cost: 2000}], latitude: 7.2906, longitude: 80.6337, aiMessage: "Enhance your stay in Kandy with these unique experiences." },
    { day: 5, date: "2025-10-09", location: "Ella", title: "Journey to the Highlands", activities: [{id: 'act-e1', name: 'Travel to Ella', type: 'Travel', duration: 6, cost: 0}], latitude: 6.8667, longitude: 81.0466 },
    { day: 6, date: "2025-10-10", location: "Ella", title: "Hiking & Views", activities: [{id: 'act-e2', name: 'Hike Little Adam\'s Peak', type: 'Hiking', duration: 3, cost: 0}], latitude: 6.8667, longitude: 81.0466, aiMessage: "Ella is famous for its views. Here are some top spots." },
    { day: 7, date: "2025-10-11", location: "Yala", title: "Safari Adventure", activities: [{id: 'act-y1', name: 'Travel to Yala', type: 'Travel', duration: 4, cost: 0}], latitude: 6.3667, longitude: 81.4667 },
    { day: 8, date: "2025-10-12", location: "Yala", title: "Morning Game Drive", activities: [{id: 'act-y2', name: 'Morning Safari', type: 'Wildlife', duration: 4, cost: 15000}], latitude: 6.3667, longitude: 81.4667 },
    { day: 9, date: "2025-10-13", location: "Mirissa", title: "Coastal Relaxation", activities: [{id: 'act-m1', name: 'Travel to Mirissa', type: 'Travel', duration: 3, cost: 0}], latitude: 5.9482, longitude: 80.4548 },
    { day: 10, date: "2025-10-14", location: "Mirissa", title: "Whales & Departure Prep", activities: [], latitude: 5.9482, longitude: 80.4548, aiMessage: "Don't miss the gentle giants of the ocean!" },
  ]
};

export const searchablePlaces = [
  { id: 'place-sigiriya', name: 'Sigiriya', type: 'UNESCO Site', latitude: 7.9575, longitude: 80.7600 },
  { id: 'place-galle', name: 'Galle', type: 'Coastal City', latitude: 6.0535, longitude: 80.2210 },
  { id: 'place-nuwara-eliya', name: 'Nuwara Eliya', type: 'Hill Station', latitude: 6.9497, longitude: 80.7891 },
  { id: 'place-anuradhapura', name: 'Anuradhapura', type: 'Ancient City', latitude: 8.3114, longitude: 80.4037 },
];

export const mockSuggestions: Record<string, { stays?: Activity[], activities?: Activity[], eats?: Activity[] }> = {
  "Colombo": {
    stays: [ { id: 'sug-cs1', name: 'Galle Face Hotel', type: '5-Star Hotel', duration: 0, cost: 125000 }, { id: 'sug-cs2', name: 'Cinnamon Grand', type: 'City Hotel', duration: 0, cost: 110000 }, ],
    activities: [ { id: 'sug-ca1', name: 'National Museum of Colombo', type: 'Museum', duration: 3, cost: 1500 }, { id: 'sug-ca2', name: 'Viharamahadevi Park', type: 'Leisure', duration: 2, cost: 0 }, ],
    eats: [ { id: 'sug-ce1', name: 'Ministry of Crab', type: 'Seafood', duration: 2, cost: 20000 }, { id: 'sug-ce2', name: 'Upali\'s by Nawaloka', type: 'Sri Lankan Cuisine', duration: 1.5, cost: 5000 }, ]
  },
  "Kandy": {
    stays: [ { id: 'sug-ks1', name: 'The Grand Kandyan', type: 'Luxury Hotel', duration: 0, cost: 95000 }, ],
    activities: [ { id: 'sug-ka1', name: 'Kandy Lake Walk', type: 'Sightseeing', duration: 1.5, cost: 0 }, { id: 'sug-ka2', name: 'Udawatta Kele Sanctuary', type: 'Nature', duration: 3, cost: 650 }, { id: 'act-k3', name: 'Peradeniya Botanical Gardens', type: 'Nature', duration: 4, cost: 2000 }, ],
  },
  "Ella": {
    activities: [ { id: 'sug-ea1', name: 'Ravana Falls', type: 'Nature', duration: 1, cost: 0 }, { id: 'sug-ea2', name: 'Ella Spice Garden Tour', type: 'Local Experience', duration: 1.5, cost: 1000 }, ],
  }
};

// --- THIS IS THE MISSING PIECE ---
export interface TransportOption {
  id: string;
  type: 'Scenic Train' | 'Private Car' | 'Public Bus';
  time: number;
  cost: number;
  comfort: 1 | 2 | 3 | 4 | 5;
  isRecommended: boolean;
  details: string;
}

export const mockTransportOptions: Record<string, TransportOption[]> = {
  "Kandy-Ella": [
    { id: 'tr-ke-1', type: 'Scenic Train', time: 6.5, cost: 3000, comfort: 3, isRecommended: true, details: "The 8:47 AM train, famous for its breathtaking views of tea plantations. A must-do experience." },
    { id: 'tr-ke-2', type: 'Private Car', time: 4, cost: 15000, comfort: 5, isRecommended: false, details: "The fastest and most comfortable option, with door-to-door service and A/C." },
    { id: 'tr-ke-3', type: 'Public Bus', time: 8, cost: 800, comfort: 2, isRecommended: false, details: "The most budget-friendly choice, offering a truly local experience." },
  ],
  "Colombo-Kandy": [
    { id: 'tr-ck-1', type: 'Scenic Train', time: 3, cost: 1500, comfort: 4, isRecommended: true, details: "A comfortable and scenic journey that avoids road traffic. Great value." },
    { id: 'tr-ck-2', type: 'Private Car', time: 3.5, cost: 12000, comfort: 5, isRecommended: false, details: "Flexible and comfortable, but can be affected by traffic conditions." },
  ],
  "Yala-Mirissa": [
    { id: 'tr-ym-1', type: 'Private Car', time: 3, cost: 6000, comfort: 5, isRecommended: true, details: "The most direct and convenient way to travel along the southern coast." },
    { id: 'tr-ym-2', type: 'Public Bus', time: 4.5, cost: 500, comfort: 2, isRecommended: false, details: "An adventurous and extremely cheap option for flexible travelers." },
  ]
};