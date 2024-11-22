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
        <h2 className="text-2xl font-semibold mb-4">Kenya Counties Map</h2>
        <div className="aspect-video bg-white rounded-lg overflow-hidden border relative">
          <svg
            viewBox="0 0 800 1000"
            className="w-full h-full"
            style={{ backgroundColor: '#f0f9ff' }}
          >
            {/* Kenya outline with more accurate shape */}
            <path
              d="M350,100 L450,120 L500,150 L550,200 L600,250 L650,300 L680,350 
                 L700,400 L710,450 L720,500 L710,550 L700,600 L680,650 L650,700 
                 L600,750 L550,800 L500,850 L450,880 L400,900 L350,880 L300,850 
                 L250,800 L200,750 L150,700 L120,650 L100,600 L90,550 L80,500 
                 L90,450 L100,400 L120,350 L150,300 L200,250 L250,200 L300,150 Z"
              fill="#e5e7eb"
              stroke="#374151"
              strokeWidth="2"
              className="transition-colors"
            />
            
            {/* County regions with labels */}
            {[
              { id: "nairobi", path: "M400,500 L420,520 L400,540 L380,520 Z", label: "Nairobi", x: 400, y: 510 },
              { id: "mombasa", path: "M550,750 L570,770 L550,790 L530,770 Z", label: "Mombasa", x: 550, y: 760 },
              { id: "kisumu", path: "M250,450 L270,470 L250,490 L230,470 Z", label: "Kisumu", x: 250, y: 460 },
              { id: "nakuru", path: "M350,400 L370,420 L350,440 L330,420 Z", label: "Nakuru", x: 350, y: 410 },
              { id: "kiambu", path: "M380,480 L400,500 L380,520 L360,500 Z", label: "Kiambu", x: 380, y: 490 },
              { id: "machakos", path: "M450,550 L470,570 L450,590 L430,570 Z", label: "Machakos", x: 450, y: 560 },
              { id: "kajiado", path: "M400,600 L420,620 L400,640 L380,620 Z", label: "Kajiado", x: 400, y: 610 },
              { id: "garissa", path: "M600,400 L620,420 L600,440 L580,420 Z", label: "Garissa", x: 600, y: 410 },
              { id: "turkana", path: "M300,200 L320,220 L300,240 L280,220 Z", label: "Turkana", x: 300, y: 210 },
              { id: "kitui", path: "M500,450 L520,470 L500,490 L480,470 Z", label: "Kitui", x: 500, y: 460 }
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
                  x={county.x}
                  y={county.y}
                  fontSize="12"
                  textAnchor="middle"
                  className="pointer-events-none font-semibold"
                >
                  {county.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            * Interactive map showing major counties. Use the list for all counties.
          </div>
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
                    : "hover:bg-secondary/10"
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