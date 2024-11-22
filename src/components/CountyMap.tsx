import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { kenyaCountiesGeoJSON } from '@/lib/counties';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CountyMapProps {
  selectedCounty?: string;
  onCountySelect?: (county: string) => void;
}

export function CountyMap({ selectedCounty, onCountySelect }: CountyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        throw new Error('WebGL is not supported in your browser. Please try using a different browser or enabling hardware acceleration.');
      }

      // Initialize map with responsive options
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
        zoom: isMobile ? 5 : 6, // Adjust zoom based on screen size
        maxBounds: [
          [33.9098, -4.7677], // SW
          [41.9028, 5.0619]  // NE
        ],
        preserveDrawingBuffer: true,
        antialias: false, // Disable antialiasing for better performance
        dragRotate: !isMobile, // Disable rotation on mobile
        touchZoomRotate: true, // Enable pinch zoom on mobile
        cooperativeGestures: isMobile // Enable cooperative gestures on mobile
      });

      // Add counties as markers with responsive sizing
      kenyaCountiesGeoJSON.features.forEach((county) => {
        const marker = new maplibregl.Marker({
          color: selectedCounty === county.properties.id ? '#2563eb' : '#64748b',
          scale: isMobile ? 
            (selectedCounty === county.properties.id ? 1 : 0.8) : 
            (selectedCounty === county.properties.id ? 1.2 : 1)
        })
          .setLngLat(county.geometry.coordinates)
          .setPopup(new maplibregl.Popup({
            closeButton: false,
            closeOnClick: true,
            maxWidth: isMobile ? '200px' : '300px',
            className: 'county-popup'
          }).setHTML(`
            <div class="p-2">
              <h3 class="text-lg font-semibold">${county.properties.name}</h3>
            </div>
          `))
          .addTo(map.current!);

        const el = marker.getElement();
        el.style.cursor = 'pointer';
        el.style.transition = 'transform 0.2s ease-in-out';

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onCountySelect?.(county.properties.id);
        });

        el.addEventListener('mouseenter', () => {
          el.style.transform = `scale(${isMobile ? 1.1 : 1.2})`;
          marker.togglePopup();
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          marker.togglePopup();
        });

        // Add touch events for mobile
        if (isMobile) {
          el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(1.1)';
          });

          el.addEventListener('touchend', () => {
            el.style.transform = 'scale(1)';
          });
        }
      });

      // Add navigation controls with responsive positioning
      map.current.addControl(
        new maplibregl.NavigationControl({
          showCompass: !isMobile,
          showZoom: true,
          visualizePitch: false
        }), 
        isMobile ? 'bottom-right' : 'top-right'
      );

      // Add attribution control
      map.current.addControl(
        new maplibregl.AttributionControl({
          compact: isMobile
        })
      );

      // Handle resize
      const handleResize = () => {
        if (map.current) {
          map.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      // Optimize performance
      map.current.on('load', () => {
        map.current?.resize();
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        map.current?.remove();
      };

    } catch (err) {
      console.error('Map initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }
  }, [selectedCounty, onCountySelect, isMobile]);

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