"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/lib/mock-data';
import { divIcon } from 'leaflet';
import { MapHoverCard } from './MapHoverCard';

type ExploreMapProps = {
  places: Place[];
  hoveredPlaceId: string | null;
  onMarkerHover: (placeId: string | null) => void;
  category: 'stay' | 'activity' | 'eat' | 'flight' | 'sights' | 'atm';
};

const createPinIcon = (isHovered: boolean) => {
    const pinSVG = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="fill:#0f172a; stroke:white; stroke-width:1.5;"><path d="M16,1C9.9,1,5,5.9,5,12c0,8,11,18,11,18s11-10,11-18C27,5.9,22.1,1,16,1z M16,17c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S18.8,17,16,17z"/></svg>`;
    const scale = isHovered ? 'scale(1.2)' : 'scale(1)';
    const markerHtml = `<div style="transform: ${scale}; transition: transform 0.2s ease-in-out; transform-origin: bottom;">${pinSVG}</div>`;
    return divIcon({ html: markerHtml, className: 'custom-leaflet-icon', iconSize: [32, 32], iconAnchor: [16, 32] });
};

const createPriceIcon = (place: Place, isHovered: boolean) => {
    const priceFormatted = `LKR ${(place.price / 1000).toFixed(0)}k`;
    const baseClasses = "transition-all duration-200";
    const hoveredClasses = "bg-slate-900 text-white scale-110 z-20";
    const defaultClasses = "bg-white text-slate-900";
    const markerHtml = `<div class="${baseClasses} ${isHovered ? hoveredClasses : defaultClasses}" style="position: relative; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${priceFormatted}<div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid ${isHovered ? '#0f172a' : '#ffffff'};"></div></div>`;
    return divIcon({ html: markerHtml, className: 'custom-leaflet-icon', iconSize: [80, 45], iconAnchor: [40, 45] });
};

const MapEvents = ({ hoveredPlaceId, places, setCardPosition, setCardPlace }: any) => {
    const map = useMap();
    React.useEffect(() => {
        if (hoveredPlaceId) {
            const place = places.find((p: Place) => p.id === hoveredPlaceId);
            if (place) {
                const point = map.latLngToContainerPoint([place.latitude, place.longitude]);
                setCardPosition(point);
                setCardPlace(place);
            }
        } else {
            setCardPlace(null);
        }
    }, [hoveredPlaceId, map, places, setCardPosition, setCardPlace]);
    return null;
}

export const ExploreMap = ({ places, hoveredPlaceId, onMarkerHover, category }: ExploreMapProps) => {
  const [cardPosition, setCardPosition] = React.useState(null);
  const [cardPlace, setCardPlace] = React.useState<Place | null>(null);

  return (
    <div className="h-full w-full relative">
      <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true} className="z-0">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents hoveredPlaceId={hoveredPlaceId} places={places} setCardPosition={setCardPosition} setCardPlace={setCardPlace} />
        {places.map(place => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={category === 'sights' || category === 'atm' ? createPinIcon(hoveredPlaceId === place.id) : createPriceIcon(place, hoveredPlaceId === place.id)}
            eventHandlers={{
              mouseover: () => onMarkerHover(place.id),
              mouseout: () => onMarkerHover(null),
            }}
          />
        ))}
      </MapContainer>
      {cardPlace && cardPosition && <MapHoverCard place={cardPlace} position={cardPosition} />}
    </div>
  );
};