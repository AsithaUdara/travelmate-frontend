"use client";

import React, { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { mockPlaces } from '@/lib/mock-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, StarIcon, WifiIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { BookingPanel } from '@/components/plan/BookingPanel';
import { PoolIcon } from '@/components/icons/PoolIcon';

type Review = { name: string; text: string; rating: number; date: string; };

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
                    <span>{review.rating} &bull; {review.date}</span>
                </div>
            </div>
        </div>
  <p className="mt-3 text-slate-700 leading-relaxed">{review.text}</p>
    </div>
);

const AddReviewForm = ({ onAddReview }: { onAddReview: (review: Review) => void }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text && rating > 0) {
            onAddReview({ name: "You", text, rating, date: "Just now" });
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
  const { id } = React.use(params);
  const place = mockPlaces.find(p => p.id === id);
  const [reviews, setReviews] = useState<Review[]>([
        { name: "Alex", text: "An absolutely stunning hotel with incredible service. The views are breathtaking. Highly recommended!", rating: 5, date: "October 2025" },
        { name: "Maria", text: "We had a wonderful stay. The location is perfect, and the staff were so friendly and helpful.", rating: 4, date: "October 2025" },
    ]);

  if (!place) {
    notFound();
  }

  const handleAddReview = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 font-semibold text-slate-800 hover:text-slate-900 mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to results
          </button>
          <h1 className="text-4xl font-bold">{place!.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{place!.rating}</span>
            <span className="text-slate-500">({place!.reviews.toLocaleString()} reviews)</span>
            <span className="text-slate-500">&bull;</span>
            <span className="font-semibold underline cursor-pointer">{place!.type}, Colombo</span>
          </div>
        </div>

        {/* Image Gallery (safe fallbacks, only render existing images) */}
        {(() => {
          const fallback = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
          const gallery = (place!.images || []).filter(Boolean);
          const primary = gallery[0] || fallback;
          const others = gallery.slice(1, 5);
          return (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 relative">
                <Image src={primary} alt={place!.name} fill style={{objectFit: 'cover'}} className="hover:opacity-90 transition-opacity" />
              </div>
              {others.map((src, idx) => (
                <div key={idx} className="col-span-1 row-span-1 relative">
                  <Image src={src} alt={`${place!.name} ${idx + 2}`} fill style={{objectFit: 'cover'}} className="hover:opacity-90 transition-opacity" />
                </div>
              ))}
            </div>
          );
        })()}

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-12 mt-12">
          <div className="col-span-7">
            {/* Description */}
            <div className="pb-8 border-b">
              <h2 className="text-2xl font-semibold">About this place</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                A placeholder description for the {place!.name}. In a real application, this section would be filled with rich, compelling copy detailing the hotel's history, unique selling points, and the experience guests can expect. It would highlight key features and create an emotional connection with the potential visitor.
              </p>
            </div>
            
            {/* Amenities */}
      <div className="py-8 border-b">
        <h2 className="text-2xl font-semibold">What this place offers</h2>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex items-center gap-3 text-lg"><WifiIcon className="h-6 w-6"/> Free Wifi</div>
          <div className="flex items-center gap-3 text-lg"><PoolIcon className="h-6 w-6"/> Pool</div>
        </div>
      </div>
            
             {/* Reviews */}
            <div className="py-8">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
                <AddReviewForm onAddReview={handleAddReview} />
            </div>

          </div>
          <div className="col-span-5">
            <BookingPanel place={place!} />
          </div>
        </div>
      </div>
    </div>
  );
}
