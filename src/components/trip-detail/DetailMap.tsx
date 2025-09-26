"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Trip, ItineraryDay } from '@/lib/trip-data';
import { divIcon } from 'leaflet';
import L from 'leaflet';

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const RoutingMachine = ({ days }: { days: ItineraryDay[] }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!days || days.length < 2) return;
    const coords = days.map((d) => `${d.longitude},${d.latitude}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

    let routeLayer: L.GeoJSON<any> | null = null;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const route = data?.routes?.[0]?.geometry?.coordinates;
        if (!route) return;
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: route },
        } as GeoJSON.Feature<GeoJSON.LineString>;

        map.eachLayer((layer) => {
          if ((layer as any)?.feature?.geometry?.type === 'LineString') {
            map.removeLayer(layer);
          }
        });

        routeLayer = L.geoJSON(geojson, {
          style: () => ({ color: '#0f172a', weight: 4, dashArray: '1, 8' }),
        }).addTo(map);
      })
      .catch(() => {});

    return () => {
      if (routeLayer) map.removeLayer(routeLayer);
    };
  }, [days, map]);
  return null;
};

export const DetailMap = ({ trip, activeDay }: { trip: Trip; activeDay: ItineraryDay | null }) => {

  const createCustomIcon = (dayNumber: number, isActive: boolean) => {
    const baseClasses = "transition-all duration-200 flex items-center justify-center font-bold text-sm h-8 w-8 rounded-full shadow-lg border-2 border-white";
    const activeClasses = "bg-slate-900 text-white scale-125 z-10";
    const defaultClasses = "bg-white text-slate-900";
    const markerHtml = `<div class="${baseClasses} ${isActive ? activeClasses : defaultClasses}">${dayNumber}</div>`;
    return divIcon({ html: markerHtml, className: 'custom-leaflet-icon' });
  };

  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={8}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
      {activeDay && <ChangeView center={[activeDay.latitude, activeDay.longitude]} zoom={12} />}
      <RoutingMachine days={trip.days} />
      {trip.days.map(day => (
        <Marker
          key={day.day}
          position={[day.latitude, day.longitude]}
          icon={createCustomIcon(day.day, activeDay?.day === day.day)}
        />
      ))}
    </MapContainer>
  );
};
