import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  congestionLevel: 'low' | 'medium' | 'high';
  isHotspot?: boolean;
  speed?: number;
  density?: number;
  prediction?: string;
  reason?: string;
}

interface ChennaiMapProps {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

const ChennaiMap = ({ markers, onMarkerClick, className }: ChennaiMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Chennai
    mapInstanceRef.current = L.map(mapRef.current).setView([13.0827, 80.2707], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstanceRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const color = marker.congestionLevel === 'high' ? '#ef4444' 
        : marker.congestionLevel === 'medium' ? '#f59e0b' 
        : '#22c55e';

      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            width: 24px;
            height: 24px;
          ">
            ${marker.isHotspot ? `
              <div style="
                position: absolute;
                inset: -8px;
                border-radius: 50%;
                background: ${color};
                opacity: 0.3;
                animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              width: 24px;
              height: 24px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .addTo(markersLayerRef.current!);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${marker.name}</h3>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: ${color};
            "></span>
            <span style="font-size: 13px; text-transform: capitalize;">${marker.congestionLevel} Congestion</span>
          </div>
          ${marker.speed !== undefined ? `
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Speed:</strong> ${marker.speed} km/h
            </p>
          ` : ''}
          ${marker.density !== undefined ? `
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Density:</strong> ${marker.density} veh/km
            </p>
          ` : ''}
          ${marker.prediction ? `
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>10 min prediction:</strong> ${marker.prediction}
            </p>
          ` : ''}
          ${marker.reason ? `
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Reason:</strong> ${marker.reason}
            </p>
          ` : ''}
        </div>
      `;

      leafletMarker.bindPopup(popupContent);

      if (onMarkerClick) {
        leafletMarker.on('click', () => onMarkerClick(marker));
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ minHeight: '400px', width: '100%' }}
    />
  );
};

export default ChennaiMap;
