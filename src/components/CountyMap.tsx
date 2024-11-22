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
  localIdeographFontFamily: "'Noto Sans', sans-serif",
  crossSourceCollisions: false,
  trackResize: false,
  renderingMode: '2d' as const,
  projection: 'mercator' as const,
  cooperativeGestures: true,
  maxParallelImageRequests: 16,
  refreshExpiredTiles: false,
  attributionControl: false,
  transformRequest: (url: string, resourceType: string) => {
    if (resourceType === 'Tile') {
      return {
        url,
        headers: {
          'Accept': 'image/webp,*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'max-age=3600'
        },
        credentials: 'omit'
      };
    }
    return { url };
  }
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

// Memoized marker options
const MARKER_OPTIONS = {
  draggable: false,
  rotation: 0,
  rotationAlignment: 'viewport',
  pitchAlignment: 'viewport',
  offset: [0, 0]
} as const;

// Pre-render marker images
const createOffscreenMarker = (color: string) => {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  ctx.scale(2, 2);
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = colors.black;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  return canvas;
};

const markerImages = {
  default: createOffscreenMarker(colors.primary),
  hover: createOffscreenMarker(colors.primary.replace('rgb', 'rgba').replace(')', ', 0.7)')),
  selected: createOffscreenMarker(colors.secondary)
};

export const CountyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [webGLInfo, setWebGLInfo] = useState<any>(null);
  const navigate = useNavigate();
  const markerRefs = useRef<Map<string, HTMLElement>>(new Map());
  const searchParams = new URLSearchParams(window.location.search);
  const countyParam = searchParams.get('county');

  // Enhanced WebGL support check with proper fallback
  const checkWebGLSupport = () => {
    const canvas = document.createElement('canvas');
    let gl = null;
    let isWebGL2 = false;
    
    try {
      // Try WebGL2 first
      gl = canvas.getContext('webgl2');
      if (gl) {
        isWebGL2 = true;
      } else {
        // Fallback to WebGL1
        gl = canvas.getContext('webgl', {
          failIfMajorPerformanceCaveat: false,
          powerPreference: 'default',
          preserveDrawingBuffer: true,
          antialias: true
        }) || canvas.getContext('experimental-webgl');
      }
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return false;
    }
    
    if (!gl) {
      console.warn('WebGL not available');
      return false;
    }
    
    // Check for software rendering
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      
      console.info('WebGL Renderer:', renderer);
      console.info('WebGL Vendor:', vendor);
      
      if (renderer.toLowerCase().includes('swiftshader') || 
          renderer.toLowerCase().includes('software') ||
          renderer.toLowerCase().includes('llvmpipe')) {
        console.warn('Software rendering detected - performance may be degraded');
      }
    }

    // Check for required extensions
    const requiredExtensions = ['OES_element_index_uint', 'OES_vertex_array_object'];
    const missingExtensions = requiredExtensions.filter(ext => !gl.getExtension(ext));
    
    if (missingExtensions.length > 0) {
      console.warn('Missing required WebGL extensions:', missingExtensions);
      return false;
    }

    return {
      isWebGL2,
      hasHardwareAcceleration: !renderer?.toLowerCase().includes('software'),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
    };
  };

  // Check WebGL support on mount
  useLayoutEffect(() => {
    const glSupport = checkWebGLSupport();
    if (!glSupport) {
      setMapError('WebGL is not supported or has been disabled. Please check your browser settings.');
      return;
    }
    setWebGLInfo(glSupport);
  }, []);

  // Update selected county from URL
  useEffect(() => {
    if (countyParam) {
      setSelectedCounty(decodeURIComponent(countyParam));
    }
  }, [countyParam]);

  // Optimized navigation handler with React 18 transitions
  const debouncedNavigate = useMemo(
    () => debounce((county: string) => {
      startTransition(() => {
        navigate(`/bills?county=${encodeURIComponent(county)}`);
      });
    }, 150),
    [navigate]
  );

  // Create marker element with proper event handling
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    // Use pre-rendered images
    if (markerImages.default) {
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-image: url(${markerImages.default.toDataURL()});
        background-size: contain;
        cursor: pointer;
        contain: strict;
        will-change: transform;
        transform: translate3d(0, 0, 0) scale(${name === selectedCounty ? 1.2 : 1});
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;
        pointer-events: auto;
        transition: transform 0.2s ease-out;
      `;
    }

    // Store reference for quick access
    markerRefs.current.set(name, el);

    // Optimized event handling
    const handleHover = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (!target || !markerImages.hover || name === selectedCounty) return;

      requestAnimationFrame(() => {
        if (e.type === 'mouseenter') {
          target.style.backgroundImage = `url(${markerImages.hover.toDataURL()})`;
          target.style.transform = 'translate3d(0, 0, 0) scale(1.1)';
        } else {
          target.style.backgroundImage = `url(${markerImages.default!.toDataURL()})`;
          target.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
      });
    };

    // Handle marker click
    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't reselect already selected county
      if (name === selectedCounty) return;

      // Update all markers
      markerRefs.current.forEach((markerEl, countyName) => {
        if (countyName === name) {
          markerEl.style.backgroundImage = `url(${markerImages.selected!.toDataURL()})`;
          markerEl.style.transform = 'translate3d(0, 0, 0) scale(1.2)';
        } else {
          markerEl.style.backgroundImage = `url(${markerImages.default!.toDataURL()})`;
          markerEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
      });

      // Update state and navigate
      startTransition(() => {
        setSelectedCounty(name);
        navigate(`/bills?county=${encodeURIComponent(name)}`);
      });
    };

    el.addEventListener('mouseenter', handleHover, { passive: true });
    el.addEventListener('mouseleave', handleHover, { passive: true });
    el.addEventListener('click', handleClick, { passive: false });

    const cleanup = () => {
      el.removeEventListener('mouseenter', handleHover);
      el.removeEventListener('mouseleave', handleHover);
      el.removeEventListener('click', handleClick);
      markerRefs.current.delete(name);
    };
    (el as any)._cleanup = cleanup;

    return el;
  }, [selectedCounty, navigate]);

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

  // Initialize map with WebGL info
  useEffect(() => {
    if (!mapContainer.current || mapError || !webGLInfo) return;

    const initMap = async () => {
      try {
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current!,
          ...MAP_OPTIONS,
          useWebGL2: webGLInfo.isWebGL2,
          antialias: webGLInfo.hasHardwareAcceleration,
          maxParallelImageRequests: webGLInfo.hasHardwareAcceleration ? 16 : 8
        });

        // Wait for map to load with timeout
        await Promise.race([
          new Promise((resolve, reject) => {
            mapInstance.once('load', resolve);
            mapInstance.once('error', reject);
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Map load timeout')), 10000)
          )
        ]);

        map.current = mapInstance;

        // Add counties layer with optimized rendering
        mapInstance.addSource('counties', {
          type: 'geojson',
          data: kenyaCountiesGeoJSON,
          generateId: true,
          maxzoom: 12,
          tolerance: 0.375,
          buffer: 2
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

        // Batch add markers with worker
        const addMarkers = () => {
          const fragment = document.createDocumentFragment();
          const newMarkers: maplibregl.Marker[] = [];

          kenyaCountiesGeoJSON.features.forEach((county) => {
            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;
            const el = createMarkerElement(name);

            const marker = new maplibregl.Marker({
              ...MARKER_OPTIONS,
              element: el
            })
            .setLngLat([coordinates[0], coordinates[1]]);

            fragment.appendChild(el);
            newMarkers.push(marker);
          });

          requestAnimationFrame(() => {
            newMarkers.forEach(marker => marker.addTo(mapInstance));
            markers.current = newMarkers;
          });
        };

        // Use requestIdleCallback for non-critical markers
        if ('requestIdleCallback' in window) {
          requestIdleCallback(addMarkers, { timeout: 2000 });
        } else {
          setTimeout(addMarkers, 0);
        }

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
  }, [cleanup, createMarkerElement, mapError, webGLInfo]);

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