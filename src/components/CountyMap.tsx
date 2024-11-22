import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

// Kenya GeoJSON data
const KENYA_TOPO_JSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Nairobi" },
      geometry: {
        type: "Polygon",
        coordinates: [[[36.7, -1.3], [36.9, -1.3], [36.9, -1.4], [36.7, -1.4], [36.7, -1.3]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Mombasa" },
      geometry: {
        type: "Polygon",
        coordinates: [[[39.6, -4.0], [39.7, -4.0], [39.7, -4.1], [39.6, -4.1], [39.6, -4.0]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Kisumu" },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.7, -0.1], [34.9, -0.1], [34.9, -0.2], [34.7, -0.2], [34.7, -0.1]]]
      }
    }
  ]
};

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
  const navigate = useNavigate();

  const handleCountyClick = (county: string) => {
    setSelectedCounty(county);
    navigate(`/bills?county=${encodeURIComponent(county)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Interactive County Map</h2>
        <div className="aspect-video bg-gray-100 rounded-lg">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2500,
              center: [37.9062, 0.0236]
            }}
          >
            <Geographies geography={KENYA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={geo.properties.name === selectedCounty ? "#9b87f5" : "#D6BCFA"}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#7E69AB", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => handleCountyClick(geo.properties.name)}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Counties List</h2>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {COUNTIES.sort().map((county) => (
              <button
                key={county}
                onClick={() => handleCountyClick(county)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCounty === county
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {county}
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}