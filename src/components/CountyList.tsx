import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { kenyaCountiesGeoJSON } from '@/lib/counties';
import { cn } from '@/lib/utils';
import { County } from '@/types';

interface CountyListProps {
  selectedCounty: County | null;
  onSelectCounty: (county: County) => void;
}

export function CountyList({ selectedCounty, onSelectCounty }: CountyListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Add a safe format function
  const formatNumber = (num: number | undefined | null) => {
    return num ? num.toLocaleString() : 'N/A';
  };

  // Sort counties alphabetically
  const counties = kenyaCountiesGeoJSON.features
    .map(county => ({
      id: county.properties.id,
      name: county.properties.name,
      capital: county.properties.capital,
      population: county.properties.population,
      area: county.properties.area,
      governor: county.properties.governor,
      coordinates: {
        lat: county.geometry.coordinates[1],
        lng: county.geometry.coordinates[0]
      }
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter counties based on search
  const filteredCounties = counties.filter(county =>
    county.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full p-4 shadow-lg">
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Search counties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {filteredCounties.map((county) => (
              <button
                key={county.id}
                onClick={() => onSelectCounty(county)}
                className={cn(
                  'w-full text-left px-4 py-2 rounded-lg transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  selectedCounty?.id === county.id && 'bg-primary text-primary-foreground'
                )}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{county.name}</span>
                  <span className="text-sm text-gray-500">
                    Population: {formatNumber(county.population)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Area: {formatNumber(county.area)} km²
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
