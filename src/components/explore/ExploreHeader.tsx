"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const ExploreHeader = () => {
  const pathname = usePathname();

  // This function checks if the current URL starts with a given path
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className="flex-shrink-0 border-b z-10 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div>
          <h1 className="font-bold text-xl">
            {isActive('/plan') ? 'Plan Your Trip' : 'Near Me'}
          </h1>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          <Link href="/plan">
            <Button variant="ghost" className={cn("rounded-full font-semibold", isActive('/plan') && "bg-white shadow-sm text-slate-900")}>
              Plan your trip
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="ghost" className={cn("rounded-full font-semibold", isActive('/explore') && "bg-white shadow-sm text-slate-900")}>
              Near me
            </Button>
          </Link>
          <Link href="/hire">
            <Button variant="ghost" className="rounded-full font-semibold">
              Pick me
            </Button>
          </Link>
          <Link href="/favorites">
            <Button variant="ghost" className="rounded-full font-semibold">
              My Favourite
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircleIcon className="h-6 w-6" />
          </Button>
           <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};