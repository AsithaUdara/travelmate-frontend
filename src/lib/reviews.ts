export type ReviewTargetType = 'stay' | 'activity' | 'eat' | 'sights';

export interface Review {
  id: string;
  targetId: string; // e.g., mock-data Place id
  targetType: ReviewTargetType;
  rating: number; // 1..5
  title: string;
  comment: string;
  author: string;
  date: string; // ISO date
}

export const reviews: Review[] = [
  {
    id: 'rev-cinnamon-1',
    targetId: 'stay5',
    targetType: 'stay',
    rating: 5,
    title: 'Central, stylish, and amazing breakfast',
    comment:
      'Loved the location and service. The breakfast buffet had everything. Pool area was a nice break from the heat.',
    author: 'Maya S.',
    date: '2025-06-14',
  },
  {
    id: 'rev-train-ella-1',
    targetId: 'act4',
    targetType: 'activity',
    rating: 5,
    title: 'Unreal views from the train',
    comment:
      'Book a window seat if possible. The tea country scenery is unforgettable. Bring snacks and a camera!',
    author: 'Daniel K.',
    date: '2025-01-03',
  },
  {
    id: 'rev-ministry-crab-1',
    targetId: 'eat1',
    targetType: 'eat',
    rating: 4,
    title: 'Incredible crab, pricey but worth it',
    comment:
      'We tried the pepper crab and it was phenomenal. Reservations recommended.',
    author: 'Chathura W.',
    date: '2025-05-21',
  },
];
