import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { kenyaCountiesGeoJSON } from '@/lib/counties';
import { County } from '@/types';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CountyMapProps {
  selectedCounty: County | null;
  onSelectCounty: (county: County) => void;
}

export function CountyMap({ selectedCounty, onSelectCounty }: CountyMapProps) {
  const geoJSONRef = useRef<L.GeoJSON | null>(null);

  // Style function for counties
  const countyStyle = (feature: any) => {
    const isSelected = selectedCounty?.name === feature.properties.name;
    return {
      fillColor: isSelected ? '#006600' : '#BB0000',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: 'white',
      fillOpacity: isSelected ? 0.7 : 0.5,
    };
  };

  // Event handlers for county features
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const county: County = {
      id: feature.properties.id,
      name: feature.properties.name,
      capital: feature.properties.capital,
      population: feature.properties.population,
      area: feature.properties.area,
      governor: feature.properties.governor,
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }
    };

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.8,
          weight: 3,
        });
        layer.bindTooltip(county.name).openTooltip();
      },
      mouseout: (e) => {
        const layer = e.target;
        geoJSONRef.current?.resetStyle(layer);
        layer.unbindTooltip();
      },
      click: () => onSelectCounty(county),
    });
  };

  return (
    <div className="w-full h-[600px] rounded-lg shadow-lg overflow-hidden relative" style={{ border: '1px solid #e2e8f0' }}>
      <MapContainer
        center={[0.0236, 37.9062]}
        zoom={6}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          ref={geoJSONRef}
          data={kenyaCountiesGeoJSON}
          style={countyStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}