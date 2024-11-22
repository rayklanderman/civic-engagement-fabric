import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { kenyaCountiesGeoJSON } from '@/lib/counties';
import { cn } from '@/lib/utils';

export const CountyList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  // Sort counties alphabetically
  const counties = kenyaCountiesGeoJSON.features
    .map(county => county.properties.name)
    .sort((a, b) => a.localeCompare(b));

  // Filter counties based on search
  const filteredCounties = counties.filter(county =>
    county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountyClick = (county: string) => {
    setSelectedCounty(county);
    navigate(`/bills?county=${encodeURIComponent(county)}`);
  };

  return (
    <Card className="w-full max-w-sm p-4 shadow-lg">
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
                key={county}
                onClick={() => handleCountyClick(county)}
                className={cn(
                  'w-full text-left px-4 py-2 rounded-lg transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  selectedCounty === county && 'bg-primary text-primary-foreground'
                )}
              >
                {county}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
