export type Place = {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  image: string; // <-- NEW
  rating: number; // <-- NEW
};

export const mockPlaces: Place[] = [
  // Restaurants
  { name: 'Ministry of Crab', category: 'restaurant', latitude: 6.9271, longitude: 79.8612, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500', rating: 4.8 },
  { name: 'Nuga Gama', category: 'restaurant', latitude: 6.9147, longitude: 79.8519, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500', rating: 4.6 },

  // Hotels
  { name: 'Galle Face Hotel', category: 'hotel', latitude: 6.9214, longitude: 79.8447, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', rating: 4.7 },
  { name: 'Heritance Kandalama', category: 'hotel', latitude: 7.8543, longitude: 80.7000, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500', rating: 4.9 },

  // Attractions
  { name: 'Sigiriya Rock', category: 'attraction', latitude: 7.9575, longitude: 80.7600, image: 'https://images.unsplash.com/photo-1583622535422-52b3a0720c21?w=500', rating: 4.9 },
  { name: 'Temple of the Tooth', category: 'attraction', latitude: 7.2938, longitude: 80.6413, image: 'https://images.unsplash.com/photo-1627764353631-11feb71521a9?w=500', rating: 4.8 },
  
  // Hospitals
  { name: 'Nawaloka Hospital', category: 'hospital', latitude: 6.9239, longitude: 79.8587, image: 'https://images.unsplash.com/photo-1664934173733-60f77b73a3c9?w=500', rating: 4.5 },
  
  // ATMs
  { name: 'Commercial Bank ATM', category: 'atm', latitude: 6.9344, longitude: 79.8459, image: 'https://images.unsplash.com/photo-1583272286466-0939a340b171?w=500', rating: 4.2 },

  // Transportation
  { name: 'Fort Railway Station', category: 'transport', latitude: 6.9339, longitude: 79.8513, image: 'https://images.unsplash.com/photo-1598933400113-2886c9983b63?w=500', rating: 4.4 },
];