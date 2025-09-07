"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import type { Trip } from '@/lib/trip-data';

export const DetailMap = ({ trip }: { trip: Trip }) => {
  const routeCoordinates = trip.days.map(day => [day.latitude, day.longitude] as [number, number]);

  const createCustomIcon = (dayNumber: number) => {
    const markerHtml = `<div class="bg-slate-900 text-white flex items-center justify-center font-bold text-sm h-8 w-8 rounded-full shadow-lg border-2 border-white">${dayNumber}</div>`;
    return divIcon({ html: markerHtml, className: 'custom-leaflet-icon' });
  };

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden sticky top-28">
      <MapContainer 
        center={[trip.days[0].latitude, trip.days[0].longitude]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <Polyline positions={routeCoordinates} color="#0f172a" weight={3} dashArray="5, 10" />
        {trip.days.map(day => (
          <Marker
            key={day.day}
            position={[day.latitude, day.longitude]}
            icon={createCustomIcon(day.day)}
          />
        ))}
      </MapContainer>
    </div>
  );
};
