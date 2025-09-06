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
};

export const mockPlaces: Place[] = [
  // Stays
  { id: 'stay1', name: 'Galle Face Hotel', category: 'stay', type: '5-Star Hotel', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500'], rating: 4.7, reviews: 6201, price: 125000, totalPrice: 2375000, priceType: 'night', latitude: 6.9214, longitude: 79.8447 },
  { id: 'stay2', name: 'Heritance Kandalama', category: 'stay', type: '5-Star Eco Hotel', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500'], rating: 4.9, reviews: 4812, price: 142000, totalPrice: 2698000, priceType: 'night', latitude: 7.8543, longitude: 80.7000 },
  { id: 'stay3', name: '98 Acres Resort & Spa', category: 'stay', type: 'Resort', images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500'], rating: 4.8, reviews: 3150, price: 98000, totalPrice: 1862000, priceType: 'night', latitude: 6.9934, longitude: 81.0550 },
  { id: 'stay4', name: 'Jetwing Vil Uyana', category: 'stay', type: 'Luxury Villa Resort', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500', 'https://images.unsplash.com/photo-1590490359853-39213642364a?w=500'], rating: 4.9, reviews: 2980, price: 180000, totalPrice: 3420000, priceType: 'night', latitude: 7.9575, longitude: 80.7600 },
  { id: 'stay5', name: 'Cinnamon Grand Colombo', category: 'stay', type: 'City Hotel', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500', 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500'], rating: 4.6, reviews: 7800, price: 110000, totalPrice: 2090000, priceType: 'night', latitude: 6.9159, longitude: 79.8487 },
  { id: 'stay6', name: 'The Fortress Resort & Spa', category: 'stay', type: 'Boutique Resort', images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500'], rating: 4.8, reviews: 2400, price: 165000, totalPrice: 3135000, priceType: 'night', latitude: 5.948, longitude: 80.464 },

  // Activities
  { id: 'act1', name: 'Sigiriya Rock Fortress Climb', category: 'activity', type: 'Historic Site', images: ['https://images.unsplash.com/photo-1583622535422-52b3a0720c21?w=500', 'https://images.unsplash.com/photo-1616421292021-933deb6682a2?w=500'], rating: 4.9, reviews: 12040, price: 10000, totalPrice: 10000, priceType: 'person', latitude: 7.9575, longitude: 80.7600 },
  { id: 'act2', name: 'Yala National Park Safari', category: 'activity', type: 'Nature & Wildlife Tour', images: ['https://images.unsplash.com/photo-1594964625072-4a0975b61638?w=500', 'https://images.unsplash.com/photo-1549959828-3e498c1c5b81?w=500'], rating: 4.7, reviews: 8890, price: 15000, totalPrice: 15000, priceType: 'person', latitude: 6.3667, longitude: 81.4667 },
  { id: 'act3', name: 'Whale Watching in Mirissa', category: 'activity', type: 'Boat Tour', images: ['https://images.unsplash.com/photo-1580493822019-d0491a6270a2?w=500', 'https://images.unsplash.com/photo-1605057038758-29403a53f0aa?w=500'], rating: 4.6, reviews: 5600, price: 12000, totalPrice: 12000, priceType: 'person', latitude: 5.9482, longitude: 80.4548 },
  { id: 'act4', name: 'Kandy to Ella Train Journey', category: 'activity', type: 'Scenic Transport', images: ['https://images.unsplash.com/photo-1598933400113-2886c9983b63?w=500', 'https://images.unsplash.com/photo-1613278272643-1630438a2c27?w=500'], rating: 4.9, reviews: 22500, price: 3000, totalPrice: 3000, priceType: 'person', latitude: 6.9934, longitude: 81.0550 },

  // Eats
  { id: 'eat1', name: 'Ministry of Crab', category: 'eat', type: 'Seafood Restaurant', images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500'], rating: 4.8, reviews: 2500, price: 20000, totalPrice: 20000, priceType: 'person', latitude: 6.935, longitude: 79.848 },
  { id: 'eat2', name: 'The Gallery Cafe', category: 'eat', type: 'Cafe & Restaurant', images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500'], rating: 4.6, reviews: 1800, price: 8000, totalPrice: 8000, priceType: 'person', latitude: 6.9036, longitude: 79.8591 },
  
  // Sights
  { id: 'sight1', name: 'Galle Fort', category: 'sights', type: 'UNESCO World Heritage Site', images: ['https://images.unsplash.com/photo-1594562700812-f743a4106a72?w=500'], rating: 4.8, reviews: 15200, price: 0, totalPrice: 0, priceType: 'person', latitude: 6.027, longitude: 80.217 },
  { id: 'sight2', name: 'Nine Arch Bridge', category: 'sights', type: 'Iconic Landmark', images: ['https://images.unsplash.com/photo-1561874836-14f7a755928a?w=500'], rating: 4.9, reviews: 18500, price: 0, totalPrice: 0, priceType: 'person', latitude: 6.876, longitude: 81.047 },
  { id: 'sight3', name: 'Dambulla Cave Temple', category: 'sights', type: 'Ancient Temple Complex', images: ['https://images.unsplash.com/photo-1598403337953-83f5117e3b91?w=500'], rating: 4.7, reviews: 9800, price: 1500, totalPrice: 1500, priceType: 'person', latitude: 7.856, longitude: 80.648 },

  // ATMs
  { id: 'atm1', name: 'Commercial Bank ATM', category: 'atm', type: 'Bank ATM', images: ['https://images.unsplash.com/photo-1583272286466-0939a340b171?w=500'], rating: 4.2, reviews: 150, price: 0, totalPrice: 0, priceType: 'total', latitude: 6.9344, longitude: 79.8459 },
  { id: 'atm2', name: 'HSBC ATM', category: 'atm', type: 'Bank ATM', images: ['https://images.unsplash.com/photo-1613243555988-421db22dc3c3?w=500'], rating: 4.0, reviews: 90, price: 0, totalPrice: 0, priceType: 'total', latitude: 6.911, longitude: 79.851 },
];