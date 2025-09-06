"use client";

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '../../lib/mock-data';
import { Icon } from 'leaflet';
import { MapPin, Star } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import Image from 'next/image';

type MapComponentProps = {
  places: Place[];
};

// Create a custom default icon
const customIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToStaticMarkup(<MapPin className="h-10 w-10 text-slate-800 fill-slate-800" />))}`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Create a custom icon for the hovered state
const hoveredIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToStaticMarkup(<MapPin className="h-12 w-12 text-red-500 fill-red-500" />))}`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});


export const MapComponent = ({ places }: MapComponentProps) => {
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);

  return (
    <MapContainer 
      center={[7.8731, 80.7718]} 
      zoom={7} 
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map(place => (
        <Marker
          key={place.name}
          position={[place.latitude, place.longitude]}
          icon={hoveredPlace?.name === place.name ? hoveredIcon : customIcon} // Change icon on hover
          eventHandlers={{
            mouseover: () => {
              setHoveredPlace(place);
            },
            mouseout: () => {
              setHoveredPlace(null);
            },
          }}
        >
          {hoveredPlace && hoveredPlace.name === place.name && (
            <Popup autoPan={false}>
              <div className="w-64">
                <div className="relative h-32 w-full rounded-lg overflow-hidden">
                  <Image src={place.image} alt={place.name} fill style={{objectFit: 'cover'}} />
                </div>
                <div className="p-2">
                  <h3 className="font-bold text-base">{place.name}</h3>
                  <p className="text-sm capitalize text-slate-500">{place.category}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{place.rating} Rating</span>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};