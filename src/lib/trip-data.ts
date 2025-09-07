export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number;
  cost: number;
  bookingDetails?: { // <-- NEW: Optional property for rich details
    provider?: string; // e.g., "Sri Lanka Railways"
    contact?: string; // e.g., "+94 112 432 908"
    reference?: string; // e.g., "Booking #12345"
  // Optional accommodation-specific fields
  checkIn?: string; // ISO date string
  checkOut?: string; // ISO date string
  guests?: number;
  nights?: number;
  total?: number; // total price for the stay
  };
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
    { day: 1, date: "2025-10-05", location: "Colombo", title: "Arrival & City Exploration", 
      activities: [{id: 'act-c1', name: 'Cinnamon Grand Colombo', type: 'Accommodation', duration: 0, cost: 110000, bookingDetails: { reference: "BK-12345" }}], 
      latitude: 6.9271, longitude: 79.8612, aiMessage: "We've found some great spots for you to explore in Colombo!" },
    { day: 2, date: "2025-10-06", location: "Colombo", title: "Cultural Immersion", activities: [], latitude: 6.9271, longitude: 79.8612, aiMessage: "Discover more of Colombo's culture with these suggestions." },
    { day: 3, date: "2025-10-07", location: "Kandy", title: "Travel to the Hill Capital", 
      activities: [{id: 'act-k1', name: 'Udarata Manike (6:00 AM) Train', type: 'Travel', duration: 2.5, cost: 2000, bookingDetails: { provider: "Sri Lanka Railways", contact: "+94112432908" }}], 
      latitude: 7.2906, longitude: 80.6337 },
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

// (removed old TransportOption interface)

// --- NEW: A more flexible and detailed TransportOption interface ---
export interface TransportOption {
  id: string;
  category: 'Train' | 'Bus' | 'Private Hire'; // More specific categories
  name: string; // e.g., "Udarata Menike Express" or "Highway Express Bus"
  provider: string; // e.g., "Sri Lanka Railways"
  time: number; // in hours
  cost: number;
  comfort: 1 | 2 | 3 | 4 | 5;
  isRecommended: boolean;
  details: string;
  bookingLink?: string; // Optional external link
}

// --- NEW: Overhauled transport options with realistic data ---
export const mockTransportOptions: Record<string, TransportOption[]> = {
  "Colombo-Kandy": [
    { id: 'tr-ck-1', category: 'Train', name: 'Intercity Express', provider: "Sri Lanka Railways", time: 2.5, cost: 2000, comfort: 4, isRecommended: true, details: "Fastest train option with A/C and comfortable seating." },
    { id: 'tr-ck-2', category: 'Bus', name: 'Highway Express Bus', provider: "NTC", time: 3, cost: 1200, comfort: 3, isRecommended: false, details: "Comfortable A/C bus via the highway, frequent departures." },
    { id: 'tr-ck-3', category: 'Private Hire', name: 'Private Car / Van', provider: "Local Hirers", time: 3.5, cost: 12000, comfort: 5, isRecommended: false, details: "Flexible and private. Price varies by vehicle type." },
  ],
  "Kandy-Ella": [
    { id: 'tr-ke-1', category: 'Train', name: 'Udarata Menike Scenic', provider: "Sri Lanka Railways", time: 6.5, cost: 3000, comfort: 3, isRecommended: true, details: "The 8:47 AM train, famous for its breathtaking views. A must-do experience." },
    { id: 'tr-ke-2', category: 'Private Hire', name: 'Private Car / Van', provider: "Local Hirers", time: 4, cost: 15000, comfort: 5, isRecommended: false, details: "The fastest and most comfortable option, with door-to-door service." },
  ],
  "Ella-Yala": [
    { id: 'tr-ey-1', category: 'Private Hire', name: 'Private Car / Van', provider: "Local Hirers", time: 4, cost: 8000, comfort: 5, isRecommended: true, details: "The most direct and comfortable route to the Yala region." },
    { id: 'tr-ey-2', category: 'Bus', name: 'Local Bus', provider: "SLTB", time: 6, cost: 600, comfort: 1, isRecommended: false, details: "A very cheap option, but not air-conditioned and may require a transfer." },
  ],
  "Yala-Mirissa": [
    { id: 'tr-ym-1', category: 'Private Hire', name: 'Private Car / Van', provider: "Local Hirers", time: 3, cost: 6000, comfort: 5, isRecommended: true, details: "The most direct and convenient way to travel along the southern coast." },
  ]
};

// --- NEW: A dedicated interface for rental vehicles ---
export interface Vehicle {
  id: string;
  type: 'Car' | 'Van' | 'Tuk-tuk';
  name: string;
  image: string;
  capacity: number; // Number of passengers
  pricePerDay: number; // LKR per day or estimated total
  location?: string;
  provider?: string;
  rating?: number;
  reviews?: number;
  transmission?: 'Auto' | 'Manual';
  fuel?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  driverAvailable?: boolean;
  features?: string[]; // e.g., ['AC', 'GPS', 'Bluetooth']
  distanceKm?: number; // from pickup point, for mock sorting/filtering
}

// --- NEW: Mock data for the "Pick Me" vehicle rental feature ---
export const mockVehicles: Vehicle[] = [
  { id: 'v-1', type: 'Car', name: 'Toyota Corolla', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=900', capacity: 4, pricePerDay: 9000, location: 'Colombo', provider: 'Lanka Car Rentals', rating: 4.7, reviews: 156, transmission: 'Auto', fuel: 'Petrol', driverAvailable: true, features: ['AC', 'GPS', 'Bluetooth', 'USB Charging'], distanceKm: 2.1 },
  { id: 'v-2', type: 'Van', name: 'Toyota Hiace', image: 'https://images.unsplash.com/photo-1605557626555-0f1f25b50f87?w=900', capacity: 15, pricePerDay: 18600, location: 'Colombo', provider: 'City Transport Services', rating: 4.5, reviews: 89, transmission: 'Manual', fuel: 'Diesel', driverAvailable: true, features: ['AC', 'GPS', 'WiFi', 'Luggage Space'], distanceKm: 1.8 },
  { id: 'v-3', type: 'Car', name: 'Honda Vezel', image: 'https://images.unsplash.com/photo-1605559424806-6fca9b499d4a?w=900', capacity: 4, pricePerDay: 12000, location: 'Colombo', provider: 'Island Drives', rating: 4.6, reviews: 112, transmission: 'Auto', fuel: 'Hybrid', driverAvailable: true, features: ['AC', 'GPS'], distanceKm: 3.2 },
  { id: 'v-4', type: 'Tuk-tuk', name: 'Bajaj RE', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900', capacity: 3, pricePerDay: 5000, location: 'Colombo', provider: 'Quick Tuk', rating: 4.2, reviews: 64, transmission: 'Manual', fuel: 'Petrol', driverAvailable: false, features: ['AC'], distanceKm: 0.9 },
  { id: 'v-5', type: 'Van', name: 'Toyota KDH', image: 'https://images.unsplash.com/photo-1599420622023-c2c58612140b?w=900', capacity: 9, pricePerDay: 15000, location: 'Kandy', provider: 'Hill Country Vans', rating: 4.4, reviews: 73, transmission: 'Auto', fuel: 'Diesel', driverAvailable: true, features: ['AC', 'Bluetooth'], distanceKm: 2.7 },
];