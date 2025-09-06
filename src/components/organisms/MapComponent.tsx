"use client";

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/lib/mock-data';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

type MapComponentProps = {
  places: Place[];
};

// Create a custom icon using a React component (Lucide icon)
const customIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToStaticMarkup(<MapPin className="h-10 w-10 text-red-500 fill-current" />))}`,
  iconSize: [40, 40],
  iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
});


export const MapComponent = ({ places }: MapComponentProps) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    // MapContainer replaces the old Map component
    <MapContainer 
      center={[7.8731, 80.7718]} // Center of Sri Lanka
      zoom={7} 
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      {/* TileLayer is the map background itself, pointing to OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map(place => (
        <Marker
          key={place.name}
          position={[place.latitude, place.longitude]} // Leaflet uses [lat, lng] array
          icon={customIcon}
          eventHandlers={{
            click: () => {
              setSelectedPlace(place);
            },
          }}
        >
          {selectedPlace && selectedPlace.name === place.name && (
             <Popup
                onClose={() => setSelectedPlace(null)}
              >
              <div>
                <h3 className="font-bold">{selectedPlace.name}</h3>
                <p className="text-sm capitalize">{selectedPlace.category}</p>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};