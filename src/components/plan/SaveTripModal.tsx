"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SaveTripModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  defaultTripName: string;
  onSave: (newName: string) => void;
};

export const SaveTripModal = ({ isOpen, setIsOpen, defaultTripName, onSave }: SaveTripModalProps) => {
  const [tripName, setTripName] = useState(defaultTripName);

  const handleSave = () => {
    if (tripName.trim()) {
      onSave(tripName.trim());
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Save your adventure</DialogTitle>
          <DialogDescription>
            Give your trip a memorable name. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="trip-name" className="font-semibold">Trip Name</Label>
          <Input 
            id="trip-name" 
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="mt-2 h-12"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="rounded-full" onClick={handleSave}>Save Trip</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
