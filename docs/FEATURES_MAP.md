# Features to Folders Map

This maps your use cases to feature folders so teams can work in parallel.

## 1) User Registration & Profile
- `src/features/auth/*` – login, social auth, session handling
- `src/features/profile/*` – preferences (diet, budget, mobility), profile editing
- Routes: `/profile`, modal in header for quick preferences

## 2) Itinerary Planning & Creation
- `src/features/itinerary/*` – plan form, map drag-drop, optimization UI, group planning
- Routes: `/plan` (MVP), `/plan/group` later

## 3) Transport Integration & Booking
- `src/features/transport/*` – schedules, real-time updates, multi-modal planner
- Routes: `/transport`

## 4) Accommodation
- `src/features/accommodation/*` – hotel cards, filters, booking integration
- Routes: `/discover?tab=stays`

## 5) Restaurants & Food
- `src/features/food/*` – dietary filters, local dishes, timing coordination
- Routes: `/discover?tab=food`

## 6) Activities & Attractions
- `src/features/activities/*` – interest matching, weather-aware suggestions, cultural events
- Routes: `/discover?tab=activities`

## 7) Proximity / Near Me
- `src/features/proximity/*` – pharmacies, ATMs, emergency, nearby hotels/food
- Routes: `/map` (near-me controls)

## 8) Real-time Updates & Notifications
- `src/features/notifications/*` – push setup, in-app toasts, subscriptions

## 9) Booking & Payment
- `src/features/booking/*` – hotel/activity bookings, carts, payment flows

## 10) Social & Sharing
- `src/features/social/*` – share itinerary, group coordination, reviews, photos

## 11) Offline
- `src/features/offline/*` – offline caches, downloads, map tiles

## 12) AI Learning & Personalization
- Spans multiple features; put models and client inference wrappers under `src/lib/ai/*`

## 13) Emergency & Safety
- Part of proximity and notifications; add UI in `/map` and a persistent emergency button
