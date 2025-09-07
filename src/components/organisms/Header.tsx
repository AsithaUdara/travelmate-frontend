"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plane, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthModal } from './AuthModal'; // Import the new modal

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === '/';
  const [scrolled, setScrolled] = useState(!isLandingPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
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
    <>
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
            <Button
              variant="ghost"
              onClick={() => { setModalView('login'); setIsModalOpen(true); }}
              className={`${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white hover:bg-white/10'}`}
            >
              Log In
            </Button>
            <Button
              onClick={() => { setModalView('signup'); setIsModalOpen(true); }}
            >
              <span className="flex items-center gap-2">
                Sign Up <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            {!isLandingPage && (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  try {
                    // Optional: clear any demo auth/session keys
                    localStorage.removeItem('tm_is_authenticated');
                  } catch {}
                  router.push('/');
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Render the modal, controlled by the header's state */}
      <AuthModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        initialView={modalView}
      />
    </>
  );
};

export default Header;