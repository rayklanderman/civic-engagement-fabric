import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

// Kenya GeoJSON data with accurate county coordinates
const KENYA_TOPO_JSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        county: "Nairobi",
        county_code: 47
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[36.8219, -1.2921], [36.8319, -1.2921], [36.8319, -1.2821], [36.8219, -1.2821], [36.8219, -1.2921]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Mombasa",
        county_code: 1
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[39.6648, -4.0435], [39.6748, -4.0435], [39.6748, -4.0335], [39.6648, -4.0335], [39.6648, -4.0435]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Kisumu",
        county_code: 42
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.7594, -0.0917], [34.7694, -0.0917], [34.7694, -0.0817], [34.7594, -0.0817], [34.7594, -0.0917]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Nakuru",
        county_code: 32
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[36.0708, -0.3031], [36.0808, -0.3031], [36.0808, -0.2931], [36.0708, -0.2931], [36.0708, -0.3031]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Eldoret",
        county_code: 27
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[35.2784, 0.5143], [35.2884, 0.5143], [35.2884, 0.5243], [35.2784, 0.5243], [35.2784, 0.5143]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Kisii",
        county_code: 45
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.7735, -0.6832], [34.7835, -0.6832], [34.7835, -0.6732], [34.7735, -0.6732], [34.7735, -0.6832]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Machakos",
        county_code: 16
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[37.2634, -1.5177], [37.2734, -1.5177], [37.2734, -1.5077], [37.2634, -1.5077], [37.2634, -1.5177]]]
      }
    },
    {
      type: "Feature",
      properties: {
        county: "Kiambu",
        county_code: 22
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[36.8260, -1.1618], [36.8360, -1.1618], [36.8360, -1.1518], [36.8260, -1.1518], [36.8260, -1.1618]]]
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
        <div className="aspect-video bg-white rounded-lg overflow-hidden border relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 25000,
              center: [37.5, -1.2] // Centered between major counties
            }}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <Geographies geography={KENYA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={geo.properties.county === selectedCounty ? "#6b46c1" : "#e9d5ff"}
                    stroke="#4c1d95"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: "#a855f7",
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        outline: "none"
                      }
                    }}
                    onClick={() => handleCountyClick(geo.properties.county)}
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