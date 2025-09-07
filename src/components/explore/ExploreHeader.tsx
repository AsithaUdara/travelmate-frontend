"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowLeftOnRectangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
// useState moved into React import above

export const ExploreHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showRentTip, setShowRentTip] = useState(false);
  const rentLinkRef = useRef<HTMLDivElement | null>(null);

  // This function checks if the current URL starts with a given path
  const isActive = (path: string) => pathname.startsWith(path);

  const getTitle = () => {
    if (isActive('/plan')) return 'Plan Your Trip';
    if (isActive('/explore')) return 'Near Me';
  if (isActive('/rent-a-car')) return 'Rent a Car';
    if (isActive('/my-trips') || isActive('/trip')) return 'My Trips';
    return 'TravelMate';
  }

  useEffect(() => {
    const onShow = () => {
      if (pathname.startsWith('/plan') || pathname.startsWith('/rent-a-car')) {
        setShowRentTip(true);
      }
    };
    document.addEventListener('tm:show-rental-notice', onShow);
    return () => document.removeEventListener('tm:show-rental-notice', onShow);
  }, [pathname]);

  return (
  <header className="flex-shrink-0 border-b z-10 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div>
          <h1 className="font-bold text-xl">{getTitle()}</h1>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          <Link href="/plan"><Button variant="ghost" className={cn("rounded-full font-semibold", isActive('/plan') && "bg-white shadow-sm text-slate-900")}>Plan your trip</Button></Link>
          <Link href="/explore"><Button variant="ghost" className={cn("rounded-full font-semibold", isActive('/explore') && "bg-white shadow-sm text-slate-900")}>Near me</Button></Link>
          <div ref={rentLinkRef} className="relative">
            <Link href="/rent-a-car"><Button variant="ghost" className={cn("rounded-full font-semibold", isActive('/rent-a-car') && "bg-white shadow-sm text-slate-900")}>Rent a Car</Button></Link>
            {showRentTip && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-[360px] rounded-lg border border-blue-200 bg-blue-50 text-blue-800 text-xs px-3 py-2 shadow-lg">
                {/* caret */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-blue-50 border-l border-t border-blue-200"></div>
                <div className="flex items-center gap-2">
                  <InformationCircleIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <span className="align-middle">Tip: You can rent a vehicle here. Pick a vehicle that suits your journey.</span>
                  <button className="ml-1 text-blue-600 hover:text-blue-700 underline" onClick={() => setShowRentTip(false)}>Dismiss</button>
                </div>
              </div>
            )}
          </div>
          <Link href="/my-trips"><Button variant="ghost" className={cn("rounded-full font-semibold", (isActive('/my-trips') || isActive('/trip')) && "bg-white shadow-sm text-slate-900")}>My Trips</Button></Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircleIcon className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => {
              try {
                localStorage.removeItem('tm_is_authenticated');
              } catch {}
              router.push('/');
            }}
            aria-label="Logout"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
