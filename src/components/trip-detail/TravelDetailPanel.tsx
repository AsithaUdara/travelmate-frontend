"use client";
import React from 'react';
import type { Activity } from '@/lib/trip-data';

type TravelDetailPanelProps = {
  leg: { from: string; to: string; activity: Activity };
};

export const TravelDetailPanel = ({ leg }: TravelDetailPanelProps) => {
  return (
    <div>
      <p className="font-semibold text-slate-500">{leg.from} to {leg.to}</p>
      <h3 className="text-2xl font-bold">Your Transport</h3>
      <div className="mt-6 p-4 bg-slate-100 rounded-lg">
        <p className="font-bold text-lg">{leg.activity.name}</p>
        <p className="mt-1">Cost: LKR {leg.activity.cost.toLocaleString()}</p>
        <p>Duration: ~{leg.activity.duration} hours</p>
      </div>
    </div>
  );
};
