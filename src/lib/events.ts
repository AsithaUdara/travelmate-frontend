export interface EventItem {
  id: string;
  location: string;
  name: string;
  date: string; // ISO date
  time?: string; // HH:mm
  type: 'Festival' | 'Cultural' | 'Music' | 'Food' | 'Sport';
  price: number; // LKR
  venue: string;
  images: string[];
  description: string;
}

export const events: EventItem[] = [
  {
    id: 'evt-kandy-esala',
    location: 'Kandy',
    name: 'Kandy Esala Perahera',
    date: '2025-08-12',
    time: '19:00',
    type: 'Cultural',
    price: 0,
    venue: 'Kandy City',
    images: ['https://images.unsplash.com/photo-1588099768532-cb864d5b28b1?w=800'],
    description:
      'One of Asia’s most spectacular religious processions honoring the Sacred Tooth Relic, with dancers, drummers, and decorated elephants.',
  },
  {
    id: 'evt-colombo-food-week',
    location: 'Colombo',
    name: 'Colombo Food Week',
    date: '2025-11-05',
    type: 'Food',
    price: 2500,
    venue: 'Multiple Venues',
    images: ['https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800'],
    description: 'City-wide celebration of Sri Lankan cuisine with pop-up stalls, tasting menus, and cooking demos.',
  },
  {
    id: 'evt-ella-trail-run',
    location: 'Ella',
    name: 'Ella Trail Run',
    date: '2025-02-22',
    time: '06:30',
    type: 'Sport',
    price: 4000,
    venue: 'Little Adam\'s Peak Trail',
    images: ['https://images.unsplash.com/photo-1546484959-fde6c2dfc1bf?w=800'],
    description: 'A scenic 10K run through tea estates and viewpoints around Ella.',
  },
];
