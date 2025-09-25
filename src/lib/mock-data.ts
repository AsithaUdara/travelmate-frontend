export type Place = {
  id: string;
  name: string;
  category: 'stay' | 'activity' | 'eat' | 'flight' | 'sights' | 'atm';
  type: string;
  images: string[];
  rating: number;
  reviews: number;
  price: number;
  totalPrice?: number;
  priceType: 'night' | 'person' | 'total';
  latitude?: number;
  longitude?: number;
  location?: string;
  description?: string;
  amenities?: {
    wifi?: boolean;
    pool?: boolean;
  };
};

export const mockPlaces: Place[] = [
  // --- Sights & Activities Near Kandy ---
  { 
    id: 'act1', 
    name: 'Sigiriya Rock Fortress Climb', 
    category: 'activity', 
    type: 'Historic Site', 
    images: [
      'https://tse1.mm.bing.net/th/id/OIP.hfcbZptS11K6OXH-rhOxdgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://www.storiesbysoumya.com/wp-content/uploads/2021/11/sigiriya-rock-fortress.jpg',
      'https://picsum.photos/id/1018/800/600'
    ], 
    rating: 4.9, 
    reviews: 12040, 
    price: 10000, 
    totalPrice: 10000, 
    priceType: 'person', 
    latitude: 7.9575, 
    longitude: 80.7600 
  },
  { 
    id: 'sight3', 
    name: 'Dambulla Cave Temple', 
    category: 'sights', 
    type: 'Ancient Temple Complex', 
    images: [
      'https://tse2.mm.bing.net/th/id/OIP.gr5FAs9w-OC3vmKXOvhW7QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://tse1.mm.bing.net/th/id/OIP.qP-oo_H_m82skTXhTmekQwHaFG?rs=1&pid=ImgDetMain&o=7&rm=3'
    ], 
    rating: 4.7, 
    reviews: 9800, 
    price: 1500, 
    totalPrice: 1500, 
    priceType: 'person', 
    latitude: 7.856, 
    longitude: 80.648 
  },
  { 
    id: 'act2', 
    name: 'Pinnawala Elephant Orphanage', 
    category: 'activity', 
    type: 'Nature & Wildlife',
    images: [
      'https://i.pinimg.com/originals/ed/2f/3b/ed2f3ba76fa07de533a0591f7501fbb4.jpg', 
      'https://cdn.shopify.com/s/files/1/0396/9165/files/elephant-in-river.jpg?v=1504886679'
    ],
    rating: 4.4, 
    reviews: 7500, 
    price: 3000, 
    totalPrice: 3000, 
    priceType: 'person', 
    latitude: 7.295, 
    longitude: 80.385 
  },
  { 
    id: 'act3', 
    name: 'Knuckles Mountain Range Trek', 
    category: 'activity', 
    type: 'Hiking & Nature', 
    images: [
      'https://tse2.mm.bing.net/th/id/OIP.IZfW73S7CPwVKSmyEf01DAHaEh?rs=1&pid=ImgDetMain&o=7&rm=3',
      // --- TYPO FIXED HERE ---
      'https://tse2.mm.bing.net/th/id/OIP.6zDzw1fu2MRW4nVJqqTrpAHaFj?w=550&h=413&rs=1&pid=ImgDetMain&o=7&rm=3'
    ], 
    rating: 4.9, 
    reviews: 1800, 
    price: 5000, 
    totalPrice: 5000, 
    priceType: 'person', 
    latitude: 7.450, 
    longitude: 80.800 
  },
  { 
    id: 'sight2', 
    name: 'Nuwara Eliya Tea Plantations', 
    category: 'sights', 
    type: 'Scenic Landmark', 
    images: [
      'https://th.bing.com/th/id/R.6d2725d2a14b9ee63b02a9b80d6f6b6a?rik=kqGAH1k2ISdaLA&pid=ImgRaw&r=0', 
      // --- TYPO FIXED HERE ---
      'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/70/5b/e8.jpg'
    ], 
    rating: 4.8, 
    reviews: 11200, 
    price: 0, 
    totalPrice: 0, 
    priceType: 'total', 
    latitude: 6.949, 
    longitude: 80.789 
  },

  // --- Stays Near Kandy ---
  { 
    id: 'stay2', 
    name: 'Heritance Kandalama', 
    category: 'stay', 
    type: '5-Star Eco Hotel', 
    images: [
      'https://th.bing.com/th/id/R.a3166eac313cfeb3ca07c2c5b1567e02?rik=ZudZgr4gA1%2fFhw&pid=ImgRaw&r=0', 
      'https://media.vamonos.nl/original/original/Heritance-Kandalama-3.jpg'
    ], 
    rating: 4.9, 
    reviews: 4812, 
    price: 142000, 
    totalPrice: 2698000, 
    priceType: 'night', 
    latitude: 7.8543, 
    longitude: 80.7000 
  },
  { 
    id: 'stay3', 
    name: 'Amaya Hills Kandy', 
    category: 'stay', 
    type: 'Luxury Hotel', 
    images: [
      'https://dev2.uplist.lk/wp-content/uploads/2022/08/amaya-hills-aerial-view-1.jpg', 
      'https://sysadmin.niwadu.com/storage/uploads/images/YS3Tbd97RhObKKHPXncLHpY34cyfWBi7OlTWEpEr.jpg'
    ], 
    rating: 4.6, 
    reviews: 3200, 
    price: 85000, 
    totalPrice: 1615000, 
    priceType: 'night', 
    latitude: 7.275, 
    longitude: 80.600 
  },
];