import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";
import debounce from 'lodash/debounce';

// Replace this with your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGV2cmF5ayIsImEiOiJjbTNzenU3azAwM2pxMmxzNXptdGZkbmRnIn0.Vve0ErWPY7nM4bIrn1bD_g';

const COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa", 
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", 
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", 
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", 
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", 
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", 
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

// Kenyan flag colors
const colors = {
  red: '#BE0027',    // Red from Kenyan flag
  green: '#007A3D',  // Green from Kenyan flag
  black: '#000000',  // Black from Kenyan flag
  white: '#FFFFFF'   // White from Kenyan flag
};

export function CountyMap() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [lng] = useState(37.9062);
  const [lat] = useState(0.0236);
  const [zoom] = useState(5.5);

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
      width: '15px',
      height: '15px',
      backgroundColor: colors.red,
      border: `2px solid ${colors.black}`,
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      willChange: 'transform'
    });

    const handleMouseEnter = () => {
      requestAnimationFrame(() => {
        el.style.backgroundColor = colors.green;
        el.style.transform = 'scale(1.2)';
      });
    };

    const handleMouseLeave = () => {
      requestAnimationFrame(() => {
        el.style.backgroundColor = colors.red;
        el.style.transform = 'scale(1)';
      });
    };

    const handleClick = () => {
      setSelectedCounty(name);
      debouncedNavigate(name);
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('click', handleClick);

    return el;
  }, [debouncedNavigate]);

  useEffect(() => {
    if (!mapContainer.current) {
      console.error("Map container not found");
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
        style: 'mapbox://styles/mapbox/light-v11',
        center: [lng, lat],
        zoom: zoom,
        minZoom: 5,
        maxZoom: 9,
        renderWorldCopies: false,
        attributionControl: false
      });

      map.current.on('load', () => {
        try {
          // Add markers for each county
          kenyaCountiesGeoJSON.features.forEach((county) => {
            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;
            const el = createMarkerElement(name);

            const marker = new mapboxgl.Marker(el)
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25, closeButton: false })
                  .setHTML(`<h3 style="color: ${colors.black}; margin: 0;">${name}</h3>`)
              )
              .addTo(map.current!);

            markers.current.push(marker);
          });

          // Add navigation control
          const nav = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
          });
          map.current.addControl(nav, 'top-right');

          // Style navigation control
          const navContainer = document.querySelector('.mapboxgl-ctrl-group');
          if (navContainer) {
            (navContainer as HTMLElement).style.border = `2px solid ${colors.black}`;
            (navContainer as HTMLElement).style.backgroundColor = colors.white;
          }
        } catch (error) {
          console.error("Error adding map features:", error);
          setMapError("Error adding map features");
        }
      });

      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        setMapError("Map error occurred");
      });

    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Error initializing map");
    }

    return cleanup;
  }, [lng, lat, zoom, cleanup, createMarkerElement]);

  const handleCountyClick = (county: string) => {
    setSelectedCounty(county);
    debouncedNavigate(county);
    
    // Find county coordinates
    const countyFeature = kenyaCountiesGeoJSON.features.find(
      feature => feature.properties.name === county
    );

    if (map.current && countyFeature) {
      map.current.flyTo({
        center: countyFeature.properties.coordinates,
        zoom: 7,
        duration: 1500
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Kenya Counties Map</h2>
        {mapError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {mapError}
          </div>
        )}
        <div 
          ref={mapContainer}
          className="aspect-video bg-white rounded-lg overflow-hidden border relative"
          style={{ minHeight: '400px' }}
        />
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">County List</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {COUNTIES.map((county) => (
            <button
              key={county}
              onClick={() => handleCountyClick(county)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCounty === county
                  ? "bg-emerald-100 text-emerald-900"
                  : "hover:bg-gray-100"
              }`}
            >
              {county}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}