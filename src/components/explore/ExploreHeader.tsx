import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

export const ExploreHeader = () => {
  return (
    <header className="flex-shrink-0 border-b z-10 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Left Side: Title */}
        <div>
          <h1 className="font-bold text-xl">Near Me</h1>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          <Link href="/plan"><Button variant="ghost" className="rounded-full font-semibold">Plan your trip</Button></Link>
          <Link href="/explore"><Button variant="ghost" className="bg-white rounded-full shadow-sm text-slate-900 font-semibold">Near me</Button></Link>
          <Link href="/hire"><Button variant="ghost" className="rounded-full font-semibold">Pick me</Button></Link>
          <Link href="/favorites"><Button variant="ghost" className="rounded-full font-semibold">My Favourite</Button></Link>
        </nav>

        {/* Right Side: Actions */}
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