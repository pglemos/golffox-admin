'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { gradients } from '../theme';

export interface MapPoint {
  lat: number;
  lng: number;
}

export interface MapCardProps {
  apiKey?: string;
  center: MapPoint;
  markers?: Array<{ position: MapPoint; label?: string; status?: 'active' | 'inactive' | 'alert' }>;
  route?: MapPoint[];
  title?: string;
  subtitle?: string;
}

declare global {
  interface Window {
    initGolffoxMap?: () => void;
  }
}

const statusColor: Record<string, string> = {
  active: gradients.primary,
  inactive: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(209,213,219,0.5))',
  alert: 'linear-gradient(135deg, rgba(255, 82, 82, 0.9), rgba(255, 215, 0, 0.9))',
};

export const MapCard: React.FC<MapCardProps> = ({ apiKey, center, markers = [], route, title, subtitle }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!apiKey) {
      setReady(false);
      return;
    }

    const existingScript = document.getElementById('golffox-google-maps');
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapId: 'DEMO_GOLFFOX_THEME',
        tilt: 45,
        disableDefaultUI: true,
      });

      markers.forEach((marker) => {
        const markerElement = document.createElement('div');
        markerElement.className = 'h-4 w-4 rounded-full border-2 border-white shadow-lg';
        markerElement.style.background = statusColor[marker.status ?? 'active'];

        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          const gMarker = new window.google.maps.marker.AdvancedMarkerElement({
            map,
            position: marker.position,
            content: markerElement,
          });
          return gMarker;
        }

        return new window.google.maps.Marker({
          map,
          position: marker.position,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#5B2EFF',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
          label: marker.label,
        });
      });

      if (route?.length) {
        new window.google.maps.Polyline({
          map,
          path: route,
          strokeColor: '#5B2EFF',
          strokeOpacity: 0.8,
          strokeWeight: 5,
        });
      }

      setReady(true);
    };

    if (existingScript) {
      if (window.google) {
        initializeMap();
      } else {
        window.initGolffoxMap = initializeMap;
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'golffox-google-maps';
    const url = new URL('https://maps.googleapis.com/maps/api/js');
    url.searchParams.set('key', apiKey ?? '');
    url.searchParams.set('libraries', 'maps,marker');
    url.searchParams.set('callback', 'initGolffoxMap');
    script.src = url.toString();
    window.initGolffoxMap = initializeMap;
    document.body.appendChild(script);

    return () => {
      window.initGolffoxMap = undefined;
    };
  }, [apiKey, center, markers, route]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050509] text-white shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
      <div className="space-y-2 p-6">
        {title && <h3 className="text-xl font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="relative h-80 w-full overflow-hidden">
        {!apiKey && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-8 text-center text-sm text-slate-200">
            Configure a variável <code className="rounded bg-white/10 px-1 py-0.5">VITE_GOOGLE_MAPS_API_KEY</code> para visualizar o mapa 3D.
          </div>
        )}
        {!isReady && apiKey && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader label="Carregando mapa" />
          </div>
        )}
        <div ref={mapRef} className="absolute inset-0" />
      </div>
    </div>
  );
};
