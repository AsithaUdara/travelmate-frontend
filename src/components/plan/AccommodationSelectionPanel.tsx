"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { mockPlaces, Place } from '@/lib/mock-data';
import { ResultCard } from '../explore/ResultCard';
import { FilterSheet } from './FilterSheet';
import { Button } from '@/components/ui/button';
import { ArrowsUpDownIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ExploreMap = dynamic(() =>
  import('@/components/explore/ExploreMap').then(mod => mod.ExploreMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

type AccommodationSelectionPanelProps = {
  locationName: string;
};

export const AccommodationSelectionPanel = ({ locationName }: AccommodationSelectionPanelProps) => {
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const router = useRouter();

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

  // Filtered list based on applied filters and location match
  const filteredStays = useMemo(() => {
    const base = mockPlaces.filter(place => 
      place.category === 'stay' &&
      place.price >= appliedFilters.priceRange[0] &&
      place.price <= appliedFilters.priceRange[1] &&
      place.rating >= (appliedFilters.minRating || 0)
    );
    const nameLower = locationName.toLowerCase();
    const narrowed = base.filter(p => p.name.toLowerCase().includes(nameLower) || p.type.toLowerCase().includes(nameLower));
    return narrowed.length > 0 ? narrowed : base;
  }, [appliedFilters, locationName]);

  // AI Recommended stay: highest rating among filtered
  const aiRecommendedStay = useMemo(() => {
    if (filteredStays.length === 0) return null;
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
        {aiRecommendedStay && (
          <div className="mb-4 border-2 border-slate-900 p-3 rounded-none">
                        <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon className="h-5 w-5 text-blue-600"/>
                            <h3 className="font-bold text-lg">AI Top Pick for you</h3>
                        </div>
                        <div onClick={() => router.push(`/plan/hotel/${aiRecommendedStay.id}`)} className="cursor-pointer">
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
                {otherStays.length === 0 && !aiRecommendedStay ? (
                  <div className="p-6 border rounded-lg bg-white text-center text-slate-600">No stays match your filters. Try adjusting the price, radius, or rating.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                      {otherStays.map(place => (
                          <div key={place.id} onClick={() => router.push(`/plan/hotel/${place.id}`)} className="cursor-pointer">
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
