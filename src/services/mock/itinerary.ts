import type { ItineraryPlan, ItineraryPlanRequest } from "@/types/itinerary";

export async function planItineraryMock(req: ItineraryPlanRequest): Promise<ItineraryPlan> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 600));
  const days: ItineraryPlan["days"] = [];
  const start = new Date(req.startDate);
  const end = new Date(req.endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push({
      date: d.toISOString().slice(0, 10),
      activities: [
        { time: "08:00", title: "Breakfast at local cafe", cost: 5 },
        { time: "10:00", title: "Visit landmark", location: "Temple of the Tooth", cost: 10 },
        { time: "14:00", title: "Train ride scenic route", cost: 2 },
      ],
    });
  }
  return {
    summary: `Plan for ${req.interests?.join(", ") || "highlights"} with budget ${req.budget ?? "—"}`,
    totalCost: days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (a.cost ?? 0), 0), 0),
    days,
  };
}
