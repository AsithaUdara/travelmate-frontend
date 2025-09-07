"use client";

import { Button } from "@/components/ui/button";

export default function AccommodationError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border rounded-lg shadow p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.assign('/plan')}>Back to Plan</Button>
        </div>
      </div>
    </div>
  );
}
