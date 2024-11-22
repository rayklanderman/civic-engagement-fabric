import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useCallback, useState, useMemo, useLayoutEffect, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { colors } from '@/lib/colors';
import { Card } from "@/components/ui/card";
import { FallbackMap } from './FallbackMap';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";

// Performance optimization for map rendering
const MAP_RENDER_OPTIONS = {
  preserveDrawingBuffer: true,
  antialias: true,
  useWebGL2: true,
  failIfMajorPerformanceCaveat: false,
  performanceMetrics: true,
  optimizeForTerrain: false,
  maxParallelImageRequests: 16,
  localIdeographFontFamily: "'Noto Sans', sans-serif",
  crossSourceCollisions: false
} as const;

// Check for WebGL support with performance considerations
const checkWebGLSupport = () => {
  const canvas = document.createElement('canvas');
  let gl = null;
  
  try {
    gl = canvas.getContext('webgl2') || 
         canvas.getContext('webgl') || 
         canvas.getContext('experimental-webgl');
  } catch (e) {
    return false;
  }
  
  if (!gl) return false;
  
  // Check for minimum requirements
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (renderer.toLowerCase().includes('swiftshader')) {
      console.warn('Software rendering detected. Performance may be degraded.');
    }
  }
  
  return true;
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
  ...MAP_RENDER_OPTIONS,
  center: [37.9062, 0.0236],
  zoom: 5.5,
  maxPitch: 0,
  renderWorldCopies: false,
  attributionControl: false,
  maxBounds: [
    [32.9, -4.8],
    [42.0, 4.5]
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
  useLayoutEffect(() => {
    if (!checkWebGLSupport()) {
      setMapError('WebGL is not supported or has been disabled. Please check your browser settings.');
      return;
    }
  }, []);

  // Optimized navigation handler with React 18 transitions
  const debouncedNavigate = useMemo(
    () => debounce((county: string) => {
      startTransition(() => {
        navigate(`/bills?county=${encodeURIComponent(county)}`);
      });
    }, 150),
    [navigate]
  );

  // Optimized marker element creator
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    // Use GPU-accelerated properties
    el.style.cssText = `
      width: 12px;
      height: 12px;
      background-color: ${colors.red};
      border: 2px solid ${colors.black};
      border-radius: 50%;
      cursor: pointer;
      contain: strict;
      will-change: transform;
      transform: translate3d(0, 0, 0);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease-out;
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;
    `;

    const handleInteraction = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      
      switch(e.type) {
        case 'mouseenter':
          requestAnimationFrame(() => {
            target.style.backgroundColor = colors.green;
            target.style.transform = 'translate3d(0, 0, 0) scale(1.2)';
          });
          break;
          
        case 'mouseleave':
          requestAnimationFrame(() => {
            target.style.backgroundColor = colors.red;
            target.style.transform = 'translate3d(0, 0, 0) scale(1)';
          });
          break;
          
        case 'click':
          if (name !== selectedCounty) {
            startTransition(() => {
              setSelectedCounty(name);
              debouncedNavigate(name);
            });
          }
          break;
      }
    };

    el.addEventListener('mouseenter', handleInteraction, { passive: true });
    el.addEventListener('mouseleave', handleInteraction, { passive: true });
    el.addEventListener('click', handleInteraction, { passive: true });

    const cleanup = () => {
      el.removeEventListener('mouseenter', handleInteraction);
      el.removeEventListener('mouseleave', handleInteraction);
      el.removeEventListener('click', handleInteraction);
    };
    (el as any)._cleanup = cleanup;

    return el;
  }, [selectedCounty, debouncedNavigate]);

  // Cleanup function with proper error handling
  const cleanup = useCallback(() => {
    try {
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
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, []);

  // Initialize map with optimized loading
  useEffect(() => {
    if (!mapContainer.current || mapError) return;

    const initMap = async () => {
      try {
        // Create map instance with optimized options
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current!,
          ...MAP_OPTIONS,
          transformRequest: (url: string, resourceType: string) => {
            if (resourceType === 'Tile' && url.includes('openstreetmap.org')) {
              return {
                url,
                headers: {
                  'Accept': 'image/webp,*/*',
                  'Accept-Encoding': 'gzip, deflate, br'
                }
              };
            }
          }
        });

        // Wait for map to load
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Map load timeout'));
          }, 10000);

          mapInstance.once('load', () => {
            clearTimeout(timeoutId);
            resolve(undefined);
          });
          
          mapInstance.once('error', (error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
        });

        map.current = mapInstance;

        // Add counties layer with optimized rendering
        mapInstance.addSource('counties', {
          type: 'geojson',
          data: kenyaCountiesGeoJSON,
          generateId: true,
          maxzoom: 12
        });

        mapInstance.addLayer({
          id: 'county-fills',
          type: 'fill',
          source: 'counties',
          paint: {
            'fill-color': 'rgba(200, 100, 240, 0.1)',
            'fill-outline-color': colors.black,
            'fill-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 8, 0.6]
          }
        });

        // Batch add markers for better performance
        const fragment = document.createDocumentFragment();
        const newMarkers: maplibregl.Marker[] = [];

        requestAnimationFrame(() => {
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

          // Add all markers in a single frame
          requestAnimationFrame(() => {
            newMarkers.forEach(marker => marker.addTo(mapInstance));
            markers.current = newMarkers;
          });
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
          contain: 'strict',
          position: 'relative',
          touchAction: 'none',
          isolation: 'isolate',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </Card>
  );
};