"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapIcon, CalendarDaysIcon, GlobeAltIcon, HomeModernIcon, CloudIcon, TruckIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

type NavItem = { href: string; icon: any; label: string; requiredStep?: number };

// New order and items
const navItems: NavItem[] = [
  { href: '/plan/itinerary', icon: MapIcon, label: 'Itinerary', requiredStep: 1 },
  { href: '/plan/transport', icon: TruckIcon, label: 'Transport', requiredStep: 2 },
  { href: '/plan/accommodation', icon: HomeModernIcon, label: 'Accommodation', requiredStep: 3 },
  { href: '/plan/calendar', icon: CalendarDaysIcon, label: 'Calendar', requiredStep: 1 },
  { href: '/plan/weather', icon: CloudIcon, label: 'Weather', requiredStep: 1 },
];

export const PlanVerticalNav = () => {
  const pathname = usePathname();
  const [planStarted, setPlanStarted] = useState<boolean>(false);
  const [stepUnlocked, setStepUnlocked] = useState<number>(0);

  useEffect(() => {
    const load = () => {
      try {
        const started = typeof window !== 'undefined' ? localStorage.getItem('tm_plan_started') : null;
        setPlanStarted(started === '1');
        const stepStr = typeof window !== 'undefined' ? localStorage.getItem('tm_plan_step') : null;
        const n = stepStr ? parseInt(stepStr) : 0;
        setStepUnlocked(Number.isFinite(n) ? n : 0);
      } catch {}
    };
    load();
    const onStarted = () => setPlanStarted(true);
    const onStep = (e: any) => {
      const v = e?.detail?.step ?? null;
      if (typeof v === 'number') setStepUnlocked(v);
      else load();
    };
    document.addEventListener('tm:plan-started', onStarted);
    document.addEventListener('tm:plan-step', onStep as any);
    return () => {
      document.removeEventListener('tm:plan-started', onStarted);
      document.removeEventListener('tm:plan-step', onStep as any);
    };
  }, []);

  return (
    <nav className="flex flex-col items-center gap-4 p-4 border-r bg-white">
      <Link href="/" className="p-2 mb-4">
        <GlobeAltIcon className="h-8 w-8 text-slate-900" />
      </Link>
      <div className="flex flex-col items-center gap-2">
        {navItems.map(item => {
          const isItin = item.label === 'Itinerary';
          // Itinerary is always clickable; others depend on plan start and required step
          const meetsStep = (item.requiredStep ?? 1) <= stepUnlocked || isItin;
          const isEnabled = (planStarted && meetsStep) || isItin;
          const baseClasses = cn(
            "flex flex-col items-center justify-center p-3 rounded-lg w-20 h-20 transition-colors",
            pathname.startsWith(item.href) ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100',
            !isEnabled && 'opacity-50 pointer-events-none'
          );
          return (
            <Link key={item.href} href={item.href} className={baseClasses}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};