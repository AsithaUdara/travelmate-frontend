"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Star, Coffee, Calendar, Users, Phone, Mail, Share2, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/accomadation/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/accomadation/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/accomadation/select"
import { Separator } from "@/components/ui/accomadation/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { RatingModal } from "@/components/ui/accomadation/rating-modal"
import { Rating } from "@/components/ui/accomadation/rating"

interface AccommodationDetails {
  id: string
  name: string
  location: string
  price: number
  rating: number
  reviews: number
  images: string[]
  amenities: string[]
  type: "hotel" | "guesthouse" | "villa" | "resort"
  description: string
  longDescription: string
  rooms: Array<{
    type: string
    price: number
    capacity: number
    amenities: string[]
  }>
  policies: {
    checkIn: string
    checkOut: string
    cancellation: string
  }
  contact: {
    phone: string
    email: string
    address: string
  }
}

// --- UPDATED MOCK DATA ---
const mockAccommodation: AccommodationDetails = {
  id: "1",
  name: "Cinnamon Grand Colombo",
  location: "Colombo",
  price: 15000,
  rating: 4.8,
  reviews: 1250,
  // Corrected image paths with leading slashes and varied images
  images: [
    "/accommadation/images/cinnamon-grand-colombo.jpg",
    "/accommadation/images/tea-bush-ella.jpg", // Example of a second image
    "/accommadation/images/galle-fort-villa.jpg", // Example of a third image
    "/accommadation/images/sigiriya-village-resort.jpg", // Example of a fourth image
  ],
  amenities: ["wifi", "pool", "spa", "restaurant", "gym", "concierge", "room-service", "business-center"],
  type: "hotel",
  description: "Luxury hotel in the heart of Colombo with stunning city views",
  longDescription:
    "Experience the epitome of luxury at Cinnamon Grand Colombo, where traditional Sri Lankan hospitality meets contemporary elegance. Located in the heart of Colombo, this iconic hotel offers breathtaking views of the Indian Ocean and the bustling cityscape. Each room is meticulously designed with modern amenities while incorporating subtle Sri Lankan cultural elements.",
  rooms: [
    {
      type: "Deluxe Room",
      price: 15000,
      capacity: 2,
      amenities: ["wifi", "ac", "minibar", "city-view"],
    },
    {
      type: "Ocean View Suite",
      price: 25000,
      capacity: 3,
      amenities: ["wifi", "ac", "minibar", "ocean-view", "balcony"],
    },
    {
      type: "Presidential Suite",
      price: 45000,
      capacity: 4,
      amenities: ["wifi", "ac", "minibar", "ocean-view", "balcony", "living-room", "butler-service"],
    },
  ],
  policies: {
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    cancellation: "Free cancellation up to 24 hours before check-in",
  },
  contact: {
    phone: "+94 11 249 7973",
    email: "reservations@cinnamonhotels.com",
    address: "77 Galle Road, Colombo 03, Sri Lanka",
  },
}

export default function AccommodationDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(mockAccommodation.rooms[0])
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 1;
    }
    return 1
  }

  const totalPrice = selectedRoom.price * calculateNights()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockAccommodation.name,
          text: `Check out this amazing accommodation: ${mockAccommodation.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Property link has been copied to your clipboard.",
      })
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from Favorites" : "Added to Favorites",
      description: isSaved ? "Property removed from your saved list." : "Property saved to your favorites list.",
    })
  }

  const handleBookNow = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Information",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }
    // ... rest of your handleBookNow logic
    router.push("/accommodation/booking/confirmation");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/accommodation/search">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-primary text-primary" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{mockAccommodation.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span>{mockAccommodation.contact.address}</span>
              </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-2">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src={mockAccommodation.images[selectedImage] || "/accommadation/placeholder.svg"}
                  alt={mockAccommodation.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {mockAccommodation.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary ring-2 ring-primary/50" : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/accommadation/placeholder.svg"}
                      alt={`${mockAccommodation.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <Card>
              <CardContent className="space-y-6 pt-6">
                <p className="text-muted-foreground leading-relaxed">{mockAccommodation.longDescription}</p>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Reviews & Ratings</h3>
                    <RatingModal accommodationId={mockAccommodation.id} accommodationName={mockAccommodation.name} />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{mockAccommodation.rating}</div>
                      <Rating value={mockAccommodation.rating} readonly size="sm" />
                      <div className="text-sm text-muted-foreground">{mockAccommodation.reviews} reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8">{stars}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {Math.floor(Math.random() * 200 + 50)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockAccommodation.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        <Coffee className="w-4 h-4 text-primary" />
                        <span className="capitalize">{amenity.replace("-", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Policies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Check-in:</span>
                      <p className="text-muted-foreground">{mockAccommodation.policies.checkIn}</p>
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>
                      <p className="text-muted-foreground">{mockAccommodation.policies.checkOut}</p>
                    </div>
                    <div>
                      <span className="font-medium">Cancellation:</span>
                      <p className="text-muted-foreground">{mockAccommodation.policies.cancellation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Room</label>
                  <Select
                    value={selectedRoom.type}
                    onValueChange={(value: string) => {
                      const room = mockAccommodation.rooms.find((r) => r.type === value)
                      if (room) setSelectedRoom(room)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccommodation.rooms.map((room) => (
                        <SelectItem key={room.type} value={room.type}>
                          {room.type} - Rs. {room.price.toLocaleString()}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-in</label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-out</label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <Users className="h-4 w-4 mr-2"/>
                        <SelectValue />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Special Requests</label>
                  <Textarea
                    placeholder="Any special requirements..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Rs. {selectedRoom.price.toLocaleString()} × {calculateNights()} nights
                    </span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>Rs. {Math.round(totalPrice * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>Rs. {Math.round(totalPrice * 0.15).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>Rs. {Math.round(totalPrice * 1.25).toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full text-base font-bold" size="lg" onClick={handleBookNow} disabled={isBooking}>
                  {isBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Book Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}