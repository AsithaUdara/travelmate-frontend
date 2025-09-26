"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type SaveTripModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  defaultTripName: string;
  onSave: (newName: string, coverImage?: string) => void;
};

export const SaveTripModal = ({ isOpen, setIsOpen, defaultTripName, onSave }: SaveTripModalProps) => {
  const [tripName, setTripName] = useState(defaultTripName);
  // Image upload disabled per requirement

  // All image handlers removed

  const handleSave = async () => {
    if (!tripName.trim()) return;
    await onSave(tripName.trim(), undefined);
    setIsOpen(false);
    // Reset form
    setTripName(defaultTripName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Save your adventure</DialogTitle>
          <DialogDescription>
            Give your trip a memorable name and add a cover image to make it uniquely yours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Trip Name Input */}
          <div>
            <Label htmlFor="trip-name" className="font-semibold">Trip Name</Label>
            <Input 
              id="trip-name" 
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="mt-2 h-12"
              placeholder="My Amazing Sri Lankan Adventure"
            />
          </div>

          {/* Cover Image Upload removed per requirement */}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            className="rounded-full" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="rounded-full" 
            onClick={handleSave}
            disabled={!tripName.trim()}
          >
            Save Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
