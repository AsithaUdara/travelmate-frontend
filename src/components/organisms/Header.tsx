"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plane, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const [scrolled, setScrolled] = React.useState(!isLandingPage);

  React.useEffect(() => {
    if (!isLandingPage) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLandingPage]);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white/90 backdrop-blur-sm shadow-md rounded-full' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-3">
        <Link href="/" className={`flex items-center gap-2 font-bold text-xl transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
          <Plane className="h-6 w-6" />
          <span>TravelMate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white'}`}>
            Features
          </Link>
          <Link href="/#gallery" className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white'}`}>
            Gallery
          </Link>
          <Link href="/#faq" className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white'}`}>
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" className={`${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white hover:bg-white/10'}`}>
              Log In
            </Button>
          </Link>
          <Link href="/register">
            {/* FIX: The flex container is now a span INSIDE the button */}
            <Button>
              <span className="flex items-center gap-2">
                Sign Up <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;