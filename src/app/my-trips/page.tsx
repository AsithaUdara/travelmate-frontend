"use client";

import React, { useState, useEffect } from 'react';
import { Trip } from '@/lib/trip-data';
import { getAllTrips } from '@/lib/trip-manager';
import { ExploreHeader } from '@/components/explore/ExploreHeader'; // Reusing our header
import Link from 'next/link';
import Image from 'next/image';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';

const TripCard = ({ trip }: { trip: Trip }) => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const duration = differenceInDays(endDate, startDate);

    return (
        <Link href={`/trip/${trip.id}`} className="block border rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="relative h-48 w-full">
                {/* In a real app, this would be a map snapshot or a cover photo */}
                <Image src="https://images.unsplash.com/photo-1598403337953-83f5117e3b91?w=500" alt={trip.name} fill style={{objectFit: 'cover'}} className="transition-transform duration-300 group-hover:scale-105"/>
            </div>
            <div className="p-4 bg-white">
                <h2 className="font-bold text-lg truncate">{trip.name}</h2>
                <p className="text-sm text-slate-500">{format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}</p>
                <p className="text-sm text-slate-500">{duration} Days in Sri Lanka</p>
            </div>
        </Link>
    )
}

export default function MyTripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        // Fetch trips from localStorage on the client-side
        setTrips(getAllTrips());
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50">
            <ExploreHeader />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold">My Trips</h1>
                    {trips.length > 0 ? (
                         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map(trip => (
                                <TripCard key={trip.id} trip={trip} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-12 text-center">
                            <h2 className="text-xl font-semibold">You have no saved trips yet.</h2>
                            <p className="text-slate-500 mt-2">Let's start planning your next adventure!</p>
                            <Link href="/plan">
                                <Button className="mt-4 rounded-full">Plan a New Trip</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}