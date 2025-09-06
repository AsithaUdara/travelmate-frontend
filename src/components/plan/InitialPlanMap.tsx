"use client";

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const PlanMap = () => {
  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={8}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      className="z-0"
    >
      {/* This is the new LIGHT BLUE map theme */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};