"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BuildingOffice2Icon, SparklesIcon, FireIcon, MapIcon, BanknotesIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

const navItems = [
  { href: 'sights', icon: MapIcon, label: 'Sights' },
  { href: 'activity', icon: SparklesIcon, label: 'Activities' },
  { href: 'stay', icon: BuildingOffice2Icon, label: 'Stays' },
  { href: 'eat', icon: FireIcon, label: 'Eats' },
  { href: 'atm', icon: BanknotesIcon, label: 'ATMs' },
];

export const VerticalNav = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'sights';

  return (
    <nav className="flex flex-col items-center gap-4 p-4 border-r bg-white">
      <Link href="/" className="p-2 mb-4">
        <GlobeAltIcon className="h-8 w-8 text-slate-900" />
      </Link>
      <div className="flex flex-col items-center gap-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={`/explore?category=${item.href}`}
            scroll={false}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg w-20 h-20 transition-colors",
              activeCategory === item.href ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
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