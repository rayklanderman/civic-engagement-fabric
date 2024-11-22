import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

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
            viewBox="0 0 500 700"
            className="w-full h-full"
          >
            <style>
              {`
                path {
                  fill: #f3f4f6;
                  stroke: #4b5563;
                  stroke-width: 0.5;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                path:hover {
                  fill: #047857;
                  stroke: #065f46;
                  transform: translateY(-2px);
                }
                path.selected {
                  fill: #059669;
                  stroke: #047857;
                }
                text {
                  font-size: 8px;
                  fill: #1f2937;
                  pointer-events: none;
                  font-weight: 500;
                }
              `}
            </style>

            {/* Nairobi */}
            <path
              id="nairobi"
              d="M270 380 L285 380 C288 380 290 382 290 385 L290 395 C290 398 288 400 285 400 L270 400 C267 400 265 398 265 395 L265 385 C265 382 267 380 270 380 Z"
              className={selectedCounty === "Nairobi" ? "selected" : ""}
              onClick={() => handleCountyClick("Nairobi")}
            >
              <title>Nairobi County</title>
            </path>

            {/* Mombasa */}
            <path
              id="mombasa"
              d="M380 520 Q385 515 390 520 T400 520 L405 525 Q410 530 405 535 T395 540 L390 535 Q385 530 380 535 T370 530 L375 525 Q380 520 380 520"
              className={selectedCounty === "Mombasa" ? "selected" : ""}
              onClick={() => handleCountyClick("Mombasa")}
            >
              <title>Mombasa County</title>
            </path>

            {/* Kiambu */}
            <path
              id="kiambu"
              d="M260 360 C270 350 280 350 290 360 C300 370 300 380 290 390 C280 400 270 400 260 390 C250 380 250 370 260 360"
              className={selectedCounty === "Kiambu" ? "selected" : ""}
              onClick={() => handleCountyClick("Kiambu")}
            >
              <title>Kiambu County</title>
            </path>

            {/* Kisumu */}
            <path
              id="kisumu"
              d="M150 300 L170 290 L190 300 L180 320 L160 320 Z"
              className={selectedCounty === "Kisumu" ? "selected" : ""}
              onClick={() => handleCountyClick("Kisumu")}
            >
              <title>Kisumu County</title>
            </path>

            {/* Nakuru */}
            <path
              id="nakuru"
              d="M220 280 L240 270 L260 280 L270 300 L250 320 L230 310 L220 290 Z"
              className={selectedCounty === "Nakuru" ? "selected" : ""}
              onClick={() => handleCountyClick("Nakuru")}
            >
              <title>Nakuru County</title>
            </path>

            {/* Machakos */}
            <path
              id="machakos"
              d="M300 390 L320 385 L335 395 L330 415 L310 420 L295 410 Z"
              className={selectedCounty === "Machakos" ? "selected" : ""}
              onClick={() => handleCountyClick("Machakos")}
            >
              <title>Machakos County</title>
            </path>

            {/* Kajiado */}
            <path
              id="kajiado"
              d="M250 420 Q270 410 290 420 T310 440 L300 460 Q280 470 260 460 T250 420"
              className={selectedCounty === "Kajiado" ? "selected" : ""}
              onClick={() => handleCountyClick("Kajiado")}
            >
              <title>Kajiado County</title>
            </path>

            {/* Uasin Gishu */}
            <path
              id="uasin_gishu"
              d="M180 240 L200 230 L220 240 L210 260 L190 270 Z"
              className={selectedCounty === "Uasin Gishu" ? "selected" : ""}
              onClick={() => handleCountyClick("Uasin Gishu")}
            >
              <title>Uasin Gishu County</title>
            </path>

            {/* Meru */}
            <path
              id="meru"
              d="M320 320 Q340 310 360 320 T380 340 L370 360 Q350 370 330 360 T320 320"
              className={selectedCounty === "Meru" ? "selected" : ""}
              onClick={() => handleCountyClick("Meru")}
            >
              <title>Meru County</title>
            </path>

            {/* Kilifi */}
            <path
              id="kilifi"
              d="M360 480 C370 470 385 470 395 480 C405 490 405 505 395 515 C385 525 370 525 360 515 C350 505 350 490 360 480"
              className={selectedCounty === "Kilifi" ? "selected" : ""}
              onClick={() => handleCountyClick("Kilifi")}
            >
              <title>Kilifi County</title>
            </path>

            {/* Add text labels for better visibility */}
            <text x="272" y="390" textAnchor="middle">Nairobi</text>
            <text x="385" y="530" textAnchor="middle">Mombasa</text>
            <text x="270" y="370" textAnchor="middle">Kiambu</text>
            <text x="165" y="310" textAnchor="middle">Kisumu</text>
            <text x="245" y="295" textAnchor="middle">Nakuru</text>
            <text x="315" y="405" textAnchor="middle">Machakos</text>
            <text x="275" y="440" textAnchor="middle">Kajiado</text>
            <text x="200" y="250" textAnchor="middle">Uasin Gishu</text>
            <text x="345" y="340" textAnchor="middle">Meru</text>
            <text x="375" y="495" textAnchor="middle">Kilifi</text>
          </svg>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">County List</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {COUNTIES.map((county) => (
            <button
              key={county}
              onClick={() => handleCountyClick(county)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCounty === county
                  ? "bg-purple-100 text-purple-900"
                  : "hover:bg-gray-100"
              }`}
            >
              {county}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}