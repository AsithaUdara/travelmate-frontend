"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, CheckCircle, Globe as GlobeAlt } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; isActive: (pathname: string, params: URLSearchParams) => boolean };

const items: NavItem[] = [
  {
    href: '/rent-a-car',
    label: 'Search',
    icon: Search,
    isActive: (pathname) => pathname === '/rent-a-car',
  },
  {
    href: '/rent-a-car?tab=bookings',
    label: 'Bookings',
    icon: CheckCircle,
    isActive: (pathname, params) => pathname === '/rent-a-car' && params.get('tab') === 'bookings',
  },
];

export const RentVerticalNav = () => {
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <nav className="flex flex-col items-center gap-4 p-4 border-r bg-white">
      <Link href="/" className="p-2 mb-4">
        <GlobeAlt className="h-8 w-8 text-slate-900" />
      </Link>
      <div className="flex flex-col items-center gap-2">
        {items.map(({ href, label, icon: Icon, isActive }) => {
          const active = isActive(pathname, params as any);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-lg w-20 h-20 transition-colors',
                active ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1 font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
