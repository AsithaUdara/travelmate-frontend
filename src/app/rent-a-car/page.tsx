"use client";

import React, { useState } from 'react';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RentACarPage() {
    const router = useRouter();
    const [pickup, setPickup] = useState('Colombo Fort');
    const [dropoff, setDropoff] = useState('Bambalapitiya');
    const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10));
    const [time, setTime] = useState<string>(() => new Date().toTimeString().slice(0,5));
    const [type, setType] = useState('Any vehicle type');

    const onSearch = () => {
        // For now just navigate to results; you can pass params later if needed
        router.push('/rent-a-car/results');
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-50">
            <ExploreHeader />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold">Vehicle Booking Platform</h1>
                    <div className="mt-6 relative rounded-2xl overflow-hidden">
                        <div className="h-72 w-full bg-[url('https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1600')] bg-cover bg-center" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full max-w-4xl bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6">
                                <h2 className="text-center text-2xl font-bold">Find Your Perfect Vehicle</h2>
                                <p className="text-center text-slate-600">Choose from cars, vans, bikes and more across Sri Lanka</p>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Pickup Location</label>
                                        <select className="w-full border rounded-md p-2" value={pickup} onChange={e=>setPickup(e.target.value)}>
                                            <option>Colombo Fort</option>
                                            <option>Mount Lavinia</option>
                                            <option>Kandy</option>
                                            <option>Ella</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Drop-off Location</label>
                                        <select className="w-full border rounded-md p-2" value={dropoff} onChange={e=>setDropoff(e.target.value)}>
                                            <option>Bambalapitiya</option>
                                            <option>Colombo Fort</option>
                                            <option>Kandy</option>
                                            <option>Ella</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Pickup Date</label>
                                        <input className="w-full border rounded-md p-2" type="date" value={date} onChange={e=>setDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Pickup Time</label>
                                        <input className="w-full border rounded-md p-2" type="time" value={time} onChange={e=>setTime(e.target.value)} />
                                    </div>
                                    <div className="lg:col-span-4">
                                        <label className="block text-sm text-slate-600 mb-1">Vehicle Type</label>
                                        <select className="w-full border rounded-md p-2" value={type} onChange={e=>setType(e.target.value)}>
                                            <option>Any vehicle type</option>
                                            <option>Car</option>
                                            <option>Van</option>
                                            <option>Tuk-tuk</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-center">
                                    <Button onClick={onSearch} className="rounded-full px-6 h-12 text-base">Search Available Vehicles</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
