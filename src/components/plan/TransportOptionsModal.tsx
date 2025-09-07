"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { TransportOption } from '@/lib/trip-data';
import { StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, TagIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type TransportOptionsModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  options: TransportOption[];
  from: string;
  to: string;
  onSelect: (option: TransportOption) => void;
};

const ComfortRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={cn("h-5 w-5", i < rating ? "text-yellow-400" : "text-slate-300")} />
        ))}
    </div>
);

export const TransportOptionsModal = ({ isOpen, setIsOpen, options, from, to, onSelect }: TransportOptionsModalProps) => {
  if (!options) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Transport Options: {from} to {to}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map(option => (
            <div key={option.id} className={cn(
              "p-4 border rounded-lg flex flex-col justify-between transition-all",
              option.isRecommended ? "border-slate-900 border-2 shadow-lg" : ""
            )}>
              <div>
                {option.isRecommended && (
                  <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                    <SparklesIcon className="h-4 w-4" /> AI Recommended
                  </div>
                )}
                  <h3 className="text-lg font-bold">{option.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mt-0.5">{option.category}</p>
                  <p className="text-sm text-slate-600 mt-1">{option.details}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2"><ClockIcon className="h-5 w-5" /> ~{option.time} hours</div>
                  <div className="flex items-center gap-2"><TagIcon className="h-5 w-5" /> LKR {option.cost.toLocaleString()}</div>
                  <div className="flex items-center gap-2">Comfort: <ComfortRating rating={option.comfort} /></div>
                </div>
              </div>
              <Button 
                className="w-full mt-6 rounded-full" 
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                Select & Book
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};