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
            xmlns="http://www.w3.org/2000/svg"
            viewBox="33.5 -5 38 38"
            className="w-full h-full"
          >
            <style>
              {`
                path {
                  fill: #e5e7eb;
                  stroke: #374151;
                  stroke-width: 0.1;
                  cursor: pointer;
                  transition: all 0.2s;
                }
                path:hover {
                  fill: #6b46c1;
                  stroke: #4c1d95;
                }
                path.selected {
                  fill: #6b46c1;
                  stroke: #4c1d95;
                }
                text {
                  font-size: 0.8px;
                  fill: #1f2937;
                  pointer-events: none;
                }
              `}
            </style>
            <path id="mombasa" d="M39.6,-4.0 L39.7,-3.9 L39.5,-3.8 L39.6,-4.0 Z" className={selectedCounty === "Mombasa" ? "selected" : ""} onClick={() => handleCountyClick("Mombasa")} />
            <path id="kwale" d="M39.4,-4.3 L39.5,-4.2 L39.3,-4.1 L39.4,-4.3 Z" className={selectedCounty === "Kwale" ? "selected" : ""} onClick={() => handleCountyClick("Kwale")} />
            <path id="kilifi" d="M39.6,-3.8 L39.7,-3.7 L39.5,-3.6 L39.6,-3.8 Z" className={selectedCounty === "Kilifi" ? "selected" : ""} onClick={() => handleCountyClick("Kilifi")} />
            <path id="tana_river" d="M39.8,-3.5 L39.9,-3.4 L39.7,-3.3 L39.8,-3.5 Z" className={selectedCounty === "Tana River" ? "selected" : ""} onClick={() => handleCountyClick("Tana River")} />
            <path id="lamu" d="M40.0,-3.2 L40.1,-3.1 L39.9,-3.0 L40.0,-3.2 Z" className={selectedCounty === "Lamu" ? "selected" : ""} onClick={() => handleCountyClick("Lamu")} />
            <path id="taita_taveta" d="M39.3,-4.5 L39.4,-4.4 L39.2,-4.3 L39.3,-4.5 Z" className={selectedCounty === "Taita Taveta" ? "selected" : ""} onClick={() => handleCountyClick("Taita Taveta")} />
            <path id="garissa" d="M40.2,-2.9 L40.3,-2.8 L40.1,-2.7 L40.2,-2.9 Z" className={selectedCounty === "Garissa" ? "selected" : ""} onClick={() => handleCountyClick("Garissa")} />
            <path id="wajir" d="M40.4,-2.6 L40.5,-2.5 L40.3,-2.4 L40.4,-2.6 Z" className={selectedCounty === "Wajir" ? "selected" : ""} onClick={() => handleCountyClick("Wajir")} />
            <path id="mandera" d="M40.6,-2.3 L40.7,-2.2 L40.5,-2.1 L40.6,-2.3 Z" className={selectedCounty === "Mandera" ? "selected" : ""} onClick={() => handleCountyClick("Mandera")} />
            <path id="marsabit" d="M39.8,-2.0 L39.9,-1.9 L39.7,-1.8 L39.8,-2.0 Z" className={selectedCounty === "Marsabit" ? "selected" : ""} onClick={() => handleCountyClick("Marsabit")} />
            <path id="isiolo" d="M39.4,-1.5 L39.5,-1.4 L39.3,-1.3 L39.4,-1.5 Z" className={selectedCounty === "Isiolo" ? "selected" : ""} onClick={() => handleCountyClick("Isiolo")} />
            <path id="meru" d="M39.2,-1.2 L39.3,-1.1 L39.1,-1.0 L39.2,-1.2 Z" className={selectedCounty === "Meru" ? "selected" : ""} onClick={() => handleCountyClick("Meru")} />
            <path id="tharaka_nithi" d="M39.0,-0.8 L39.1,-0.7 L38.9,-0.6 L39.0,-0.8 Z" className={selectedCounty === "Tharaka Nithi" ? "selected" : ""} onClick={() => handleCountyClick("Tharaka Nithi")} />
            <path id="embu" d="M38.8,-0.4 L38.9,-0.3 L38.7,-0.2 L38.8,-0.4 Z" className={selectedCounty === "Embu" ? "selected" : ""} onClick={() => handleCountyClick("Embu")} />
            <path id="kitui" d="M38.6,-0.0 L38.7,0.1 L38.5,0.2 L38.6,-0.0 Z" className={selectedCounty === "Kitui" ? "selected" : ""} onClick={() => handleCountyClick("Kitui")} />
            <path id="machakos" d="M38.4,0.4 L38.5,0.5 L38.3,0.6 L38.4,0.4 Z" className={selectedCounty === "Machakos" ? "selected" : ""} onClick={() => handleCountyClick("Machakos")} />
            <path id="makueni" d="M38.2,0.8 L38.3,0.9 L38.1,1.0 L38.2,0.8 Z" className={selectedCounty === "Makueni" ? "selected" : ""} onClick={() => handleCountyClick("Makueni")} />
            <path id="nyandarua" d="M37.9,1.2 L38.0,1.3 L37.8,1.4 L37.9,1.2 Z" className={selectedCounty === "Nyandarua" ? "selected" : ""} onClick={() => handleCountyClick("Nyandarua")} />
            <path id="nyeri" d="M37.7,1.6 L37.8,1.7 L37.6,1.8 L37.7,1.6 Z" className={selectedCounty === "Nyeri" ? "selected" : ""} onClick={() => handleCountyClick("Nyeri")} />
            <path id="kirinyaga" d="M37.5,2.0 L37.6,2.1 L37.4,2.2 L37.5,2.0 Z" className={selectedCounty === "Kirinyaga" ? "selected" : ""} onClick={() => handleCountyClick("Kirinyaga")} />
            <path id="muranga" d="M37.3,2.4 L37.4,2.5 L37.2,2.6 L37.3,2.4 Z" className={selectedCounty === "Murang'a" ? "selected" : ""} onClick={() => handleCountyClick("Murang'a")} />
            <path id="kiambu" d="M37.1,2.8 L37.2,2.9 L37.0,3.0 L37.1,2.8 Z" className={selectedCounty === "Kiambu" ? "selected" : ""} onClick={() => handleCountyClick("Kiambu")} />
            <path id="turkana" d="M36.9,3.2 L37.0,3.3 L36.8,3.4 L36.9,3.2 Z" className={selectedCounty === "Turkana" ? "selected" : ""} onClick={() => handleCountyClick("Turkana")} />
            <path id="west_pokot" d="M36.7,3.6 L36.8,3.7 L36.6,3.8 L36.7,3.6 Z" className={selectedCounty === "West Pokot" ? "selected" : ""} onClick={() => handleCountyClick("West Pokot")} />
            <path id="samburu" d="M36.5,4.0 L36.6,4.1 L36.4,4.2 L36.5,4.0 Z" className={selectedCounty === "Samburu" ? "selected" : ""} onClick={() => handleCountyClick("Samburu")} />
            <path id="trans_nzoia" d="M36.3,4.4 L36.4,4.5 L36.2,4.6 L36.3,4.4 Z" className={selectedCounty === "Trans Nzoia" ? "selected" : ""} onClick={() => handleCountyClick("Trans Nzoia")} />
            <path id="uasin_gishu" d="M36.1,4.8 L36.2,4.9 L36.0,5.0 L36.1,4.8 Z" className={selectedCounty === "Uasin Gishu" ? "selected" : ""} onClick={() => handleCountyClick("Uasin Gishu")} />
            <path id="elgeyo_marakwet" d="M35.9,5.2 L36.0,5.3 L35.8,5.4 L35.9,5.2 Z" className={selectedCounty === "Elgeyo-Marakwet" ? "selected" : ""} onClick={() => handleCountyClick("Elgeyo-Marakwet")} />
            <path id="nandi" d="M35.7,5.6 L35.8,5.7 L35.6,5.8 L35.7,5.6 Z" className={selectedCounty === "Nandi" ? "selected" : ""} onClick={() => handleCountyClick("Nandi")} />
            <path id="bomet" d="M35.5,6.0 L35.6,6.1 L35.4,6.2 L35.5,6.0 Z" className={selectedCounty === "Bomet" ? "selected" : ""} onClick={() => handleCountyClick("Bomet")} />
            <path id="kericho" d="M35.3,6.4 L35.4,6.5 L35.2,6.6 L35.3,6.4 Z" className={selectedCounty === "Kericho" ? "selected" : ""} onClick={() => handleCountyClick("Kericho")} />
            <path id="nakuru" d="M35.1,6.8 L35.2,6.9 L35.0,7.0 L35.1,6.8 Z" className={selectedCounty === "Nakuru" ? "selected" : ""} onClick={() => handleCountyClick("Nakuru")} />
            <path id="narok" d="M34.9,7.2 L35.0,7.3 L34.8,7.4 L34.9,7.2 Z" className={selectedCounty === "Narok" ? "selected" : ""} onClick={() => handleCountyClick("Narok")} />
            <path id="kajiado" d="M34.7,7.6 L34.8,7.7 L34.6,7.8 L34.7,7.6 Z" className={selectedCounty === "Kajiado" ? "selected" : ""} onClick={() => handleCountyClick("Kajiado")} />
            <path id="migori" d="M34.5,8.0 L34.6,8.1 L34.4,8.2 L34.5,8.0 Z" className={selectedCounty === "Migori" ? "selected" : ""} onClick={() => handleCountyClick("Migori")} />
            <path id="homabay" d="M34.3,8.4 L34.4,8.5 L34.2,8.6 L34.3,8.4 Z" className={selectedCounty === "Homa Bay" ? "selected" : ""} onClick={() => handleCountyClick("Homa Bay")} />
            <path id="kisumu" d="M34.1,8.8 L34.2,8.9 L34.0,9.0 L34.1,8.8 Z" className={selectedCounty === "Kisumu" ? "selected" : ""} onClick={() => handleCountyClick("Kisumu")} />
            <path id="siaya" d="M33.9,9.2 L34.0,9.3 L33.8,9.4 L33.9,9.2 Z" className={selectedCounty === "Siaya" ? "selected" : ""} onClick={() => handleCountyClick("Siaya")} />
            <path id="busia" d="M33.7,9.6 L33.8,9.7 L33.6,9.8 L33.7,9.6 Z" className={selectedCounty === "Busia" ? "selected" : ""} onClick={() => handleCountyClick("Busia")} />
          </svg>
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            Interactive map of Kenya's 47 counties
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
