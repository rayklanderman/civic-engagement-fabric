import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

// Simplified coordinates for major Kenya counties
const COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa", 
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", 
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", 
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", 
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", 
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", 
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

// Major regions for simplified visualization
const MAJOR_REGIONS = [
  { name: "Nairobi", path: "M300,250 L310,250 L310,260 L300,260 Z", transform: "translate(-5,-5)" },
  { name: "Coast", path: "M320,280 Q330,290 340,300 L330,310 Q320,300 310,290 Z", transform: "translate(-15,-15)" },
  { name: "Western", path: "M240,220 L250,230 L240,240 L230,230 Z", transform: "translate(-5,-5)" },
  { name: "Nyanza", path: "M260,240 L270,250 L260,260 L250,250 Z", transform: "translate(-10,-10)" },
  { name: "Central", path: "M280,230 L290,240 L280,250 L270,240 Z", transform: "translate(-8,-8)" },
  { name: "Rift Valley", path: "M220,200 Q240,220 260,240 L250,250 Q230,230 210,210 Z", transform: "translate(-5,-5)" },
  { name: "Eastern", path: "M300,220 Q320,240 340,260 L330,270 Q310,250 290,230 Z", transform: "translate(-12,-12)" },
  { name: "North Eastern", path: "M340,180 Q360,200 380,220 L370,230 Q350,210 330,190 Z", transform: "translate(-20,-20)" }
];

export function CountyMap() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const navigate = useNavigate();

  const handleCountyClick = (county: string) => {
    setSelectedCounty(county);
    navigate(`/bills?county=${encodeURIComponent(county)}`);
  };

  const handleRegionClick = (regionName: string) => {
    // Find the first county in the clicked region and use that
    const countyInRegion = COUNTIES.find(county => 
      county === regionName || 
      (regionName === "Coast" && ["Mombasa", "Kilifi", "Kwale"].includes(county)) ||
      (regionName === "Western" && ["Kakamega", "Bungoma", "Busia"].includes(county)) ||
      (regionName === "Nyanza" && ["Kisumu", "Siaya", "Homa Bay"].includes(county)) ||
      (regionName === "Central" && ["Kiambu", "Nyeri", "Muranga"].includes(county)) ||
      (regionName === "Rift Valley" && ["Nakuru", "Uasin Gishu", "Narok"].includes(county)) ||
      (regionName === "Eastern" && ["Machakos", "Kitui", "Makueni"].includes(county)) ||
      (regionName === "North Eastern" && ["Garissa", "Wajir", "Mandera"].includes(county))
    );

    if (countyInRegion) {
      handleCountyClick(countyInRegion);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Interactive County Map</h2>
        <div className="aspect-video bg-white rounded-lg overflow-hidden border relative">
          <svg
            viewBox="200 150 200 200"
            className="w-full h-full"
            style={{ backgroundColor: '#f0f9ff' }}
          >
            {MAJOR_REGIONS.map((region) => (
              <g key={region.name} transform={region.transform}>
                <path
                  d={region.path}
                  fill={region.name === selectedCounty ? "#6b46c1" : "#e9d5ff"}
                  stroke="#4c1d95"
                  strokeWidth="2"
                  onClick={() => handleRegionClick(region.name)}
                  className="cursor-pointer hover:fill-purple-400 transition-colors"
                />
                <text
                  x={region.name === "Nairobi" ? "300" : 
                     region.name === "Coast" ? "320" :
                     region.name === "Western" ? "240" :
                     region.name === "Nyanza" ? "260" :
                     region.name === "Central" ? "280" :
                     region.name === "Rift Valley" ? "220" :
                     region.name === "Eastern" ? "300" :
                     "340"}
                  y={region.name === "Nairobi" ? "255" :
                     region.name === "Coast" ? "295" :
                     region.name === "Western" ? "235" :
                     region.name === "Nyanza" ? "255" :
                     region.name === "Central" ? "245" :
                     region.name === "Rift Valley" ? "215" :
                     region.name === "Eastern" ? "245" :
                     "205"}
                  fontSize="8"
                  textAnchor="middle"
                  className="pointer-events-none font-semibold"
                >
                  {region.name}
                </text>
              </g>
            ))}
          </svg>
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
