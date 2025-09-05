export type ItineraryPlanRequest = {
  startDate: string; // ISO date
  endDate: string;   // ISO date
  budget?: number;
  interests?: string[];
};

export type DayActivity = {
  time: string;
  title: string;
  location?: string;
  cost?: number;
};

export type DayPlan = {
  date: string; // ISO date
  activities: DayActivity[];
};

export type ItineraryPlan = {
  summary: string;
  totalCost?: number;
  days: DayPlan[];
};
