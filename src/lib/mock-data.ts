export type Place = {
  id: string;
  name: string;
  category: 'stay' | 'activity' | 'eat' | 'flight' | 'sights' | 'atm';
  type: string;
  images: string[];
  rating: number;
  reviews: number;
  price: number;
  totalPrice: number;
  priceType: 'night' | 'person' | 'total';
  latitude: number;
  longitude: number;
  location?: string; 
  description?: string; // Add description, make it optional
  amenities?: {        // Add amenities, make it optional
    wifi?: boolean;
    pool?: boolean;
  };
};


export const mockPlaces: Place[] = [
  // Stays (local images)
  // { id: 'stay1', name: 'Galle Face Hotel', category: 'stay', type: '5-Star Hotel', images: ['/gallery/gallery-1.jpg', '/hero/hero-1.jpg', '/hero/hero-2.jpg'], rating: 4.7, reviews: 6201, price: 125000, totalPrice: 2375000, priceType: 'night', latitude: 6.9214, longitude: 79.8447 },
  // { id: 'stay2', name: 'Heritance Kandalama', category: 'stay', type: '5-Star Eco Hotel', images: ['/gallery/gallery-2.jpg', '/hero/hero-3.jpg'], rating: 4.9, reviews: 4812, price: 142000, totalPrice: 2698000, priceType: 'night', latitude: 7.8543, longitude: 80.7000 },
  // { id: 'stay3', name: '98 Acres Resort & Spa', category: 'stay', type: 'Resort', images: ['/gallery/gallery-3.jpg', '/hero/hero-4.jpg'], rating: 4.8, reviews: 3150, price: 98000, totalPrice: 1862000, priceType: 'night', latitude: 6.9934, longitude: 81.0550 },
  // { id: 'stay4', name: 'Jetwing Vil Uyana', category: 'stay', type: 'Luxury Villa Resort', images: ['/gallery/gallery-4.jpg', '/hero/hero-5.jpg'], rating: 4.9, reviews: 2980, price: 180000, totalPrice: 3420000, priceType: 'night', latitude: 7.9575, longitude: 80.7600 },
  // { id: 'stay5', name: 'Cinnamon Grand Colombo', category: 'stay', type: 'City Hotel', images: ['/gallery/cta-bg.jpg', '/hero/hero-6.jpg'], rating: 4.6, reviews: 7800, price: 110000, totalPrice: 2090000, priceType: 'night', latitude: 6.9159, longitude: 79.8487 },
  // { id: 'stay6', name: 'The Fortress Resort & Spa', category: 'stay', type: 'Boutique Resort', images: ['/gallery/cta-bg2.jpg', '/hero/hero-2.jpg'], rating: 4.8, reviews: 2400, price: 165000, totalPrice: 3135000, priceType: 'night', latitude: 5.948, longitude: 80.464 },

  // // Activities (local images reused)
  // { id: 'act1', name: 'Sigiriya Rock Fortress Climb', category: 'activity', type: 'Historic Site', images: ['/hero/hero-3.jpg', '/gallery/gallery-1.jpg'], rating: 4.9, reviews: 12040, price: 10000, totalPrice: 10000, priceType: 'person', latitude: 7.9575, longitude: 80.7600 },
  // { id: 'act2', name: 'Yala National Park Safari', category: 'activity', type: 'Nature & Wildlife Tour', images: ['/hero/hero-4.jpg', '/gallery/gallery-2.jpg'], rating: 4.7, reviews: 8890, price: 15000, totalPrice: 15000, priceType: 'person', latitude: 6.3667, longitude: 81.4667 },
  // { id: 'act3', name: 'Whale Watching in Mirissa', category: 'activity', type: 'Boat Tour', images: ['/hero/hero-5.jpg', '/gallery/gallery-3.jpg'], rating: 4.6, reviews: 5600, price: 12000, totalPrice: 12000, priceType: 'person', latitude: 5.9482, longitude: 80.4548 },
  // { id: 'act4', name: 'Kandy to Ella Train Journey', category: 'activity', type: 'Scenic Transport', images: ['/hero/hero-6.jpg', '/gallery/gallery-4.jpg'], rating: 4.9, reviews: 22500, price: 3000, totalPrice: 3000, priceType: 'person', latitude: 6.9934, longitude: 81.0550 },

  // // Eats (local images)
  // { id: 'eat1', name: 'Ministry of Crab', category: 'eat', type: 'Seafood Restaurant', images: ['/gallery/gallery-2.jpg'], rating: 4.8, reviews: 2500, price: 20000, totalPrice: 20000, priceType: 'person', latitude: 6.935, longitude: 79.848 },
  // { id: 'eat2', name: 'The Gallery Cafe', category: 'eat', type: 'Cafe & Restaurant', images: ['/gallery/gallery-3.jpg'], rating: 4.6, reviews: 1800, price: 8000, totalPrice: 8000, priceType: 'person', latitude: 6.9036, longitude: 79.8591 },
  
  // // Sights (local images)
  // { id: 'sight1', name: 'Galle Fort', category: 'sights', type: 'UNESCO World Heritage Site', images: ['/gallery/gallery-1.jpg'], rating: 4.8, reviews: 15200, price: 0, totalPrice: 0, priceType: 'person', latitude: 6.027, longitude: 80.217 },
  // { id: 'sight2', name: 'Nine Arch Bridge', category: 'sights', type: 'Iconic Landmark', images: ['/gallery/gallery-4.jpg'], rating: 4.9, reviews: 18500, price: 0, totalPrice: 0, priceType: 'person', latitude: 6.876, longitude: 81.047 },
  // { id: 'sight3', name: 'Dambulla Cave Temple', category: 'sights', type: 'Ancient Temple Complex', images: ['/gallery/gallery-2.jpg'], rating: 4.7, reviews: 9800, price: 1500, totalPrice: 1500, priceType: 'person', latitude: 7.856, longitude: 80.648 },

  // // ATMs (local images)
  // { id: 'atm1', name: 'Commercial Bank ATM', category: 'atm', type: 'Bank ATM', images: ['/gallery/gallery-3.jpg'], rating: 4.2, reviews: 150, price: 0, totalPrice: 0, priceType: 'total', latitude: 6.9344, longitude: 79.8459 },
  // { id: 'atm2', name: 'HSBC ATM', category: 'atm', type: 'Bank ATM', images: ['/gallery/gallery-1.jpg'], rating: 4.0, reviews: 90, price: 0, totalPrice: 0, priceType: 'total', latitude: 6.911, longitude: 79.851 },
];