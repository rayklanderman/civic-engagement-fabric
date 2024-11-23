import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useRouter } from 'next/navigation';

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2cmF5ayIsImEiOiJjbTNzenU3azAwM2pxMmxzNXptdGZkbmRnIn0.Vve0ErWPY7nM4bIrn1bD_g';

interface CountyMapProps {
  selectedCounty: string | null;
  onCountySelect?: (countyId: string) => void;
}

export function CountyMap({ selectedCounty, onCountySelect }: CountyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hoveredCountyId = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

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
        ],
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        }),
        isMobile ? 'bottom-right' : 'top-right'
      );

      map.current.on('load', () => {
        // Add the counties source
        map.current!.addSource('counties', {
          type: 'vector',
          url: 'mapbox://mapbox.boundaries-adm2-v3'
        });

        // Add fill layer for counties
        map.current!.addLayer({
          id: 'county-fills',
          type: 'fill',
          source: 'counties',
          'source-layer': 'boundaries_admin_2',
          filter: ['==', ['get', 'iso_3166_1'], 'KE'],
          paint: {
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#4b5563',
              ['boolean', ['feature-state', 'selected'], false],
              '#2563eb',
              '#64748b'
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.7,
              ['boolean', ['feature-state', 'selected'], false],
              0.6,
              0.4
            ]
          }
        });

        // Add line layer for county borders
        map.current!.addLayer({
          id: 'county-borders',
          type: 'line',
          source: 'counties',
          'source-layer': 'boundaries_admin_2',
          filter: ['==', ['get', 'iso_3166_1'], 'KE'],
          paint: {
            'line-color': '#ffffff',
            'line-width': 1
          }
        });

        // Add county labels
        map.current!.addLayer({
          id: 'county-labels',
          type: 'symbol',
          source: 'counties',
          'source-layer': 'boundaries_admin_2',
          filter: ['==', ['get', 'iso_3166_1'], 'KE'],
          layout: {
            'text-field': ['get', 'name_en'],
            'text-font': ['Open Sans Bold'],
            'text-size': 12,
            'text-anchor': 'center',
            'text-justify': 'center',
            'text-offset': [0, 0]
          },
          paint: {
            'text-color': '#1f2937',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1
          }
        });

        // Handle mouse enter
        map.current!.on('mousemove', 'county-fills', (e) => {
          if (e.features.length > 0) {
            if (hoveredCountyId.current) {
              map.current!.setFeatureState(
                { source: 'counties', sourceLayer: 'boundaries_admin_2', id: hoveredCountyId.current },
                { hover: false }
              );
            }
            hoveredCountyId.current = e.features[0].id as string;
            map.current!.setFeatureState(
              { source: 'counties', sourceLayer: 'boundaries_admin_2', id: hoveredCountyId.current },
              { hover: true }
            );
          }
        });

        // Handle mouse leave
        map.current!.on('mouseleave', 'county-fills', () => {
          if (hoveredCountyId.current) {
            map.current!.setFeatureState(
              { source: 'counties', sourceLayer: 'boundaries_admin_2', id: hoveredCountyId.current },
              { hover: false }
            );
            hoveredCountyId.current = null;
          }
        });

        // Handle click
        map.current!.on('click', 'county-fills', (e) => {
          if (e.features.length > 0) {
            const countyName = e.features[0].properties.name_en;
            const countyId = e.features[0].id as string;

            // Update selected state
            if (onCountySelect) {
              onCountySelect(countyName);
            }

            // Navigate to bills page
            router.push(`/bills?county=${countyName.toLowerCase()}`);

            // Fly to the county
            const bounds = new mapboxgl.LngLatBounds();
            const coordinates = e.features[0].geometry.coordinates[0];
            coordinates.forEach((coord: any) => {
              bounds.extend(coord as mapboxgl.LngLatLike);
            });

            map.current!.fitBounds(bounds, {
              padding: 50,
              duration: 1000
            });
          }
        });

        // Update cursor on hover
        map.current!.on('mouseenter', 'county-fills', () => {
          map.current!.getCanvas().style.cursor = 'pointer';
        });

        map.current!.on('mouseleave', 'county-fills', () => {
          map.current!.getCanvas().style.cursor = '';
        });
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred initializing the map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isMobile, onCountySelect, router]);

  // Update selected county state
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && selectedCounty) {
      // Reset previous selection
      map.current.setFeatureState(
        { source: 'counties', sourceLayer: 'boundaries_admin_2', id: selectedCounty },
        { selected: false }
      );

      // Set new selection
      map.current.setFeatureState(
        { source: 'counties', sourceLayer: 'boundaries_admin_2', id: selectedCounty },
        { selected: true }
      );
    }
  }, [selectedCounty]);

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