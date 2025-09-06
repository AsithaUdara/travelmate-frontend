import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Hotel, Utensils, Hospital, Landmark, Banknote, Bus, Heart } from 'lucide-react';

const categories = [
  { name: 'Hotels & Stays', icon: Hotel, category: 'hotel' },
  { name: 'Restaurants', icon: Utensils, category: 'restaurant' },
  { name: 'Hospitals', icon: Hospital, category: 'hospital' },
  { name: 'Sights & Attractions', icon: Landmark, category: 'attraction' },
  { name: 'ATMs', icon: Banknote, category: 'atm' },
  { name: 'Transportation', icon: Bus, category: 'transport' },
];

type ExploreSidebarProps = {
  onCategorySelect: (category: string | null) => void;
};

export const ExploreSidebar = ({ onCategorySelect }: ExploreSidebarProps) => {
  return (
    <aside className="w-96 h-full p-6 bg-white border-r overflow-y-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Explore</h1>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input placeholder="Search and Explore" className="pl-10 h-12 rounded-full" />
      </div>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ name, icon: Icon, category }) => (
          <Button
            key={name}
            variant="outline"
            className="h-14 flex items-center justify-start gap-3 rounded-xl"
            onClick={() => onCategorySelect(category)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm">{name}</span>
          </Button>
        ))}
      </div>

       {/* Show All Button */}
      <Button
        variant="outline"
        className="w-full h-12 rounded-xl"
        onClick={() => onCategorySelect(null)}
      >
        Show All Places
      </Button>

      <div className="border-t my-4" />

      {/* My Saved Places */}
      <Button
        variant="ghost"
        className="w-full h-14 flex items-center justify-start gap-3 text-base"
      >
        <Heart className="h-5 w-5" />
        My Saved Places
      </Button>
    </aside>
  );
};