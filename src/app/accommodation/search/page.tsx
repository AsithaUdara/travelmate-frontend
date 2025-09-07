"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Users, Filter, Wifi, Coffee, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/accomadation/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/accomadation/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Rating } from "@/components/ui/accomadation/rating"

interface Accommodation {
  id: string
  name: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  amenities: string[]
  type: "hotel" | "guesthouse" | "villa" | "resort"
  description: string
  availability: boolean
}

const mockAccommodations: Accommodation[] = [
  {
    id: "1",
    name: "Cinnamon Grand Colombo",
    location: "Colombo",
    price: 15000,
    rating: 4.8,
    reviews: 1250,
    image: "/accommadation/images/cinnamon-grand-colombo.jpg",
    amenities: ["wifi", "pool", "spa", "restaurant"],
    type: "hotel",
    description: "Luxury hotel in the heart of Colombo with stunning city views",
    availability: true,
  },
  {
    id: "2",
    name: "Tea Bush Hotel",
    location: "Ella",
    price: 8500,
    rating: 4.6,
    reviews: 890,
    image: "/accommadation/images/tea-bush-ella.jpg",
    amenities: ["wifi", "restaurant", "garden", "mountain-view"],
    type: "hotel",
    description: "Boutique hotel surrounded by tea plantations with panoramic mountain views",
    availability: true,
  },
  {
    id: "3",
    name: "Galle Fort Villa",
    location: "Galle",
    price: 12000,
    rating: 4.7,
    reviews: 650,
    image: "/accommadation/images/galle-fort-villa.jpg",
    amenities: ["wifi", "pool", "heritage", "ocean-view"],
    type: "villa",
    description: "Historic colonial villa within the UNESCO World Heritage Galle Fort",
    availability: true,
  },
  {
    id: "4",
    name: "Sigiriya Village Resort",
    location: "Sigiriya",
    price: 9500,
    rating: 4.5,
    reviews: 720,
    image: "/accommadation/images/sigiriya-village-resort.jpg",
    amenities: ["wifi", "pool", "spa", "cultural-tours"],
    type: "resort",
    description: "Eco-friendly resort with traditional architecture near Sigiriya Rock",
    availability: true,
  },
  {
    id: "5",
    name: "Mirissa Beach House",
    location: "Mirissa",
    price: 6500,
    rating: 4.4,
    reviews: 420,
    image: "/accommadation/images/mirissa-beach-house.jpg",
    amenities: ["wifi", "beach-access", "surfing", "whale-watching"],
    type: "guesthouse",
    description: "Cozy beachfront guesthouse perfect for whale watching and surfing",
    availability: true,
  },
  {
    id: "6",
    name: "Kandy Hills Retreat",
    location: "Kandy",
    price: 7800,
    rating: 4.3,
    reviews: 580,
    image: "/accommadation/images/kandy-hills-retreat.jpg",
    amenities: ["wifi", "garden", "cultural-tours", "temple-view"],
    type: "guesthouse",
    description: "Peaceful retreat with views of the Temple of the Tooth and Kandy Lake",
    availability: true,
  },
]

const amenityIcons = {
  wifi: Wifi,
  pool: Waves,
  spa: Coffee,
  restaurant: Coffee,
  "beach-access": Waves,
  garden: Coffee,
  "mountain-view": Coffee,
  heritage: Coffee,
  "ocean-view": Waves,
  "cultural-tours": Coffee,
  surfing: Waves,
  "whale-watching": Waves,
  "temple-view": Coffee,
}

export default function AccommodationPage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [priceRange, setPriceRange] = useState("all")
  const [accommodationType, setAccommodationType] = useState("all")
  const [filteredAccommodations, setFilteredAccommodations] = useState(mockAccommodations)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = () => {
    let filtered = mockAccommodations
    if (searchLocation) {
      filtered = filtered.filter(
        (acc) =>
          acc.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
          acc.name.toLowerCase().includes(searchLocation.toLowerCase()),
      )
    }
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((acc) => acc.price >= min && acc.price <= max)
    }
    if (accommodationType !== "all") {
      filtered = filtered.filter((acc) => acc.type === accommodationType)
    }
    setFilteredAccommodations(filtered)
  }

  useEffect(() => {
    handleSearch()
  }, [searchLocation, priceRange, accommodationType])

  const handleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters)
    toast({
      title: "Advanced Filters",
      description: "More filter options coming soon!",
    })
  }

  const handleViewDetails = (accommodationId: string) => {
    router.push(`/accommodation/details/${accommodationId}`)
  }

  const handleLoadMore = async () => {
    setIsLoading(true)
    setTimeout(() => {
      toast({
        title: "Loading More Properties",
        description: "Additional properties will be loaded here!",
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* --- MODIFIED HERO SECTION START --- */}
      <div className="relative h-[60vh] min-h-[500px] flex flex-col items-center justify-center text-white">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0">
          <img
            src="/accommadation/images/sri-lanka-landscape.jpg"
            alt="Beautiful landscape of Sri Lanka"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
              Find Your Perfect Stay in Sri Lanka
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty">
              Discover authentic accommodations from luxury resorts to cozy guesthouses across the Pearl of the Indian Ocean
            </p>
          </div>

          <Card className="max-w-4xl w-full mx-auto shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2 text-left">
                  <label className="block text-sm font-medium text-foreground mb-2">Where to?</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Colombo, Kandy, Ella..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-2">Check-in</label>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="mm/dd/yyyy"/>
                </div>

                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-2">Check-out</label>
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="mm/dd/yyyy"/>
                </div>

                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <Users className="h-4 w-4 text-muted-foreground mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5+">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 items-end">
                  <div className="sm:col-span-1 text-left">
                      <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger>
                              <SelectValue placeholder="All Prices" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">All Prices</SelectItem>
                              <SelectItem value="0-5000">Under Rs. 5,000</SelectItem>
                              <SelectItem value="5000-10000">Rs. 5,000 - 10,000</SelectItem>
                              <SelectItem value="10000-15000">Rs. 10,000 - 15,000</SelectItem>
                              <SelectItem value="15000-999999">Above Rs. 15,000</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="sm:col-span-1 text-left">
                      <Select value={accommodationType} onValueChange={setAccommodationType}>
                          <SelectTrigger>
                              <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="hotel">Hotels</SelectItem>
                              <SelectItem value="resort">Resorts</SelectItem>
                              <SelectItem value="villa">Villas</SelectItem>
                              <SelectItem value="guesthouse">Guesthouses</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <Button onClick={handleSearch} className="w-full sm:w-auto px-8 py-3 text-base">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* --- MODIFIED HERO SECTION END --- */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{filteredAccommodations.length} Properties Found</h2>
            <p className="text-muted-foreground">Best accommodations for your Sri Lankan adventure</p>
          </div>

          <Button variant="outline" size="sm" onClick={handleMoreFilters}>
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map((accommodation) => (
            <Card
              key={accommodation.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={accommodation.image || "/accommadation/placeholder.svg"}
                  alt={accommodation.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Rs. {accommodation.price.toLocaleString()}/night
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {accommodation.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Rating value={accommodation.rating} readonly size="sm" />
                    <span className="text-sm font-medium">{accommodation.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{accommodation.location}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{accommodation.reviews} reviews</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{accommodation.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {accommodation.amenities.slice(0, 4).map((amenity) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Coffee
                    return (
                      <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconComponent className="w-3 h-3" />
                        <span className="capitalize">{amenity.replace("-", " ")}</span>
                      </div>
                    )
                  })}
                </div>

                <Button className="w-full" size="sm" onClick={() => handleViewDetails(accommodation.id)}>
                  View Details & Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More Properties"}
          </Button>
        </div>
      </div>
    </div>
  )
}