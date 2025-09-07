"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/accomadation/separator"
import { CheckCircle, ArrowLeft, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BookingData {
  accommodation: string
  room: string
  checkIn: string
  checkOut: string
  guests: string
  totalPrice: number
  specialRequests: string
}

export default function BookingConfirmationPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData")
    if (data) {
      setBookingData(JSON.parse(data))
    } else {
      // Redirect back if no booking data
      router.push("/accommodation/search")
    }
  }, [router])

  const handleConfirmBooking = () => {
    // Here you would integrate with payment gateway
    alert("Booking confirmed! Payment integration coming soon.")
    sessionStorage.removeItem("bookingData")
    router.push("/accommodation/search")
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/accommodation/search">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Accommodations
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Confirm Your Booking</h1>
          <p className="text-muted-foreground">Review your booking details before confirming</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{bookingData.accommodation}</h3>
              <p className="text-muted-foreground">{bookingData.room}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm text-muted-foreground">{bookingData.checkIn}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm text-muted-foreground">{bookingData.checkOut}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p className="text-sm text-muted-foreground">{bookingData.guests}</p>
                </div>
              </div>
            </div>

            {bookingData.specialRequests && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Special Requests</h4>
                  <p className="text-sm text-muted-foreground">{bookingData.specialRequests}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-primary">Rs. {bookingData.totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button className="flex-1" onClick={handleConfirmBooking}>
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
