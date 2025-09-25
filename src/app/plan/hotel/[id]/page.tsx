"use client";

import React, { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, StarIcon, WifiIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { BookingPanel } from '@/components/plan/BookingPanel';
import { PoolIcon } from '@/components/icons/PoolIcon';
import { Place } from '@/lib/mock-data';

// --- UPDATE: The Review type now matches the backend model ---
type Review = {
  _id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: string; // ISO date string from the database
};

// --- NEW: Helper function to format the date from the database ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

const ReviewCard = ({ review }: { review: Review }) => (
    <div>
        <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                <UserCircleIcon className="h-8 w-8 text-slate-500"/>
            </div>
            <div>
                <p className="font-semibold">{review.name}</p>
                <div className="flex items-center text-sm text-slate-500">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1"/>
                    {/* --- UPDATE: Use the formatted date from the database --- */}
                    <span>{review.rating} &bull; {formatDate(review.createdAt)}</span>
                </div>
            </div>
        </div>
        <p className="mt-3 text-slate-700 leading-relaxed">{review.text}</p>
    </div>
);

// --- UPDATE: The form now passes up only the necessary data for the API call ---
const AddReviewForm = ({ onAddReview }: { onAddReview: (review: { text: string; rating: number }) => void }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text && rating > 0) {
            onAddReview({ text, rating });
            setText("");
            setRating(0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold">Leave a review</h3>
            <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={cn("h-6 w-6 cursor-pointer", rating >= star ? "text-yellow-400" : "text-slate-300")}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            <Textarea 
                placeholder="Share your experience..." 
                value={text}
                onChange={e => setText(e.target.value)}
                className="mt-2"
            />
            <Button type="submit" className="mt-3 rounded-full">Submit Review</Button>
        </form>
    );
};

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [place, setPlace] = useState<Place | null>(null);
  // --- UPDATE: Initialize reviews as an empty array ---
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- UPDATE: useEffect now fetches both hotel details and reviews ---
  useEffect(() => {
    if (!id) return;

    const fetchHotelData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch both resources at the same time for efficiency
        const [hotelRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/accommodations/${id}`),
          fetch(`http://localhost:5000/api/accommodations/${id}/reviews`)
        ]);

        if (!hotelRes.ok) throw new Error('Hotel not found');
        if (!reviewsRes.ok) throw new Error('Could not fetch reviews');
        
        const hotelData = await hotelRes.json();
        const reviewsData = await reviewsRes.json();

        const formattedData: Place = {
          ...hotelData,
          id: hotelData._id,
          category: 'stay',
          latitude: hotelData.coordinates?.lat,
          longitude: hotelData.coordinates?.lng,
        };
        setPlace(formattedData);
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load hotel details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  // --- UPDATE: This function now sends the new review to the backend API ---
  const handleAddReview = async (reviewData: { text: string; rating: number }) => {
    if (!id) return;

    try {
        const response = await fetch(`http://localhost:5000/api/accommodations/${id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...reviewData,
                name: "Guest User", // In a real app, this would come from user auth
            }),
        });

        if (!response.ok) throw new Error('Failed to submit review');
        
        const savedReview = await response.json();
        
        // 1. Update the UI immediately with the new review
        setReviews([savedReview, ...reviews]);

        // 2. Re-fetch the hotel data to get the new average rating and review count
        const hotelResponse = await fetch(`http://localhost:5000/api/accommodations/${id}`);
        const updatedHotelData = await hotelResponse.json();
        setPlace(prevPlace => prevPlace ? { ...prevPlace, ...updatedHotelData } : null);

    } catch (error) {
        console.error("Error submitting review:", error);
        // Optionally, set an error state here to inform the user
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading hotel details...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
  }

  if (!place) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 font-semibold text-slate-800 hover:text-slate-900 mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to results
          </button>
          <h1 className="text-4xl font-bold">{place.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{place.rating}</span>
            <span className="text-slate-500">({place.reviews.toLocaleString()} reviews)</span>
            <span className="text-slate-500">&bull;</span>
            <span className="font-semibold underline cursor-pointer">{place.type}</span>
          </div>
        </div>

        {(() => {
          const fallback = "/hero/hero-1.jpg";
          const gallery = (place.images || []).filter(Boolean);
          const primary = gallery[0] || fallback;
          const others = gallery.slice(1, 5);
          return (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 relative">
                <Image src={primary} alt={place.name} fill sizes="(max-width: 768px) 100vw, 50vw" style={{objectFit: 'cover'}} className="hover:opacity-90 transition-opacity" />
              </div>
              {others.map((src, idx) => (
                <div key={idx} className="col-span-1 row-span-1 relative">
                  <Image src={src} alt={`${place.name} ${idx + 2}`} fill sizes="(max-width: 768px) 50vw, 25vw" style={{objectFit: 'cover'}} className="hover:opacity-90 transition-opacity" />
                </div>
              ))}
            </div>
          );
        })()}

        <div className="grid grid-cols-12 gap-12 mt-12">
          <div className="col-span-7">
            <div className="pb-8 border-b">
              <h2 className="text-2xl font-semibold">About this place</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                 {place.description || `A placeholder description for the ${place.name}. In a real application, this section would be filled with rich, compelling copy detailing the hotel's history, unique selling points, and the experience guests can expect.`}
              </p>
            </div>
            
            <div className="py-8 border-b">
              <h2 className="text-2xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-6 mt-6">
                {place.amenities?.wifi && <div className="flex items-center gap-3 text-lg"><WifiIcon className="h-6 w-6"/> Free Wifi</div>}
                {place.amenities?.pool && <div className="flex items-center gap-3 text-lg"><PoolIcon className="h-6 w-6"/> Pool</div>}
              </div>
            </div>
            
            <div className="py-8">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* --- UPDATE: Use the unique _id from the database as the key --- */}
                    {reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))}
                </div>
                <AddReviewForm onAddReview={handleAddReview} />
            </div>
          </div>
          <div className="col-span-5">
            <BookingPanel place={place} />
          </div>
        </div>
      </div>
    </div>
  );
}