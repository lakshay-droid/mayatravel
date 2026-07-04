import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Attraction } from '../../types';

// Fix Leaflet marker icon asset resolution bug in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface LeafletIconDefaultPrototype extends L.Icon.Default {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as LeafletIconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface InteractiveMapProps {
  city: string;
  attractions: Attraction[];
  onSelectAttraction: (attraction: Attraction) => void;
  selectedAttraction: Attraction | null;
}

// Coordinate mappings for supported cities
const CITY_CENTERS: Record<string, [number, number]> = {
  "dehradun": [30.33, 78.04],
  "jaipur": [26.92, 75.82],
  "varanasi": [25.3176, 83.0062],
  "goa": [15.4909, 73.8278],
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  city,
  attractions,
  onSelectAttraction,
  selectedAttraction
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const center = CITY_CENTERS[city.toLowerCase()] || [30.33, 78.04];
    
    // Create new Leaflet map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView(center, 12);

    // Add beautiful minimalist tiles (OSM Hot Style / CartoDB Voyager is modern)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [city]);

  // 2. Update Markers when attractions or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    attractions.forEach(attraction => {
      // Define colored pin HTML icon depending on category for a premium look
      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case 'Food': return '#ef4444'; // Red
          case 'Culture': return '#a855f7'; // Purple
          case 'Temples': return '#f97316'; // Orange
          case 'Museums': return '#3b82f6'; // Blue
          case 'Hidden Gems': return '#10b981'; // Green
          case 'Adventure': return '#eab308'; // Yellow
          default: return '#64748b'; // Slate
        }
      };

      const color = getCategoryColor(attraction.category);
      
      const pinHtmlIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            width: 30px; 
            height: 30px; 
            border-radius: 50% 50% 50% 0; 
            background: ${color}; 
            transform: rotate(-45deg); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            border: 2px solid white;
          ">
            <div style="
              width: 10px; 
              height: 10px; 
              border-radius: 50%; 
              background: white;
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      const marker = L.marker([attraction.lat, attraction.lng], { icon: pinHtmlIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Outfit', sans-serif; padding: 4px; max-width: 200px;">
            <strong style="color: #1e293b; font-size: 14px; display: block; margin-bottom: 2px;">${attraction.name}</strong>
            <span style="background: ${color}20; color: ${color}; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; text-transform: uppercase;">${attraction.category}</span>
            <p style="color: #64748b; font-size: 11px; margin: 6px 0 0 0; line-height: 1.4;">${attraction.description.slice(0, 70)}...</p>
          </div>
        `);

      marker.on('click', () => {
        onSelectAttraction(attraction);
      });

      markersRef.current.push(marker);
    });

    // Auto fit bounds if markers exist
    if (attractions.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [attractions, onSelectAttraction]);

  // 3. Pan to selected attraction when chosen from the side panel
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedAttraction) return;

    map.setView([selectedAttraction.lat, selectedAttraction.lng], 14, {
      animate: true,
      duration: 1
    });

    // Find and open popup of the selected marker
    const marker = markersRef.current.find(m => {
      const latLng = m.getLatLng();
      return Math.abs(latLng.lat - selectedAttraction.lat) < 0.0001 &&
             Math.abs(latLng.lng - selectedAttraction.lng) < 0.0001;
    });

    if (marker) {
      marker.openPopup();
    }
  }, [selectedAttraction]);

  return (
    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-premium border border-slate-100 bg-slate-100 select-none">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
export default InteractiveMap;
