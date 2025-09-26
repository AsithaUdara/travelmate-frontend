"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight, MapPin, Calendar as CalendarIcon, Users, Sparkles, Utensils, Waves, PawPrint } from 'lucide-react';

const interestTags = [
  { name: 'Hiking', icon: PawPrint },
  { name: 'Cultural Sites', icon: Sparkles },
  { name: 'Local Food', icon: Utensils },
  { name: 'Beaches', icon: Waves },
  { name: 'Wildlife', icon: PawPrint },
];

export const InitialPlanner = () => {
  const router = useRouter();
  // Start with no pre-filled values; everything is user-entered
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerateClick = async () => {
    if (!start || !end || selectedInterests.length === 0 || !startDate || !endDate || !travelers) {
      setError("Please fill in all fields and select at least one interest.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start,
          end,
          interests: selectedInterests,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          travelers: typeof travelers === 'number' ? travelers : Number(travelers),
        })
      });
  const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to generate trip.');
  // Attach interests so the itinerary page and detail views can use them for AI suggestions
  data.interests = selectedInterests;
  const encoded = btoa(JSON.stringify(data));
      router.push(`/plan/itinerary?trip=${encoded}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate trip.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-2xl"
    >
      {error && (
        <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>
      )}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Let's plan your perfect Sri Lankan adventure</h1>
        <p className="mt-2 text-slate-600">Tell us what you're looking for, and our AI will create a personalized outline.</p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="h-5 w-5"/> Starting from
            </label>
            <Input placeholder="Enter starting city" value={start} onChange={e => setStart(e.target.value)} className="h-12 rounded-lg bg-slate-100 border-transparent focus:bg-white focus:border-slate-300"/>
          </div>
          <div className="grid gap-2">
            <label className="font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="h-5 w-5"/> Going to
            </label>
            <Input placeholder="Enter destination(s)" value={end} onChange={e => setEnd(e.target.value)} className="h-12 rounded-lg bg-slate-100 border-transparent focus:bg-white focus:border-slate-300"/>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="grid gap-2 col-span-2">
            <label className="font-semibold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5"/> Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("h-12 justify-start text-left font-normal rounded-lg bg-slate-100 border-transparent text-slate-900 hover:bg-slate-100")}> 
                  {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2 col-span-2">
            <label className="font-semibold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5"/> End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("h-12 justify-start text-left font-normal rounded-lg bg-slate-100 border-transparent text-slate-900 hover:bg-slate-100")}> 
                  {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={startDate ? { before: startDate } : undefined} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2 col-span-1">
            <label className="font-semibold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5"/> Travelers
            </label>
            <Input
              type="number"
              placeholder="e.g., 2"
              value={travelers}
              onChange={e => {
                const val = e.target.value;
                if (val === '') {
                  setTravelers('');
                } else {
                  const n = Number(val);
                  setTravelers(Number.isNaN(n) ? '' : n);
                }
              }}
              className="h-12 rounded-lg bg-slate-100 border-transparent focus:bg-white focus:border-slate-300"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="font-semibold text-slate-800">Your Interests</label>
          <div className="flex flex-wrap gap-2">
            {interestTags.map(({ name, icon: Icon }) => (
              <Badge
                key={name}
                variant={selectedInterests.includes(name) ? 'default' : 'outline'}
                onClick={() => toggleInterest(name)}
                className={cn(
                  'cursor-pointer py-2 px-4 rounded-full text-sm flex items-center gap-2 transition-all border-2',
                  selectedInterests.includes(name)
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 border-slate-100 text-slate-700 hover:border-slate-300'
                )}
              >
                <Icon className="h-4 w-4" /> {name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button size="lg" className="w-full h-14 rounded-full text-lg" onClick={handleGenerateClick} disabled={isLoading}>
          <span className="flex items-center justify-between w-full px-2">
            <span>{isLoading ? 'Generating Your Adventure...' : 'Generate My Trip Outline'}</span>
            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </span>
        </Button>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl">
          <p className="font-semibold text-lg">AI is generating your trip...</p>
        </div>
      )}
    </motion.div>
  );
};