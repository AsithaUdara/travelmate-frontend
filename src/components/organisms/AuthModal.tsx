"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
// Using a simple custom modal container to guarantee visibility
// You can switch back to the shared dialog once styling conflicts are resolved
import { Input } from "@/components/ui/input";
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { FacebookIcon } from '@/components/icons/FacebookIcon'; // Make sure this exists
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialView: 'login' | 'signup';
};

export const AuthModal = ({ isOpen, setIsOpen, initialView }: AuthModalProps) => {
  const [view, setView] = useState(initialView);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-[110]">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div
          role="dialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-[120] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              {view === 'login' ? 'Log in to TravelMate' : 'Create your account'}
            </h2>

            <form className="grid gap-4 mt-4">
              {view === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="name" type="text" placeholder="Full Name" className="h-12 rounded-lg pl-10 bg-slate-100 border-slate-100 focus:bg-white focus:border-slate-300" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="email" type="email" placeholder="Email address" className="h-12 rounded-lg pl-10 bg-slate-100 border-slate-100 focus:bg-white focus:border-slate-300" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Password" className="h-12 rounded-lg pl-10 pr-10 bg-slate-100 border-slate-100 focus:bg-white focus:border-slate-300" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {view === 'login' && (
                <button type="button" className="text-right text-sm text-slate-500 hover:underline font-medium px-1 ml-auto w-fit">
                  Forgot password?
                </button>
              )}
              <Button type="submit" size="lg" className="w-full h-12 mt-2 px-6 rounded-full bg-black text-white hover:bg-gray-900">
                <span className="flex w-full items-center justify-between">
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">or continue with</span>
              </div>
            </div>

            <div className="grid gap-3">
              <Button variant="outline" size="lg" className="relative w-full h-12 rounded-full px-4 border-slate-200">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 inline-flex items-center" aria-hidden="true">
                  <GoogleIcon />
                </span>
                <span className="block w-full pl-12 pr-6 text-center text-base font-semibold">Continue with Google</span>
              </Button>
              <Button variant="outline" size="lg" className="relative w-full h-12 rounded-full px-4 border-slate-200">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 inline-flex items-center" aria-hidden="true">
                  <FacebookIcon />
                </span>
                <span className="block w-full pl-12 pr-6 text-center text-base font-semibold">Continue with Facebook</span>
              </Button>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
              {view === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setView('signup')} className="font-semibold text-black hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setView('login')} className="font-semibold text-black hover:underline">
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};