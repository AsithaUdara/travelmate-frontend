"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BuildingOffice2Icon, SparklesIcon, FireIcon, MapIcon, BanknotesIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

// --- MODIFIED navItems ARRAY ---
const navItems = [
  { href: '/explore?category=sights', icon: MapIcon, label: 'Sights', category: 'sights' },
  { href: '/explore?category=activity', icon: SparklesIcon, label: 'Activities', category: 'activity' },
  // This now points to your new accommodation search page
  { href: '/accommodation/search', icon: BuildingOffice2Icon, label: 'Stays', category: 'stay' }, 
  { href: '/explore?category=eat', icon: FireIcon, label: 'Eats', category: 'eat' },
  { href: '/explore?category=atm', icon: BanknotesIcon, label: 'ATMs', category: 'atm' },
];

export const VerticalNav = () => {
  const searchParams = useSearchParams();
  // We now default to 'stay' to match the active category for the accommodation page
  const activeCategory = searchParams.get('category') || 'stay'; 

  return (
    <nav className="flex flex-col items-center gap-4 p-4 border-r bg-white">
      <Link href="/" className="p-2 mb-4">
        <GlobeAltIcon className="h-8 w-8 text-slate-900" />
      </Link>
      <div className="flex flex-col items-center gap-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            scroll={false}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg w-20 h-20 transition-colors",
              // Logic to keep the 'Stays' button active on accommodation pages
              activeCategory === item.category ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1 font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};