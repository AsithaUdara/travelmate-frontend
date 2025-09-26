"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Place } from '@/lib/mock-data';
import { mockPlaces } from '@/lib/mock-data';
import { ResultCard } from '../explore/ResultCard';
import { FilterSheet } from './FilterSheet';
import { Button } from '@/components/ui/button';
import { ArrowsUpDownIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getAIAccommodationSuggestions } from '@/services/ai';
import { DEFAULT_HOTEL_IMAGE } from '@/config/images';

const ExploreMap = dynamic(() =>
  import('@/components/explore/ExploreMap').then(mod => mod.ExploreMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

type AccommodationSelectionPanelProps = {
  locationName: string;
  interests?: string[];
};

export const AccommodationSelectionPanel = ({ locationName, interests = [] }: AccommodationSelectionPanelProps) => {
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [places, setPlaces] = useState<(Place & { isRecommended?: boolean })[]>([]);

  // Filter state (editable)
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 200000]);
  const [radius, setRadius] = useState<number>(10);
  // Applied filters (committed from the sheet)
  const [appliedFilters, setAppliedFilters] = useState({ priceRange, radius, minRating: 0, amenities: { wifi: false, pool: false } });

  // Sort state
  type SortKey = 'top-picks' | 'price-asc' | 'price-desc' | 'rating-desc' | 'reviews-desc';
  const [sortBy, setSortBy] = useState<SortKey>('top-picks');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tm_acc_sort_by') as SortKey | null;
      if (saved) setSortBy(saved);
    } catch {}
  }, []);

  const onChangeSort = (key: SortKey) => {
    setSortBy(key);
    try { localStorage.setItem('tm_acc_sort_by', key); } catch {}
    setSortOpen(false);
  };

  const handleApplyFilters = () => {
    let minRating = 0; let amenities = { wifi: false, pool: false };
    try {
      const mr = localStorage.getItem('tm_acc_min_rating');
      const am = localStorage.getItem('tm_acc_amenities');
      if (mr) minRating = parseFloat(mr);
      if (am) amenities = JSON.parse(am);
    } catch {}
    setAppliedFilters({ priceRange, radius, minRating, amenities });
  };

  const handleClearFilters = () => {
    const defaults = { priceRange: [10000, 200000] as [number, number], radius: 10 };
    setPriceRange(defaults.priceRange);
    setRadius(defaults.radius);
    setAppliedFilters({ ...defaults, minRating: 0, amenities: { wifi: false, pool: false } });
  };

  // Fetch AI accommodation suggestions when locationName or interests change
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!locationName) return;
      setLoading(true); setError(null);
      try {
        const { data, fromCache: fc } = await getAIAccommodationSuggestions(locationName, interests || []);
        if (ignore) return;
        // Enforce default image for all stays regardless of provided images
        const normalized = (data || []).map(p => ({
          ...p,
          images: [DEFAULT_HOTEL_IMAGE],
        }));
        setPlaces(normalized);
        setFromCache(fc);
      } catch (e: any) {
        if (ignore) return;
        // Fallback to local mock data so the UI is still usable in dev/offline
        setError(e?.message || 'Failed to load accommodation suggestions');
        const nameLower = locationName.toLowerCase();
        const local = mockPlaces.filter(p => p.category === 'stay' && (
          p.name.toLowerCase().includes(nameLower) || p.type.toLowerCase().includes(nameLower)
        ));
        const useLocal = local.length ? local : mockPlaces.filter(p => p.category === 'stay');
        // Mark highest-rated as recommended
        const sorted = [...useLocal].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        const withRec = sorted.map((p, i) => ({
          ...p,
          images: [DEFAULT_HOTEL_IMAGE],
          isRecommended: i === 0,
        }));
        setPlaces(withRec);
        setFromCache(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [locationName, interests]);

  // Apply client-side filters on AI results
  const filteredStays = useMemo(() => {
    const base = (places || []).filter(place => 
      place.category === 'stay' &&
      place.price >= appliedFilters.priceRange[0] &&
      place.price <= appliedFilters.priceRange[1] &&
      place.rating >= (appliedFilters.minRating || 0)
    );
    return base;
  }, [appliedFilters, places]);

  // AI Recommended stay: highest rating among filtered
  const aiRecommendedStay = useMemo(() => {
    if (filteredStays.length === 0) return null;
    const explicit = filteredStays.find(p => (p as any).isRecommended);
    if (explicit) return explicit as Place & { isRecommended?: boolean };
    return [...filteredStays].sort((a, b) => b.rating - a.rating)[0];
  }, [filteredStays]);

  // Others excluding the AI pick
  const otherStays = useMemo(() => {
    const base = aiRecommendedStay
      ? filteredStays.filter(p => p.id !== aiRecommendedStay.id)
      : filteredStays;
    const arr = [...base];
    switch (sortBy) {
      case 'price-asc':
        arr.sort((a, b) => a.price - b.price); break;
      case 'price-desc':
        arr.sort((a, b) => b.price - a.price); break;
      case 'rating-desc':
        arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case 'reviews-desc':
        arr.sort((a, b) => b.reviews - a.reviews || b.rating - a.rating); break;
      case 'top-picks':
      default:
        // A balanced sort: rating desc, then reviews desc, then price asc
        arr.sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews) || (a.price - b.price));
        break;
    }
    return arr;
  }, [aiRecommendedStay, filteredStays, sortBy]);

  const sortLabel = (key: SortKey) => {
    switch (key) {
      case 'price-asc': return 'Price: Low to High';
      case 'price-desc': return 'Price: High to Low';
      case 'rating-desc': return 'Rating';
      case 'reviews-desc': return 'Most Reviewed';
      case 'top-picks':
      default: return 'Top picks';
    }
  };

  return (
  <div className="grid grid-cols-12 h-full min-h-0">
    <div className="col-span-7 h-full min-h-0 flex flex-col">
      <div className="p-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Stays in {locationName}</h2>
                    <div className="flex items-center gap-2">
                        <FilterSheet 
                            priceRange={priceRange} 
                            setPriceRange={setPriceRange}
                            radius={radius}
                            setRadius={setRadius}
                            onApply={handleApplyFilters}
                            onClear={handleClearFilters}
                        />
                        {fromCache && (
                          <span className="text-xs text-slate-500">Using cached options</span>
                        )}
                        <Popover open={sortOpen} onOpenChange={setSortOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 rounded-full font-semibold">
                              Sort by: {sortLabel(sortBy)} <ArrowsUpDownIcon className="h-5 w-5 ml-2" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-1" align="end">
                            <div className="text-sm">
                              {([
                                'top-picks',
                                'price-asc',
                                'price-desc',
                                'rating-desc',
                                'reviews-desc',
                              ] as SortKey[]).map((key) => (
                                <button
                                  key={key}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-50 ${sortBy === key ? 'font-semibold' : ''}`}
                                  onClick={() => onChangeSort(key)}
                                >
                                  <span>{sortLabel(key)}</span>
                                  {sortBy === key && <CheckIcon className="h-4 w-4 text-blue-600" />}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto p-3">
        {loading && (
          <div className="p-6 border rounded-lg bg-white text-center text-slate-600">Loading stays…</div>
        )}
        {error && !loading && (
          <div className="p-6 border rounded-lg bg-white text-center text-red-600">{error}</div>
        )}
        {aiRecommendedStay && (
          <div className="mb-4 border-2 border-slate-900 p-3 rounded-none">
                        <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon className="h-5 w-5 text-blue-600"/>
                            <h3 className="font-bold text-lg">AI Top Pick for you</h3>
                        </div>
                        <div onClick={() => {
                          try {
                            const b64 = btoa(JSON.stringify(aiRecommendedStay));
                            router.push(`/plan/hotel/detail?place=${b64}`);
                          } catch {}
                        }} className="cursor-pointer">
                             <ResultCard 
                                place={aiRecommendedStay} 
                                onHover={setHoveredPlaceId}
                                isHovered={hoveredPlaceId === aiRecommendedStay.id}
                                isRecommended
                            />
                        </div>
                    </div>
                )}

                {/* Single-column list */}
                {otherStays.length === 0 && !aiRecommendedStay && !loading ? (
                  <div className="p-6 border rounded-lg bg-white text-center text-slate-600">No stays match your filters. Try adjusting the price, radius, or rating.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                      {otherStays.map(place => (
                          <div key={place.id} onClick={() => {
                try {
                  const b64 = btoa(JSON.stringify(place));
                              router.push(`/plan/hotel/detail?place=${b64}`);
                            } catch {}
                          }} className="cursor-pointer">
                               <ResultCard 
                                  place={place} 
                                  onHover={setHoveredPlaceId}
                                  isHovered={hoveredPlaceId === place.id}
                              />
                          </div>
                      ))}
                  </div>
                )}
            </div>
        </div>
  <div className="col-span-5 h-full min-h-0">
            <ExploreMap 
                places={filteredStays}
                hoveredPlaceId={hoveredPlaceId}
                onMarkerHover={setHoveredPlaceId}
                category='stay'
            />
        </div>
    </div>
  );
};
