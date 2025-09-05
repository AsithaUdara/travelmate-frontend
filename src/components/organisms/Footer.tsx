import React from 'react';
import Link from 'next/link';
import { Plane, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Plane className="h-6 w-6" />
              <span>TravelMate.lk</span>
            </Link>
            <p className="text-sm text-slate-400">
              Your AI-powered companion for unforgettable adventures in Sri Lanka.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-teal-400 transition-colors">Features</Link></li>
              <li><Link href="/plan" className="hover:text-teal-400 transition-colors">Plan a Trip</Link></li>
              <li><Link href="#faq" className="hover:text-teal-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} TravelMate.lk by Bug Busters. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-slate-400 hover:text-teal-400"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-slate-400 hover:text-teal-400"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="text-slate-400 hover:text-teal-400"><Facebook className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;