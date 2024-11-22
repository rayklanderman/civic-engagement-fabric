import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";

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

export function CountyMap() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(37.9062);
  const [lat] = useState(0.0236);
  const [zoom] = useState(5.5);

  useEffect(() => {
    if (!mapContainer.current) {
      console.error("Map container not found");
      setMapError("Map container not found");
      return;
    }

    try {
      if (!mapboxgl.accessToken) {
        throw new Error("Mapbox token not found");
      }

      console.log("Initializing map with token:", mapboxgl.accessToken.substring(0, 10) + "...");

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [lng, lat],
        zoom: zoom,
        minZoom: 5,
        maxZoom: 9
      });

      const mapInstance = map.current;

      mapInstance.on('load', () => {
        console.log("Map loaded successfully");
        try {
          // Kenyan flag colors
          const colors = {
            red: '#BE0027',    // Red from Kenyan flag
            green: '#007A3D',  // Green from Kenyan flag
            black: '#000000',  // Black from Kenyan flag
            white: '#FFFFFF'   // White from Kenyan flag
          };

          // Add markers for each county
          kenyaCountiesGeoJSON.features.forEach((county) => {
            const coordinates = county.geometry.coordinates;
            const name = county.properties.name;

            // Create marker element
            const el = document.createElement('div');
            el.className = 'county-marker';
            el.style.width = '15px';
            el.style.height = '15px';
            el.style.backgroundColor = colors.red;
            el.style.border = `2px solid ${colors.black}`;
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';
            el.style.transition = 'all 0.3s ease';

            // Add hover effect
            el.addEventListener('mouseenter', () => {
              el.style.backgroundColor = colors.green;
              el.style.transform = 'scale(1.2)';
            });

            el.addEventListener('mouseleave', () => {
              el.style.backgroundColor = colors.red;
              el.style.transform = 'scale(1)';
            });

            // Add click handler
            el.addEventListener('click', () => {
              setSelectedCounty(name);
              navigate(`/bills?county=${encodeURIComponent(name)}`);
            });

            // Add marker to map
            new mapboxgl.Marker(el)
              .setLngLat(coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`<h3 style="color: ${colors.black}; margin: 0;">${name}</h3>`)
              )
              .addTo(map.current!);
          });

          // Add navigation control with Kenyan flag colors
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
          console.error("Error adding map layers:", error);
          setMapError("Error adding map layers");
        }
      });

      // Add click interaction
      mapInstance.on('click', (e) => {
        if (e.features && e.features[0].properties) {
          const countyName = e.features[0].properties.name;
          setSelectedCounty(countyName);
          navigate(`/bills?county=${encodeURIComponent(countyName)}`);
        }
      });

      // Change cursor on hover
      mapInstance.on('mouseenter', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

      mapInstance.on('error', (e) => {
        console.error("Mapbox error:", e);
        setMapError("Map error occurred");
      });

    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Error initializing map");
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lng, lat, zoom, selectedCounty, navigate]);

  const handleCountyClick = (county: string) => {
    setSelectedCounty(county);
    navigate(`/bills?county=${encodeURIComponent(county)}`);
    
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