export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  averageCosts: {
    budget: number; // LKR per day
    midRange: number; // LKR per day
    luxury: number; // LKR per day
  };
  bestTime: string;
  coordinates: { latitude: number; longitude: number };
  safetyTips: string[];
  localTips: string[];
  emergencyContacts?: {
    police?: string;
    ambulance?: string;
    touristPolice?: string;
    railway?: string;
  };
}

export const destinations: Destination[] = [
  {
    id: "colombo",
    name: "Colombo",
    country: "Sri Lanka",
    region: "Western Province",
    description:
      "Sri Lanka's commercial capital blending colonial heritage with a modern waterfront, vibrant dining, and buzzing markets.",
    heroImage:
      "https://images.unsplash.com/photo-1568640365971-35c2d1578599?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1563276540-2a0f6f52a1fb?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    ],
    highlights: [
      "Galle Face Green sunset walk",
      "Street food at Pettah",
      "National Museum & historic temples",
    ],
    averageCosts: { budget: 9000, midRange: 22000, luxury: 45000 },
    bestTime: "December to March (dry season).",
    coordinates: { latitude: 6.9271, longitude: 79.8612 },
    safetyTips: [
      "Use ride-hailing apps at night.",
      "Keep valuables secure in crowded markets.",
    ],
    localTips: [
      "Try kottu and hoppers at local eateries.",
      "Visit Pettah in the morning to avoid heat.",
    ],
    emergencyContacts: {
      police: "119",
      ambulance: "1990",
      touristPolice: "+94 11 242 1052",
      railway: "+94 11 2434215",
    },
  },
  {
    id: "kandy",
    name: "Kandy",
    country: "Sri Lanka",
    region: "Central Province",
    description:
      "Hill-country cultural capital known for the Temple of the Tooth, lush gardens, and scenic lakeside walks.",
    heroImage:
      "https://images.unsplash.com/photo-1600104165968-c8f6badb1a0a?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1540583723860-5a6f58b8a9c8?w=800",
      "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=800",
    ],
    highlights: [
      "Temple of the Tooth (Sri Dalada Maligawa)",
      "Kandy Lake walk",
      "Peradeniya Botanical Gardens",
    ],
    averageCosts: { budget: 7000, midRange: 18000, luxury: 38000 },
    bestTime: "January to April for pleasant weather.",
    coordinates: { latitude: 7.2906, longitude: 80.6337 },
    safetyTips: ["Dress modestly at temples.", "Beware of monkeys near food."],
    localTips: [
      "Catch the evening ceremony at the Temple of the Tooth.",
      "Try local sweets at the market.",
    ],
  },
  {
    id: "ella",
    name: "Ella",
    country: "Sri Lanka",
    region: "Uva Province",
    description:
      "Laid-back mountain town with tea plantations, hiking trails, and epic viewpoints.",
    heroImage:
      "https://images.unsplash.com/photo-1561874836-14f7a755928a?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1598933400113-2886c9983b63?w=800",
      "https://images.unsplash.com/photo-1613278272643-1630438a2c27?w=800",
    ],
    highlights: ["Nine Arch Bridge", "Little Adam's Peak", "Ella Rock"],
    averageCosts: { budget: 6000, midRange: 15000, luxury: 30000 },
    bestTime: "January to March, and June to August.",
    coordinates: { latitude: 6.8667, longitude: 81.0466 },
    safetyTips: ["Start hikes early to avoid heat.", "Stay hydrated."],
    localTips: ["Visit Nine Arch Bridge for the morning train.", "Book scenic train seats early."],
  },
];
