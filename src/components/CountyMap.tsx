import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { useMediaQuery } from '@/hooks/use-media-query';
import kenyaCounties from '../data/kenya-counties.json';

// Kenya GeoJSON data with simplified county boundaries
// const kenyaCounties = {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Nairobi",
//         "code": "nairobi"
//       },
//       "geometry": {
//         "type": "Polygon",
//         "coordinates": [[[36.7, -1.4], [36.9, -1.4], [36.9, -1.2], [36.7, -1.2], [36.7, -1.4]]]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Mombasa",
//         "code": "mombasa"
//       },
//       "geometry": {
//         "type": "Polygon",
//         "coordinates": [[[39.5, -4.1], [39.7, -4.1], [39.7, -3.9], [39.5, -3.9], [39.5, -4.1]]]
//       }
//     },
//     // Add more counties as needed
//   ]
// };

interface CountyMapProps {
  selectedCounty: string | null;
  onCountySelect?: (countyId: string) => void;
}

function MapController({ selectedCounty }: { selectedCounty: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCounty) {
      const county = kenyaCounties.features.find(
        f => f.properties.name.toLowerCase() === selectedCounty.toLowerCase()
      );
      if (county) {
        const bounds = L.geoJSON(county).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedCounty, map]);

  return null;
}

export function CountyMap({ selectedCounty, onCountySelect }: CountyMapProps) {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const getCountyStyle = (feature: any) => {
    const isSelected = selectedCounty?.toLowerCase() === feature.properties.name.toLowerCase();
    const isHovered = hoveredCounty?.toLowerCase() === feature.properties.name.toLowerCase();

    return {
      fillColor: isSelected ? '#2563eb' : isHovered ? '#4b5563' : '#64748b',
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: isSelected ? 0.6 : isHovered ? 0.7 : 0.4
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: () => setHoveredCounty(feature.properties.name),
      mouseout: () => setHoveredCounty(null),
      click: () => {
        if (onCountySelect) {
          onCountySelect(feature.properties.name);
        }
        navigate(`/bills?county=${feature.properties.name.toLowerCase()}`);
      }
    });

    // Add county name label
    const center = layer.getBounds().getCenter();
    const label = L.divIcon({
      className: 'county-label',
      html: `<div style="
        background-color: rgba(255,255,255,0.8);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #1f2937;
        white-space: nowrap;
      ">${feature.properties.name}</div>`,
    });
    L.marker(center, { icon: label }).addTo(layer._map);
  };

  return (
    <div className="w-full h-[600px] rounded-lg shadow-lg overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <MapContainer
        center={[0.0236, 37.9062]}
        zoom={isMobile ? 5 : 6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={kenyaCounties}
          style={getCountyStyle}
          onEachFeature={onEachFeature}
        />
        <MapController selectedCounty={selectedCounty} />
      </MapContainer>
    </div>
  );
}