import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ExternalLink, MapPin } from 'lucide-react';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type?: 'crop' | 'factory';
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center,
  zoom = 13,
  markers = [],
  height = '240px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;

    // Remove existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon
    const createCustomIcon = (type: 'crop' | 'factory' = 'crop') => {
      const color = type === 'factory' ? '#d97706' : '#16a34a';
      return L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="
          background-color: ${color};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 13px;
        ">
          ${type === 'factory' ? '🏭' : '🌱'}
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
    };

    // Add markers
    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(m.type),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 2px;">
          <strong style="color: #0f172a; font-size: 13px;">${m.title}</strong>
          ${m.subtitle ? `<div style="color: #64748b; margin-top: 2px;">${m.subtitle}</div>` : ''}
          <div style="color: #0284c7; font-family: monospace; font-size: 11px; margin-top: 4px;">
            ${m.lat.toFixed(5)}, ${m.lng.toFixed(5)}
          </div>
        </div>
      `);
    });

    return () => {
      // Cleanup on full unmount
    };
  }, [center, zoom, markers]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs ${className}`}>
      <div ref={mapContainerRef} style={{ height }} className="w-full" />
      <div className="absolute bottom-2 right-2 z-10">
        <a
          href={`https://www.google.com/maps?q=${center[0]},${center[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-700 hover:text-slate-900 text-[11px] font-medium rounded-lg shadow-sm border border-slate-200 flex items-center gap-1 transition"
        >
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>Open Maps</span>
          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
};
