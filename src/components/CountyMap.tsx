import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMediaQuery } from '@/hooks/use-media-query';

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmF5a2xhbmRlcm1hbiIsImEiOiJjbHRoMGlsNnUwbHJyMmptbmR2Z2VnOWNsIn0.cVHRKvHUYFGQnOHBxONPZA';

// Kenya county coordinates from the backend
const countyCoordinates = {
  "Nairobi": {"lat": -1.2921, "lng": 36.8219},
  "Mombasa": {"lat": -4.0435, "lng": 39.6682},
  "Kisumu": {"lat": -0.1022, "lng": 34.7617},
  "Nakuru": {"lat": -0.3031, "lng": 36.0800},
  "Eldoret": {"lat": 0.5133, "lng": 35.2693},
  "Kisii": {"lat": -0.6769, "lng": 34.7680},
  "Machakos": {"lat": -1.5167, "lng": 37.2833},
  "Kiambu": {"lat": -1.0169, "lng": 36.9667},
  "Bomet": {"lat": -0.9900, "lng": 35.3333},
  "Bungoma": {"lat": 0.5667, "lng": 34.5667},
  "Busia": {"lat": 0.4533, "lng": 34.0833},
  "Elgeyo-Marakwet": {"lat": 1.1000, "lng": 35.1000},
  "Embu": {"lat": -0.5000, "lng": 37.4500},
  "Garissa": {"lat": -0.4594, "lng": 39.6667},
  "Homa Bay": {"lat": -0.5367, "lng": 34.9200},
  "Isiolo": {"lat": 0.3500, "lng": 37.5833},
  "Kajiado": {"lat": -1.7833, "lng": 36.8833},
  "Kakamega": {"lat": 0.2833, "lng": 34.7500},
  "Kericho": {"lat": -0.3667, "lng": 35.2833},
  "Kitui": {"lat": -1.3833, "lng": 38.0000},
  "Kwale": {"lat": -4.2833, "lng": 39.7000},
  "Laikipia": {"lat": -0.2000, "lng": 36.9500},
  "Lamu": {"lat": -2.2700, "lng": 40.9000},
  "Makueni": {"lat": -1.8200, "lng": 37.6700},
  "Mandera": {"lat": 3.9700, "lng": 41.8700},
  "Marsabit": {"lat": 2.3000, "lng": 37.9999},
  "Meru": {"lat": 0.0500, "lng": 37.6500},
  "Migori": {"lat": -1.0667, "lng": 34.4800},
  "Murang'a": {"lat": -0.5500, "lng": 37.2800},
  "Nandi": {"lat": 0.2670, "lng": 35.1010},
  "Narok": {"lat": -1.0833, "lng": 35.8000},
  "Nyamira": {"lat": -0.5500, "lng": 34.9833},
  "Nyandarua": {"lat": -0.8833, "lng": 36.4000},
  "Nyeri": {"lat": -0.4233, "lng": 36.9533},
  "Samburu": {"lat": 1.2400, "lng": 36.5000},
  "Siaya": {"lat": -0.0361, "lng": 34.5889},
  "Taita Taveta": {"lat": -3.4000, "lng": 38.5000},
  "Tana River": {"lat": -2.2049, "lng": 38.2139},
  "Tharaka Nithi": {"lat": -0.6333, "lng": 37.5500},
  "Trans Nzoia": {"lat": 1.0500, "lng": 34.9500},
  "Turkana": {"lat": 3.1500, "lng": 35.2500},
  "Uasin Gishu": {"lat": 0.5186, "lng": 35.2790},
  "Vihiga": {"lat": -0.2000, "lng": 34.6833},
  "Wajir": {"lat": 1.7475, "lng": 40.0672},
  "West Pokot": {"lat": 1.2000, "lng": 35.1000}
};

interface CountyMapProps {
  selectedCounty: string | null;
  onCountySelect?: (countyId: string) => void;
}

export function CountyMap({ selectedCounty, onCountySelect }: CountyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [37.9062, 0.0236], // Center of Kenya
        zoom: isMobile ? 5 : 6,
        maxBounds: [
          [33.9098, -4.7677], // SW
          [41.9028, 5.0619]  // NE
        ]
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: !isMobile,
          showZoom: true,
          visualizePitch: false
        }),
        isMobile ? 'bottom-right' : 'top-right'
      );

      // Add markers for each county
      Object.entries(countyCoordinates).forEach(([countyName, coords]) => {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'county-marker';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.backgroundColor = selectedCounty === countyName ? '#2563eb' : '#64748b';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.2s ease-in-out';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

        // Create and add marker
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current!);

        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
          className: 'county-popup'
        })
          .setHTML(`
            <div class="p-2">
              <h3 class="text-lg font-semibold">${countyName}</h3>
            </div>
          `);

        // Add event listeners
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Update selected county
          onCountySelect?.(countyName);

          // Fly to county
          map.current?.flyTo({
            center: [coords.lng, coords.lat],
            zoom: isMobile ? 8 : 9,
            duration: 1500,
            essential: true
          });

          // Show popup
          marker.setPopup(popup).togglePopup();
        });

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          if (selectedCounty !== countyName) {
            el.style.backgroundColor = '#4b5563';
          }
          marker.setPopup(popup).togglePopup();
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          if (selectedCounty !== countyName) {
            el.style.backgroundColor = '#64748b';
          }
          marker.getPopup().remove();
        });

        // Store marker reference
        markers.current[countyName] = marker;
      });

      // Update marker colors when selected county changes
      if (selectedCounty) {
        Object.entries(markers.current).forEach(([countyName, marker]) => {
          const el = marker.getElement();
          el.style.backgroundColor = countyName === selectedCounty ? '#2563eb' : '#64748b';
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred initializing the map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [selectedCounty, onCountySelect, isMobile]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[600px] rounded-lg shadow-lg overflow-hidden"
      style={{ border: '1px solid #e2e8f0' }}
    />
  );
}