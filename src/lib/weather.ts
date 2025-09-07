export interface DailyForecast {
  date: string; // ISO
  minC: number;
  maxC: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Showers' | 'Thunderstorms';
  precipChance: number; // 0..100
}

export const weatherByLocation: Record<string, DailyForecast[]> = {
  Colombo: [
    { date: '2025-10-05', minC: 25, maxC: 31, condition: 'Partly Cloudy', precipChance: 20 },
    { date: '2025-10-06', minC: 25, maxC: 30, condition: 'Showers', precipChance: 60 },
    { date: '2025-10-07', minC: 24, maxC: 30, condition: 'Showers', precipChance: 50 },
  ],
  Kandy: [
    { date: '2025-10-07', minC: 21, maxC: 28, condition: 'Partly Cloudy', precipChance: 30 },
    { date: '2025-10-08', minC: 20, maxC: 27, condition: 'Sunny', precipChance: 10 },
  ],
  Ella: [
    { date: '2025-10-09', minC: 19, maxC: 26, condition: 'Sunny', precipChance: 5 },
    { date: '2025-10-10', minC: 18, maxC: 25, condition: 'Cloudy', precipChance: 15 },
  ],
};
