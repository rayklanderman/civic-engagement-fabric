import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

interface Bill {
  id: string;
  title: string;
  description: string;
  county: string;
  deadline: string;
}

const SAMPLE_BILLS: Bill[] = [
  {
    id: "1",
    title: "County Finance Bill 2024",
    description: "Proposed financial allocations for the fiscal year 2024/2025",
    county: "Nairobi",
    deadline: "2024-03-30",
  },
  {
    id: "2",
    title: "Healthcare Services Bill",
    description: "Regulations for private and public healthcare facilities",
    county: "Mombasa",
    deadline: "2024-04-15",
  },
  {
    id: "3",
    title: "Environmental Conservation Bill",
    description: "Regulations for environmental protection and conservation",
    county: "Kisumu",
    deadline: "2024-05-01",
  },
];

export function BillsList() {
  const [searchParams] = useSearchParams();
  const selectedCounty = searchParams.get("county");

  const filteredBills = selectedCounty
    ? SAMPLE_BILLS.filter((bill) => bill.county === selectedCounty)
    : SAMPLE_BILLS;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        {selectedCounty ? `Bills for ${selectedCounty} County` : "All Current Bills"}
      </h2>
      {filteredBills.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-500">No bills found for this county.</p>
        </Card>
      ) : (
        filteredBills.map((bill) => (
          <Card key={bill.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{bill.title}</h3>
                <p className="text-gray-600 mt-2">{bill.description}</p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span>County: {bill.county}</span>
                  <span>Deadline: {bill.deadline}</span>
                </div>
              </div>
              <Button>Participate</Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}