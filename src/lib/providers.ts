export interface ProviderInfo {
  id: string;
  name: string;
  category: 'Railway' | 'Bus' | 'Hotel' | 'Tour' | 'Attraction';
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
}

export const providers: ProviderInfo[] = [
  {
    id: 'prov-sri-lanka-railways',
    name: 'Sri Lanka Railways',
    category: 'Railway',
    phone: '+94 11 2434215',
    website: 'http://www.railway.gov.lk/',
    hours: '08:00 - 18:00 (Mon-Fri)',
  },
  {
    id: 'prov-sltb',
    name: 'Sri Lanka Transport Board (SLTB)',
    category: 'Bus',
    phone: '+94 11 2025555',
    website: 'https://www.transport.gov.lk/',
  },
  {
    id: 'prov-cinnamon-grand',
    name: 'Cinnamon Grand Colombo',
    category: 'Hotel',
    phone: '+94 11 2437437',
    website: 'https://www.cinnamonhotels.com/cinnamongrandcolombo',
  },
];
