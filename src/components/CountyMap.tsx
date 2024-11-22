import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

// All 47 counties of Kenya
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
        <h2 className="text-xl font-semibold mb-4">Kenya Counties Map</h2>
        <div className="aspect-video bg-white rounded-lg overflow-hidden border relative">
          <svg
            viewBox="0 0 800 1000"
            className="w-full h-full"
            style={{ backgroundColor: '#f0f9ff' }}
          >
            {/* Kenya outline */}
            <path
              d="M400,100 L600,200 L700,400 L650,600 L500,800 L300,850 L200,700 L150,500 L200,300 Z"
              fill="#e5e7eb"
              stroke="#374151"
              strokeWidth="2"
              className="transition-colors"
            />
            
            {/* County regions - simplified for visualization */}
            {[
              { id: "nairobi", path: "M400,500 L420,500 L420,520 L400,520 Z", label: "Nairobi" },
              { id: "mombasa", path: "M500,700 L520,700 L520,720 L500,720 Z", label: "Mombasa" },
              { id: "kisumu", path: "M300,400 L320,400 L320,420 L300,420 Z", label: "Kisumu" },
              { id: "nakuru", path: "M350,450 L370,450 L370,470 L350,470 Z", label: "Nakuru" },
              // Add more county paths here as needed
            ].map((county) => (
              <g key={county.id}>
                <path
                  d={county.path}
                  fill={selectedCounty === county.label ? "#6b46c1" : "#e9d5ff"}
                  stroke="#4c1d95"
                  strokeWidth="1"
                  onClick={() => handleCountyClick(county.label)}
                  className="cursor-pointer hover:fill-purple-400 transition-colors"
                />
                <text
                  x={county.path.split(" ")[1]}
                  y={county.path.split(" ")[2]}
                  fontSize="12"
                  textAnchor="middle"
                  className="pointer-events-none font-semibold"
                >
                  {county.label}
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