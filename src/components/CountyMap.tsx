import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { colors } from '../lib/colors';
import { Card } from "@/components/ui/card";
import { FallbackMap } from './FallbackMap';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";

// Check for WebGL support
const isWebGLSupported = () => {
  const canvas = document.createElement('canvas');
  return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
};

// Memoized map options
const MAP_OPTIONS = {
  style: {
    version: 8,
    sources: {
      'osm': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19
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
  center: [37.9062, 0.0236],
  zoom: 5.5,
  preserveDrawingBuffer: false,
  antialias: true,
  maxPitch: 0,
  renderWorldCopies: false,
  attributionControl: false,
  maxBounds: [
    [32.9, -4.8], // SW coordinates
    [42.0, 4.5]   // NE coordinates
  ],
  bounds: [
    [32.9, -4.8],
    [42.0, 4.5]
  ],
  fitBoundsOptions: {
    padding: 20,
    maxZoom: 7
  }
} as const;

export const CountyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [mapError, setMapError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check WebGL support on mount
  useEffect(() => {
    if (!isWebGLSupported()) {
      setMapError('WebGL is not supported in your browser. Please try using a modern browser with WebGL support.');
      return;
    }
  }, []);

  // Memoized navigation handler
  const debouncedNavigate = useMemo(
    () => debounce((county: string) => {
      requestAnimationFrame(() => {
        navigate(`/bills?county=${encodeURIComponent(county)}`);
      });
    }, 100),
    [navigate]
  );

  // Create marker element
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    el.style.cssText = `
      width: 12px;
      height: 12px;
      background-color: ${colors.red};
      border: 2px solid ${colors.black};
      border-radius: 50%;
      cursor: pointer;
      contain: layout style paint;
      will-change: transform;
      transform: translate3d(0, 0, 0);
      transition: all 0.2s ease-out;
    `;

    const handleInteraction = (e: Event) => {
      requestAnimationFrame(() => {
        switch(e.type) {
          case 'mouseenter':
            el.style.backgroundColor = colors.green;
            el.style.transform = 'translate3d(0, 0, 0) scale(1.2)';
            break;
          case 'mouseleave':
            el.style.backgroundColor = colors.red;
            el.style.transform = 'translate3d(0, 0, 0) scale(1)';
            break;
          case 'click':
            if (name !== selectedCounty) {
              setSelectedCounty(name);
              debouncedNavigate(name);
            }
            break;
        }
      });
    };

    el.addEventListener('mouseenter', handleInteraction, { passive: true });
    el.addEventListener('mouseleave', handleInteraction, { passive: true });
    el.addEventListener('click', handleInteraction);

    const cleanup = () => {
      el.removeEventListener('mouseenter', handleInteraction);
      el.removeEventListener('mouseleave', handleInteraction);
      el.removeEventListener('click', handleInteraction);
    };
    (el as any)._cleanup = cleanup;

    return el;
  }, [selectedCounty, debouncedNavigate]);

  // Cleanup function
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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapError) return;

    const initMap = async () => {
      try {
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current!,
          ...MAP_OPTIONS
        });

        // Wait for map to load
        await new Promise((resolve, reject) => {
          mapInstance.once('load', resolve);
          mapInstance.once('error', reject);
        });

        map.current = mapInstance;

        // Add counties layer
        mapInstance.addSource('counties', {
          type: 'geojson',
          data: kenyaCountiesGeoJSON
        });

        mapInstance.addLayer({
          id: 'county-fills',
          type: 'fill',
          source: 'counties',
          paint: {
            'fill-color': 'rgba(200, 100, 240, 0.1)',
            'fill-outline-color': colors.black
          }
        });

        // Add markers
        const fragment = document.createDocumentFragment();
        const newMarkers: maplibregl.Marker[] = [];

        kenyaCountiesGeoJSON.features.forEach((county) => {
          const coordinates = county.geometry.coordinates;
          const name = county.properties.name;
          const el = createMarkerElement(name);

          const marker = new maplibregl.Marker({
            element: el,
            anchor: 'center'
          })
          .setLngLat([coordinates[0], coordinates[1]]);

          fragment.appendChild(el);
          newMarkers.push(marker);
        });

        // Batch add markers
        requestAnimationFrame(() => {
          newMarkers.forEach(marker => marker.addTo(mapInstance));
          markers.current = newMarkers;
        });

        // Add minimal controls
        const nav = new maplibregl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        mapInstance.addControl(nav, 'top-right');

      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('Failed to initialize map. Please refresh the page or try again later.');
      }
    };

    initMap();
    return cleanup;
  }, [cleanup, createMarkerElement, mapError]);

  if (mapError) {
    return <FallbackMap />;
  }

  return (
    <Card className="w-full h-[600px] relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ 
          contain: 'layout style paint',
          position: 'relative',
          touchAction: 'none'
        }}
      />
    </Card>
  );
};