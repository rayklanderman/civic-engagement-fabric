import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { kenyaCountiesGeoJSON } from '@/lib/counties';

interface CountyMapProps {
  selectedCounty?: string;
  onCountySelect?: (county: string) => void;
}

export function CountyMap({ selectedCounty, onCountySelect }: CountyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        throw new Error('WebGL is not supported in your browser. Please try using a different browser or enabling hardware acceleration.');
      }

      // Initialize map with fallback options
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: ' OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [37.9062, 0.0236], // Center of Kenya
        zoom: 6,
        maxBounds: [
          [33.9098, -4.7677], // SW
          [41.9028, 5.0619]  // NE
        ],
        preserveDrawingBuffer: true,
        antialias: false // Disable antialiasing for better performance
      });

      // Add counties as markers
      kenyaCountiesGeoJSON.features.forEach((county) => {
        const marker = new maplibregl.Marker({
          color: selectedCounty === county.properties.id ? '#2563eb' : '#64748b',
          scale: selectedCounty === county.properties.id ? 1.2 : 1
        })
          .setLngLat(county.geometry.coordinates)
          .setPopup(new maplibregl.Popup().setHTML(`<h3>${county.properties.name}</h3>`))
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          onCountySelect?.(county.properties.id);
        });

        marker.getElement().addEventListener('mouseenter', () => {
          marker.setPopup(new maplibregl.Popup().setHTML(`<h3>${county.properties.name}</h3>`));
          marker.togglePopup();
        });

        marker.getElement().addEventListener('mouseleave', () => {
          marker.togglePopup();
        });
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl({
        showCompass: false
      }), 'top-right');

      // Add attribution control
      map.current.addControl(new maplibregl.AttributionControl({
        compact: true
      }));

      // Optimize performance
      map.current.on('load', () => {
        map.current?.resize();
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    return () => {
      map.current?.remove();
    };
  }, [selectedCounty, onCountySelect]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background p-4 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}