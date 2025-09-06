"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapIcon, CalendarDaysIcon, WalletIcon, BellIcon, CogIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/plan/itinerary', icon: MapIcon, label: 'Itinerary' },
  { href: '/plan/calendar', icon: CalendarDaysIcon, label: 'Calendar' },
  { href: '/plan/budget', icon: WalletIcon, label: 'Budget' },
  { href: '/plan/alerts', icon: BellIcon, label: 'Alerts' },
  { href: '/plan/settings', icon: CogIcon, label: 'Settings' },
];

export const PlanVerticalNav = () => {
  const pathname = usePathname();

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
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg w-20 h-20 transition-colors",
              pathname.startsWith(item.href) ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
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