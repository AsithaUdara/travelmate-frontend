"use client";

import React from 'react';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { mockVehicles } from '@/lib/trip-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/solid';

// Reusable card for the rental vehicle
const VehicleCard = ({ vehicle }: { vehicle: any }) => (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div className="relative h-48 w-full">
            <Image src={vehicle.image} alt={vehicle.name} fill style={{objectFit: 'cover'}} className="transition-transform duration-300 group-hover:scale-105"/>
        </div>
        <div className="p-4 bg-white">
            <h3 className="font-bold text-lg">{vehicle.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <UserGroupIcon className="h-5 w-5" />
                <span>Up to {vehicle.capacity} passengers</span>
            </div>
            <div className="flex items-end justify-between mt-4">
                <div>
                    <p className="font-bold text-xl">LKR {vehicle.pricePerDay.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">per day</p>
                </div>
                <Button className="rounded-full font-semibold">View Details</Button>
            </div>
        </div>
    </div>
);


export default function RentACarPage() {
    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50">
            <ExploreHeader />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold">Rent a Vehicle</h1>
                    <p className="text-slate-600 mt-1">Find the perfect ride for your Sri Lankan adventure.</p>
                    {/* Filter Bar */}
                    <div className="my-6 p-4 border rounded-xl bg-white flex items-center gap-4">
                        <Input placeholder="Search Location (e.g., Colombo)" className="h-12"/>
                        {/* Add more filters for price and radius here if needed */}
                        <Button size="lg" className="rounded-full h-12">Search</Button>
                    </div>
                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockVehicles.map(vehicle => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
