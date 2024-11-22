import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { kenyaCountiesGeoJSON } from "@/data/kenya-counties";

// Replace this with your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'sk.eyJ1IjoiZGV2cmF5ayIsImEiOiJjbTNzenl3a3MwM21rMmpzOTh1ZGU5dnpiIn0.t-FcrbhipBe7E_vNHeljSQ';

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
          // Add Kenya counties source
          mapInstance.addSource('counties', {
            type: 'geojson',
            data: kenyaCountiesGeoJSON
          });

          // Add counties layer
          mapInstance.addLayer({
            id: 'counties-fill',
            type: 'circle',
            source: 'counties',
            paint: {
              'circle-radius': 10,
              'circle-color': [
                'case',
                ['==', ['get', 'name'], selectedCounty],
                '#047857', // Selected county color
                '#f3f4f6' // Default county color
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#4b5563'
            }
          });

          // Add county labels
          mapInstance.addLayer({
            id: 'counties-label',
            type: 'symbol',
            source: 'counties',
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 12,
              'text-anchor': 'top',
              'text-offset': [0, 1]
            },
            paint: {
              'text-color': '#1f2937',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1
            }
          });

          console.log("Map layers added successfully");
        } catch (error) {
          console.error("Error adding map layers:", error);
          setMapError("Error adding map layers");
        }
      });

      // Add click interaction
      mapInstance.on('click', 'counties-fill', (e) => {
        if (e.features && e.features[0].properties) {
          const countyName = e.features[0].properties.name;
          setSelectedCounty(countyName);
          navigate(`/bills?county=${encodeURIComponent(countyName)}`);
        }
      });

      // Change cursor on hover
      mapInstance.on('mouseenter', 'counties-fill', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', 'counties-fill', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

      // Add navigation controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

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