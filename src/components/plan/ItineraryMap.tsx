"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ItineraryDay } from '@/lib/trip-data';
import { divIcon } from 'leaflet';
import L from 'leaflet';

type ItineraryMapProps = {
  days: ItineraryDay[];
  activeDay: ItineraryDay | null;
  setActiveDay: (day: ItineraryDay) => void;
};

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

// Component to fetch and draw Mapbox driving route
const RoutingMachine = ({ days }: { days: ItineraryDay[] }) => {
  const map = useMap();

  useEffect(() => {
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

        // Remove previous polylines/route layers we added
        map.eachLayer((layer) => {
          if ((layer as any)?.feature?.geometry?.type === 'LineString') {
            map.removeLayer(layer);
          }
        });

        routeLayer = L.geoJSON(geojson, {
          style: () => ({ color: '#0f172a', weight: 4, dashArray: '1, 8' }),
        }).addTo(map);
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      if (routeLayer) {
        map.removeLayer(routeLayer);
      }
    };
  }, [days, map]);

  return null;
};

export const ItineraryMap = ({ days, activeDay, setActiveDay }: ItineraryMapProps) => {
  const createCustomIcon = (dayNumber: number, isActive: boolean) => {
    const baseClasses = 'transition-all duration-200 flex items-center justify-center font-bold text-lg rounded-full shadow-lg border-2 border-white';
    const activeClasses = 'bg-slate-900 text-white h-12 w-12 z-10';
    const defaultClasses = 'bg-white text-slate-900 h-10 w-10';
    const markerHtml = `<div class="${baseClasses} ${isActive ? activeClasses : defaultClasses}">${dayNumber}</div>`;
    return divIcon({ html: markerHtml, className: 'custom-leaflet-icon', iconSize: isActive ? [48, 48] : [40, 40] });
  };

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

      <RoutingMachine days={days} />

      {days.map((day) => (
        <Marker
          key={day.day}
          position={[day.latitude, day.longitude]}
          icon={createCustomIcon(day.day, activeDay?.day === day.day)}
          eventHandlers={{
            click: () => setActiveDay(day),
          }}
        />
      ))}
    </MapContainer>
  );
};