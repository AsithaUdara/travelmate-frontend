export type TransportMode = 'Train' | 'Bus' | 'Private Hire' | 'Flight';

export interface TransportLine {
  id: string;
  mode: TransportMode;
  name: string; // e.g., Udarata Manike
  routeNumber?: string; // For buses
  provider: string; // e.g., Sri Lanka Railways
  origin: string;
  destination: string;
  departureTimes: string[]; // 24h: "06:00", "09:45"
  durationHours: number;
  contact?: string; // tel
  notes?: string;
}

export const transportLines: TransportLine[] = [
  {
    id: 'train-udarata-manike-ck',
    mode: 'Train',
    name: 'Udarata Manike',
    provider: 'Sri Lanka Railways',
    origin: 'Colombo Fort',
    destination: 'Kandy',
    departureTimes: ['06:00', '15:35'],
    durationHours: 2.5,
    contact: '+94112434215',
    notes: 'Scenic express train. Book early for 1st class observation.',
  },
  {
    id: 'train-intercity-express-ck',
    mode: 'Train',
    name: 'Intercity Express',
    provider: 'Sri Lanka Railways',
    origin: 'Colombo Fort',
    destination: 'Kandy',
    departureTimes: ['09:45', '17:00'],
    durationHours: 2.5,
    contact: '+94112434215',
  },
  {
    id: 'bus-express-ex02-ck',
    mode: 'Bus',
    name: 'Highway Express',
    routeNumber: 'EX-02',
    provider: 'NTC / SLTB',
    origin: 'Colombo',
    destination: 'Kandy',
    departureTimes: ['Every 30 mins 06:00-20:00'],
    durationHours: 3,
    contact: '+94112421321',
    notes: 'A/C coaches via highway, frequent service.',
  },
  {
    id: 'bus-local-47-kandy',
    mode: 'Bus',
    name: 'Local Bus',
    routeNumber: '47',
    provider: 'SLTB',
    origin: 'Kandy',
    destination: 'Peradeniya',
    departureTimes: ['Every 15 mins 06:00-21:00'],
    durationHours: 0.5,
  },
  {
    id: 'hire-car-colombo-kandy-std',
    mode: 'Private Hire',
    name: 'Private Car / Van',
    provider: 'Local Hirers',
    origin: 'Colombo',
    destination: 'Kandy',
    departureTimes: ['On-demand'],
    durationHours: 3.5,
    notes: 'Door-to-door convenience, pricing varies by vehicle type.',
  },
];
