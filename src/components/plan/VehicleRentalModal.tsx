"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '../ui/button';
import { Vehicle, mockVehicles } from '@/lib/trip-data';
import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/solid';

type VehicleRentalModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelect: (vehicle: Vehicle) => void;
};

const VehicleCard = ({ vehicle, onSelect }: { vehicle: Vehicle, onSelect: () => void }) => (
    <div className="border rounded-lg overflow-hidden flex flex-col">
        <div className="relative h-40 w-full">
            <Image src={vehicle.image} alt={vehicle.name} fill style={{objectFit: 'cover'}} />
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-bold text-lg">{vehicle.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <UserGroupIcon className="h-5 w-5" />
                <span>Up to {vehicle.capacity} passengers</span>
            </div>
            <div className="flex-grow"/>
            <div className="flex items-end justify-between mt-4">
                <div>
                    <p className="font-bold text-xl">LKR {vehicle.pricePerDay.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">per day</p>
                </div>
                <Button className="rounded-full font-semibold" onClick={onSelect}>Select</Button>
            </div>
        </div>
    </div>
);

export const VehicleRentalModal = ({ isOpen, setIsOpen, onSelect }: VehicleRentalModalProps) => {
  const vehicleTypes = ['Car', 'Van', 'Tuk-tuk'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Rent a Car</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Tabs defaultValue="Car" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {vehicleTypes.map(type => (
                <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
              ))}
            </TabsList>
            {vehicleTypes.map(type => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockVehicles.filter(v => v.type === type).map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} onSelect={() => onSelect(vehicle)} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};