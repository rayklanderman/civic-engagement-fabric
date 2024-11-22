import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";
import debounce from 'lodash/debounce';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2cmF5ayIsImEiOiJjbTNzenU3azAwM2pxMmxzNXptdGZkbmRnIn0.Vve0ErWPY7nM4bIrn1bD_g';

// Disable WebGL warning
mapboxgl.prewarm();

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
  ]
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
    }, 300),
    [navigate]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  }, []);

  // Create marker element
  const createMarkerElement = useCallback((name: string) => {
    const el = document.createElement('div');
    el.className = 'county-marker';
    
    Object.assign(el.style, {
      width: '12px',
      height: '12px',
      backgroundColor: colors.red,
      border: `2px solid ${colors.black}`,
      borderRadius: '50%',
      cursor: 'pointer'
    });

    el.addEventListener('mouseenter', () => {
      el.style.backgroundColor = colors.green;
      el.style.transform = 'scale(1.2)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.backgroundColor = colors.red;
      el.style.transform = 'scale(1)';
    });

    el.addEventListener('click', () => {
      setSelectedCounty(name);
      debouncedNavigate(name);
    });

    return el;
  }, [debouncedNavigate]);

  useEffect(() => {
    if (!mapContainer.current) {
      setMapError("Map container not found");
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

      mapInstance.on('load', () => {
        try {
          // Add markers
          kenyaCountiesGeoJSON.features.forEach((county) => {
            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;
            const el = createMarkerElement(name);

            const marker = new mapboxgl.Marker(el)
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ 
                  offset: 15,
                  closeButton: false,
                  className: 'county-popup'
                })
                .setHTML(`<h3 style="color: ${colors.black}; margin: 0; padding: 8px;">${name}</h3>`)
              );

            marker.addTo(mapInstance);
            markers.current.push(marker);
          });

          // Add navigation control
          mapInstance.addControl(
            new mapboxgl.NavigationControl({
              showCompass: true,
              showZoom: true
            }),
            'top-right'
          );

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