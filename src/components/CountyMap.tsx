import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";
import debounce from 'lodash/debounce';

// Replace this with your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

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
  attributionControl: false,
  preserveDrawingBuffer: true,
  antialias: true,
  failIfMajorPerformanceCaveat: false
} as const;

export function CountyMap() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const markersLayer = useRef<mapboxgl.GeoJSONSource | null>(null);
  
  const initialViewState = useMemo(() => ({
    lng: 37.9062,
    lat: 0.0236,
    zoom: 5.5
  }), []);

  // Debounced navigation function with increased delay
  const debouncedNavigate = useCallback(
    debounce((countyName: string) => {
      requestAnimationFrame(() => {
        navigate(`/bills?county=${encodeURIComponent(countyName)}`);
      });
    }, 500),
    [navigate]
  );

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setIsWebGLSupported(!!gl);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (markersLayer.current) {
      markersLayer.current = null;
    }
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  }, []);

  // Create marker element with optimized rendering
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    // Use transform instead of width/height for better performance
    Object.assign(el.style, {
      transform: 'translate(-50%, -50%) scale(1)',
      width: '15px',
      height: '15px',
      backgroundColor: colors.red,
      border: `2px solid ${colors.black}`,
      borderRadius: '50%',
      cursor: 'pointer',
      willChange: 'transform, background-color',
      contain: 'layout style paint',
      position: 'relative'
    });

    const handleInteraction = (isHover: boolean) => {
      requestAnimationFrame(() => {
        el.style.backgroundColor = isHover ? colors.green : colors.red;
        el.style.transform = `translate(-50%, -50%) scale(${isHover ? 1.2 : 1})`;
      });
    };

    el.addEventListener('mouseenter', () => handleInteraction(true), { passive: true });
    el.addEventListener('mouseleave', () => handleInteraction(false), { passive: true });
    el.addEventListener('click', () => {
      setSelectedCounty(name);
      debouncedNavigate(name);
    }, { passive: true });

    return el;
  }, [debouncedNavigate]);

  useEffect(() => {
    if (!mapContainer.current || !isWebGLSupported) {
      setMapError(isWebGLSupported ? "Map container not found" : "WebGL not supported");
      return cleanup;
    }

    try {
      if (!mapboxgl.accessToken) {
        throw new Error("Mapbox token not found");
      }

      if (map.current) return cleanup;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        ...MAP_OPTIONS,
        center: [initialViewState.lng, initialViewState.lat],
        zoom: initialViewState.zoom,
      });

      const mapInstance = map.current;

      // Use worker pool for better performance
      if (mapInstance.painter && mapInstance.painter.context) {
        mapInstance.painter.context.extendWorkerPool(4);
      }

      mapInstance.on('load', () => {
        try {
          // Batch marker creation
          const fragment = document.createDocumentFragment();
          const markersToAdd: mapboxgl.Marker[] = [];

          kenyaCountiesGeoJSON.features.forEach((county) => {
            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;
            const el = createMarkerElement(name);
            fragment.appendChild(el);

            const marker = new mapboxgl.Marker(el)
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ 
                  offset: 25, 
                  closeButton: false,
                  className: 'county-popup'
                })
                .setHTML(`<h3 style="color: ${colors.black}; margin: 0;">${name}</h3>`)
              );

            markersToAdd.push(marker);
          });

          // Batch add markers
          requestAnimationFrame(() => {
            markersToAdd.forEach(marker => marker.addTo(mapInstance));
            markers.current = markersToAdd;
          });

          // Add navigation control with optimized styling
          const nav = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
          });

          mapInstance.addControl(nav, 'top-right');

          // Style navigation control
          requestAnimationFrame(() => {
            const navContainer = document.querySelector('.mapboxgl-ctrl-group');
            if (navContainer) {
              Object.assign((navContainer as HTMLElement).style, {
                border: `2px solid ${colors.black}`,
                backgroundColor: colors.white,
                contain: 'layout style paint'
              });
            }
          });

        } catch (error) {
          console.error("Error adding map features:", error);
          setMapError("Error adding map features");
        }
      });

      mapInstance.on('error', (e) => {
        console.error("Mapbox error:", e);
        setMapError("Map error occurred");
      });

    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Error initializing map");
    }

    return cleanup;
  }, [initialViewState.lng, initialViewState.lat, initialViewState.zoom, cleanup, createMarkerElement, isWebGLSupported]);

  return (
    <Card className="w-full h-[600px] relative">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <p className="text-red-600">{mapError}</p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" style={{ contain: 'layout paint style' }} />
    </Card>
  );
}