"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TransportOption } from '@/lib/trip-data';
import { TravelLeg } from './TransportView';
import { Button } from '../ui/button';
import { StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, TagIcon, SparklesIcon, TruckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { getAITransportOptions } from '@/services/ai';

type TransportSelectionPanelProps = {
  selectedLeg: TravelLeg | null;
  onSelectOption: (option: TransportOption) => void;
  tripInterests: string[];
};

const ComfortRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} className={cn('h-5 w-5', i < rating ? 'text-yellow-400' : 'text-slate-300')} />
    ))}
  </div>
);

export const TransportSelectionPanel = ({ selectedLeg, onSelectOption, tripInterests }: TransportSelectionPanelProps) => {
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedCache, setUsedCache] = useState(false);
  // In-session cache by leg key: `${from}->${to}`
  const cacheRef = useRef<Map<string, TransportOption[]>>(new Map());
  const legKey = useMemo(() => selectedLeg ? `${selectedLeg.from} -> ${selectedLeg.to}` : '', [selectedLeg]);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!selectedLeg) return;
      setIsLoading(true);
      setError(null);
      try {
        const cached = cacheRef.current.get(legKey);
        if (cached) {
          setOptions(cached);
          setUsedCache(true);
        } else {
          const { data, fromCache } = await getAITransportOptions(selectedLeg.from, selectedLeg.to, tripInterests || []);
          cacheRef.current.set(legKey, data);
          setOptions(data);
          setUsedCache(!!fromCache);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch options.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, [selectedLeg, tripInterests, legKey]);

  if (!selectedLeg) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center p-8">
        <TruckIcon className="h-16 w-16 text-slate-300" />
        <h2 className="mt-4 text-2xl font-bold">Select a travel leg</h2>
        <p className="mt-1 text-slate-500">Choose a journey from the sidebar to see your personalized transport options.</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex-1 min-h-0 overflow-y-auto">
      <h2 className="text-3xl font-bold">Options for {selectedLeg.from} to {selectedLeg.to}</h2>
      {usedCache && !isLoading && !error && (
        <p className="mt-2 text-xs text-slate-500">Using cached options</p>
      )}

      {isLoading && <p className="mt-6 text-slate-500">Asking our AI for the best routes...</p>}
      {error && <p className="mt-6 text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      <AnimatePresence>
        {!isLoading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid grid-cols-1 gap-4">
            {options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  'p-4 border rounded-lg flex items-center justify-between transition-all bg-white',
                  option.isRecommended ? 'border-slate-900 border-2 shadow-lg' : ''
                )}
              >
                <div className="flex-1">
                  {option.isRecommended && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                      <SparklesIcon className="h-4 w-4" /> AI Recommended
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{option.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{option.details}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5" /> ~{option.time} hours
                    </div>
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-5 w-5" /> LKR {option.cost.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      Comfort: <ComfortRating rating={option.comfort} />
                    </div>
                  </div>
                </div>
                <div className="w-48 text-right flex-shrink-0">
                  <Button type="button" className="w-full rounded-full font-semibold" onClick={() => onSelectOption(option)}>
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};