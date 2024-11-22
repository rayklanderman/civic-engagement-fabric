import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";
import debounce from 'lodash/debounce';
import { colors } from '../lib/colors';

// Disable worker pool extension to prevent errors
// @ts-ignore
delete mapboxgl.workerPool;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGV2cmF5ayIsImEiOiJjbTNzenU3azAwM2pxMmxzNXptdGZkbmRnIn0.Vve0ErWPY7nM4bIrn1bD_g';

// Kenyan flag colors
const colors = {
  red: '#BE0027',
  green: '#007A3D',
  black: '#000000',
  white: '#FFFFFF'
};

const MAP_OPTIONS = {
  style: 'mapbox://styles/mapbox/light-v11',
  minZoom: 5,
  maxZoom: 9,
  renderWorldCopies: false,
  attributionControl: true,
  preserveDrawingBuffer: true,
  antialias: true,
  failIfMajorPerformanceCaveat: false,
  maxBounds: [
    [32.913597, -4.720556], // Southwest coordinates
    [41.899397, 5.506] // Northeast coordinates
  ],
  crossSourceCollisions: false,
  transformRequest: (url: string, resourceType: string) => {
    if (resourceType === 'Source' && url.startsWith('mapbox://')) {
      return {
        url: url.replace('mapbox://', 'https://api.mapbox.com/'),
        headers: { 'Authorization': `Bearer ${MAPBOX_TOKEN}` }
      };
    }
    return { url };
  }
} as const;

export function CountyMap() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const initialViewState = useMemo(() => ({
    lng: 37.9062,
    lat: 0.0236,
    zoom: 5.5
  }), []);

  // Debounced navigation function
  const debouncedNavigate = useCallback(
    debounce((countyName: string) => {
      navigate(`/bills?county=${encodeURIComponent(countyName)}`);
    }, 150),
    [navigate]
  );

  // Create marker element with optimized event handling
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    // Apply styles once
    const styles = {
      width: '12px',
      height: '12px',
      backgroundColor: colors.red,
      border: `2px solid ${colors.black}`,
      borderRadius: '50%',
      cursor: 'pointer',
      willChange: 'transform',
      transform: 'translate3d(0, 0, 0)',
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    };
    
    Object.assign(el.style, styles);

    // Debounce style updates
    const updateStyles = debounce((isHovered: boolean) => {
      requestAnimationFrame(() => {
        el.style.setProperty('background-color', isHovered ? colors.green : colors.red, 'important');
        el.style.setProperty('transform', `translate3d(0, 0, 0) scale(${isHovered ? 1.2 : 1})`, 'important');
      });
    }, 16);

    // Use passive event listeners with debounced handlers
    const handleMouseEnter = () => {
      updateStyles(true);
    };

    const handleMouseLeave = () => {
      updateStyles(false);
    };

    const handleClick = (e: Event) => {
      e.preventDefault();
      if (name !== selectedCounty) {
        setSelectedCounty(name);
        // Use requestIdleCallback for non-critical updates
        requestIdleCallback(() => {
          debouncedNavigate(name);
        }, { timeout: 300 });
      }
    };

    el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    el.addEventListener('click', handleClick, { passive: false });

    // Store cleanup function
    const cleanup = () => {
      updateStyles.cancel();
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleClick);
    };
    el.dataset.cleanup = 'true';
    (el as any)._cleanup = cleanup;

    return el;
  }, [debouncedNavigate, selectedCounty]);

  // Optimized cleanup function
  const cleanup = useCallback(() => {
    markers.current.forEach(marker => {
      const el = marker.getElement();
      if (el.dataset.cleanup === 'true' && (el as any)._cleanup) {
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

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map with WebGL optimizations
      mapboxgl.accessToken = MAPBOX_TOKEN;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        ...MAP_OPTIONS,
        center: [initialViewState.lng, initialViewState.lat],
        zoom: initialViewState.zoom,
        preserveDrawingBuffer: false, // Improve performance
        antialias: false, // Disable antialiasing for better performance
        maxPitch: 0, // Disable 3D perspective for better performance
        renderWorldCopies: false, // Disable world copies for better performance
      });

      // Add error handling for map load
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        // Attempt recovery by resetting the map style
        if (map.current) {
          map.current.setStyle('mapbox://styles/mapbox/light-v11');
        }
      });

      // Initialize markers only after map is loaded
      map.current.on('load', () => {
        requestAnimationFrame(() => {
          const fragment = document.createDocumentFragment();
          const newMarkers: mapboxgl.Marker[] = [];

          kenyaCountiesGeoJSON.features.forEach((county) => {
            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;
            const el = createMarkerElement(name);
            fragment.appendChild(el);

            const marker = new mapboxgl.Marker({
              element: el,
              anchor: 'center',
              offset: [0, 0]
            })
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ 
                  offset: 15,
                  closeButton: false,
                  className: 'county-popup',
                  maxWidth: '300px',
                  focusAfterOpen: false
                })
                .setHTML(`<h3 style="color: ${colors.black}; margin: 0; padding: 8px;">${name}</h3>`)
              );

            newMarkers.push(marker);
          });

          // Batch add markers to map
          newMarkers.forEach(marker => marker.addTo(map.current));
          markers.current = newMarkers;
        });
      });

      // Add navigation controls with performance optimizations
      const nav = new mapboxgl.NavigationControl({
        showCompass: false, // Disable compass for better performance
        showZoom: true,
        visualizePitch: false
      });
      map.current.addControl(nav, 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return cleanup;
  }, [initialViewState.lng, initialViewState.lat, initialViewState.zoom, cleanup, createMarkerElement]);

  return (
    <Card className="w-full h-[600px] relative">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <p className="text-red-600">{mapError}</p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}