"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ExploreHeader = () => {
  const pathname = usePathname();

  // This function checks if the current URL starts with a given path
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className="flex-shrink-0 border-b z-10 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div>
          <h1 className="font-bold text-xl">
            {isActive('/plan') ? 'Plan Your Trip' : 
             isActive('/explore') ? 'Near Me' : 
             isActive('/hire') ? 'Pick Me' : 
             isActive('/favorites') ? 'My Favourite' : 'Explore'}
          </h1>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          <Link href="/plan">
            <button className={`px-4 py-2 rounded-full font-semibold text-sm ${isActive('/plan') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}>
              Plan your trip
            </button>
          </Link>
          <Link href="/explore">
            <button className={`px-4 py-2 rounded-full font-semibold text-sm ${isActive('/explore') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}>
              Near me
            </button>
          </Link>
          <Link href="/hire">
            <button className={`px-4 py-2 rounded-full font-semibold text-sm ${isActive('/hire') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}>
              Pick me
            </button>
          </Link>
          <Link href="/favorites">
            <button className={`px-4 py-2 rounded-full font-semibold text-sm ${isActive('/favorites') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}>
              My Favourite
            </button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100">
            <i className="fas fa-comment text-slate-600"></i>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100">
            <i className="fas fa-user-circle text-slate-600"></i>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100">
            <i className="fas fa-sign-out-alt text-slate-600"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ExploreHeader;