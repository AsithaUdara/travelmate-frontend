"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firbase';
import { 
  signInWithCustomToken,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion';

// FIX: Corrected the API URL to match your Express server's routes
const API_URL = 'http://localhost:5000/api/auth';

type AuthModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialView: 'login' | 'signup';
};

export const AuthModal = ({ isOpen, setIsOpen, initialView }: AuthModalProps) => {
  const [view, setView] = useState(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setView(initialView);
    setError(null); setEmail(''); setPassword(''); setName('');
  }, [initialView, isOpen]);

  if (!isOpen) return null;

  const handleAuthSuccess = () => {
    setIsOpen(false);
    router.push('/plan');
  };

  const handleBackendError = (message: string) => {
    setError(message || 'An unexpected error occurred. Please try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const isSignup = view === 'signup';
    const endpoint = isSignup ? '/register' : '/login';
    const payload = isSignup ? { name, email, password } : { email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Server responded with an error');
      }

      if (isSignup) {
        alert("Registration successful! Please log in to continue.");
        setView('login');
      } else {
        if (data.token) {
          await signInWithCustomToken(auth, data.token);
          handleAuthSuccess();
        } else {
          throw new Error("Login failed: No authentication token received.");
        }
      }
    } catch (err: any) {
      if (err instanceof SyntaxError && err.message.includes("Unexpected token")) {
          setError("Could not connect to the server. Please ensure it's running and try again.");
      } else {
          handleBackendError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialSignIn = async (providerType: 'google' | 'facebook') => {
    setError(null);
    setLoading(true);
    const provider = providerType === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await fetch(`${API_URL}/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
                name: user.displayName,
            }),
        });
        
        handleAuthSuccess();
    } catch (err: any) {
        if (err.code !== 'auth/popup-closed-by-user') {
            setError('Social sign-in failed. Please try again.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 z-[110]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)} 
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          role="dialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-[120] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              {view === 'login' ? 'Log in to TravelMate' : 'Create your account'}
            </h2>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-sm text-center py-2 px-3 rounded-md bg-red-100 text-red-700 mb-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {view === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="name" type="text" placeholder="Full Name" className="h-12 rounded-lg pl-10 bg-slate-100 border-transparent focus:bg-white focus:border-slate-300" required value={name} onChange={e => setName(e.target.value)} disabled={loading}/>
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="email" type="email" placeholder="Email address" className="h-12 rounded-lg pl-10 bg-slate-100 border-transparent focus:bg-white focus:border-slate-300" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading}/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Password" className="h-12 rounded-lg pl-10 pr-10 bg-slate-100 border-transparent focus:bg-white focus:border-slate-300" required value={password} onChange={e => setPassword(e.target.value)} disabled={loading}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {view === 'login' && (
                <button type="button" className="text-right text-sm text-slate-500 hover:underline font-medium px-1 ml-auto w-fit">
                  Forgot password?
                </button>
              )}
              <Button type="submit" size="lg" className="w-full h-12 mt-2 px-6 rounded-full bg-black text-white hover:bg-gray-900" disabled={loading}>
                <span className="flex w-full items-center justify-between">
                  <span>{loading ? 'Loading...' : 'Continue'}</span>
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </span>
              </Button>
            </form>

            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">or continue with</span></div></div>

            <div className="grid gap-3">
              <Button type="button" variant="outline" size="lg" className="relative w-full h-12 rounded-full px-4 border-slate-200" onClick={() => handleSocialSignIn('google')} disabled={loading}>
                <span className="absolute left-6 top-1/2 -translate-y-1/2 inline-flex items-center" aria-hidden="true"><GoogleIcon /></span>
                <span className="block w-full text-center text-base font-semibold">Continue with Google</span>
              </Button>
              <Button type="button" variant="outline" size="lg" className="relative w-full h-12 rounded-full px-4 border-slate-200" onClick={() => handleSocialSignIn('facebook')} disabled={loading}>
                <span className="absolute left-6 top-1/2 -translate-y-1/2 inline-flex items-center" aria-hidden="true"><FacebookIcon /></span>
                <span className="block w-full text-center text-base font-semibold">Continue with Facebook</span>
              </Button>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
              {view === 'login' ? (
                <>Don&apos;t have an account?{' '}<button onClick={() => setView('signup')} className="font-semibold text-black hover:underline">Sign up</button></>
              ) : (
                <>Already have an account?{' '}<button onClick={() => setView('login')} className="font-semibold text-black hover:underline">Log in</button></>
              )}
            </div>
          </div>
        </motion.div>
      </div>
  );
};