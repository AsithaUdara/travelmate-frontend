"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryDay } from '@/lib/trip-data';
import { divIcon } from 'leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf'; // Import turf for distance calculation

type ItineraryMapProps = {
  days: ItineraryDay[];
  activeDay: ItineraryDay | null;
  setActiveDay: (day: ItineraryDay) => void;
};

// ... (Keep the ChangeView component exactly the same)
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export const ItineraryMap = ({ days, activeDay, setActiveDay }: ItineraryMapProps) => {
  
  const createCustomIcon = (dayNumber: number, isActive: boolean) => {
    const baseClasses = "transition-all duration-200 flex items-center justify-center font-bold text-lg rounded-full shadow-lg border-2 border-white";
    const activeClasses = "bg-slate-900 text-white h-12 w-12 z-10";
    const defaultClasses = "bg-white text-slate-900 h-10 w-10";
    const markerHtml = `<div class="${baseClasses} ${isActive ? activeClasses : defaultClasses}">${dayNumber}</div>`;
    return divIcon({ html: markerHtml, className: 'custom-leaflet-icon', iconSize: isActive ? [48, 48] : [40, 40] });
  };
  
  // Create an array of route segments to make them individually interactive
  const routeSegments = [];
  for (let i = 0; i < days.length - 1; i++) {
    const start = days[i];
    const end = days[i + 1];
    
    // Calculate distance using Turf.js
    const from = turf.point([start.longitude, start.latitude]);
    const to = turf.point([end.longitude, end.latitude]);
    const distance = turf.distance(from, to, { units: 'kilometers' }).toFixed(0);

    routeSegments.push({
      positions: [[start.latitude, start.longitude], [end.latitude, end.longitude]] as L.LatLngExpression[],
      distance: `${distance} km`
    });
  }

  return (
    <MapContainer 
      center={[7.8731, 80.7718]} 
      zoom={8} 
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {activeDay && <ChangeView center={[activeDay.latitude, activeDay.longitude]} zoom={12} />}
      
      {/* Render each route segment with a tooltip */}
      {routeSegments.map((segment, index) => (
        <Polyline key={index} positions={segment.positions} color="#0f172a" weight={3} dashArray="5, 10">
          <Tooltip sticky>
            {segment.distance}
          </Tooltip>
        </Polyline>
      ))}

      {/* Render all day markers */}
      {days.map(day => (
        <Marker
          key={day.day}
          position={[day.latitude, day.longitude]}
          icon={createCustomIcon(day.day, activeDay?.day === day.day)}
          eventHandlers={{
            click: () => setActiveDay(day)
          }}
        />
      ))}
    </MapContainer>
  );
};