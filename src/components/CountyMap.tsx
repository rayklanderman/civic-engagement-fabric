import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { colors } from '../lib/colors';
import { Card } from "@/components/ui/card";
import { FallbackMap } from './FallbackMap';

// Disable worker pool to prevent errors
// @ts-ignore
delete mapboxgl.workerPool;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGV2cmF5ayIsImEiOiJjbTNzenU3azAwM2pxMmxzNXptdGZkbmRnIn0.Vve0ErWPY7nM4bIrn1bD_g';

// Memoized map options to prevent unnecessary re-renders
const MAP_OPTIONS = {
  style: 'mapbox://styles/mapbox/light-v11',
  preserveDrawingBuffer: false,
  antialias: false,
  maxPitch: 0,
  renderWorldCopies: false,
  attributionControl: false,
  maxBounds: [
    [32.9, -4.8], // SW coordinates
    [42.0, 4.5]   // NE coordinates
  ],
  bounds: [
    [32.9, -4.8], // SW coordinates
    [42.0, 4.5]   // NE coordinates
  ],
  fitBoundsOptions: {
    padding: 20,
    maxZoom: 7
  }
} as const;

export const CountyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [mapError, setMapError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Memoized navigation handler
  const debouncedNavigate = useMemo(
    () => debounce((county: string) => {
      requestAnimationFrame(() => {
        navigate(`/bills?county=${encodeURIComponent(county)}`);
      });
    }, 100),
    [navigate]
  );

  // Memoized marker element creator
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    // Apply initial styles using CSS custom properties for better performance
    el.style.cssText = `
      --marker-size: 12px;
      --marker-color: ${colors.red};
      width: var(--marker-size);
      height: var(--marker-size);
      background-color: var(--marker-color);
      border: 2px solid ${colors.black};
      border-radius: 50%;
      cursor: pointer;
      contain: layout style paint;
      will-change: transform;
      transform: translate3d(0, 0, 0);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.style.setProperty('--marker-color', colors.red);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    // Optimized event handlers
    const handleInteraction = (e: Event) => {
      const type = e.type;
      requestAnimationFrame(() => {
        if (type === 'mouseenter') {
          el.style.setProperty('--marker-color', colors.green);
          el.style.transform = 'translate3d(0, 0, 0) scale(1.2)';
        } else if (type === 'mouseleave') {
          el.style.setProperty('--marker-color', colors.red);
          el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        } else if (type === 'click' && name !== selectedCounty) {
          setSelectedCounty(name);
          debouncedNavigate(name);
        }
      });
    };

    el.addEventListener('mouseenter', handleInteraction, { passive: true });
    el.addEventListener('mouseleave', handleInteraction, { passive: true });
    el.addEventListener('click', handleInteraction);

    // Store cleanup function
    const cleanup = () => {
      observer.disconnect();
      el.removeEventListener('mouseenter', handleInteraction);
      el.removeEventListener('mouseleave', handleInteraction);
      el.removeEventListener('click', handleInteraction);
    };
    (el as any)._cleanup = cleanup;

    return el;
  }, [selectedCounty, debouncedNavigate]);

  // Optimized cleanup function
  const cleanup = useCallback(() => {
    markers.current.forEach(marker => {
      const el = marker.getElement();
      if ((el as any)._cleanup) {
        (el as any)._cleanup();
      }
      marker.remove();
    });
    markers.current = [];
    
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  }, []);

  // Initialize map with error boundary
  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        // Initialize map
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current!,
          ...MAP_OPTIONS,
          center: [37.9062, 0.0236],
          zoom: 5.5
        });

        // Wait for map to load
        await new Promise((resolve, reject) => {
          mapInstance.once('load', resolve);
          mapInstance.once('error', reject);
        });

        map.current = mapInstance;

        // Add markers using requestIdleCallback
        requestIdleCallback(() => {
          const fragment = document.createDocumentFragment();
          const newMarkers: mapboxgl.Marker[] = [];

          kenyaCountiesGeoJSON.features.forEach((county) => {
            if (!map.current) return;

            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;
            const el = createMarkerElement(name);

            const marker = new mapboxgl.Marker({
              element: el,
              anchor: 'center'
            })
            .setLngLat([coordinates[0], coordinates[1]]);

            fragment.appendChild(el);
            newMarkers.push(marker);
          });

          // Batch add markers
          requestAnimationFrame(() => {
            if (!map.current) return;
            newMarkers.forEach(marker => marker.addTo(map.current!));
            markers.current = newMarkers;
          });
        }, { timeout: 2000 });

        // Add minimal controls
        const nav = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        mapInstance.addControl(nav, 'top-right');

      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('Failed to initialize map');
      }
    };

    initMap();
    return cleanup;
  }, [cleanup, createMarkerElement]);

  if (mapError) {
    return <FallbackMap />;
  }

  return (
    <Card className="w-full h-[600px] relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ contain: 'layout style paint' }}
      />
    </Card>
  );
};