"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AccommodationPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to search page as the main accommodation entry point
    router.replace("/accommodation/search")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Redirecting to Accommodation Search...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you to find accommodations.</p>
      </div>
    </div>
  )
}
