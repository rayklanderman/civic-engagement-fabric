import { CountyMap } from "@/components/CountyMap";
import { CountyList } from "@/components/CountyList";
import { useState } from "react";
import { County } from "@/types";

export function Counties() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#BB0000]">Counties of Kenya</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar with county list */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
          <CountyList 
            selectedCounty={selectedCounty} 
            onSelectCounty={setSelectedCounty} 
          />
        </div>

        {/* Main content area with map */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="h-[600px]">
            <CountyMap 
              selectedCounty={selectedCounty} 
              onSelectCounty={setSelectedCounty} 
            />
          </div>
        </div>
      </div>

      {/* County Details Section */}
      {selectedCounty && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#006600]">{selectedCounty.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Population</h3>
              <p>{selectedCounty.population.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Capital</h3>
              <p>{selectedCounty.capital}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Area</h3>
              <p>{selectedCounty.area.toLocaleString()} km²</p>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="font-semibold mb-2">Recent Bills</h3>
              {selectedCounty.bills?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedCounty.bills.map((bill, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-medium">{bill.title}</span>
                      <p className="text-sm text-gray-600">{bill.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent bills found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}