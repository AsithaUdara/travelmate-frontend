"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Hotel, Utensils, Hospital, Landmark, Banknote, Bus, Heart, X, Plus } from 'lucide-react';

// --- KEY CHANGE IS HERE ---
const categories = [
  // This link now goes to your accommodation search page.
  { name: 'Hotels & Stays', icon: Hotel, href: '/accommodation/search', category: 'hotel' },

  // The rest of the links keep their original behavior.
  { name: 'Restaurants', icon: Utensils, href: '/explore?category=restaurant', category: 'restaurant' },
  { name: 'Hospitals', icon: Hospital, href: '/explore?category=hospital', category: 'hospital' },
  { name: 'Sights & Attractions', icon: Landmark, href: '/explore?category=attraction', category: 'attraction' },
  { name: 'ATMs', icon: Banknote, href: '/explore?category=atm', category: 'atm' },
  { name: 'Transportation', icon: Bus, href: '/explore?category=transport', category: 'transport' },
];

export const ExploreSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <aside className="w-96 h-full p-6 bg-white border-r overflow-y-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Explore</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input placeholder="Search and Explore" className="pl-10 h-12 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ name, icon: Icon, href, category }) => {
            // This logic correctly highlights the active link
            const isActive = (category && activeCategory === category) || pathname.startsWith(href);

            return (
              <Link key={name} href={href} scroll={false}>
                <Button 
                    variant="outline" 
                    className={cn(
                        "w-full h-14 flex items-center justify-start gap-3 rounded-xl",
                        isActive ? "bg-slate-100 border-slate-300 text-slate-900" : "hover:bg-slate-100"
                    )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{name}</span>
                </Button>
              </Link>
            )
        })}
      </div>
      
      <div className="border-t my-4" />
      
      <div className="space-y-4">
         <Button variant="ghost" className="w-full h-14 flex items-center justify-start gap-3 text-base">
            <Heart className="h-5 w-5" /> My Saved Places
        </Button>
         <Button variant="ghost" className="w-full h-14 flex items-center justify-start gap-3 text-base">
            <Plus className="h-5 w-5" /> Start Trip
        </Button>
      </div>
    </aside>
  );
};