import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white border-b z-10">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <Plane className="h-6 w-6" />
          <span>TravelMate</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/trip-planner" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Trip Planner
          </Link>
          <Link href="/my-trips" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            My Trips
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};