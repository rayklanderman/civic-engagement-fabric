import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BillAnalytics } from "@/components/BillAnalytics";
import { BillSubmissionDialog } from "@/components/dialogs/BillSubmissionDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Bill {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'review' | 'passed' | 'rejected';
  analytics: {
    totalVotes: number;
    yesVotes: number;
    noVotes: number;
    undecidedVotes: number;
  };
}

// Mock data - replace with API call
const mockBills: Record<string, Bill[]> = {
  national: [
    {
      id: "n1",
      title: "National Healthcare Reform Bill",
      description: "A comprehensive reform of the national healthcare system",
      status: "review",
      analytics: {
        totalVotes: 1500,
        yesVotes: 800,
        noVotes: 500,
        undecidedVotes: 200,
      },
    },
    // Add more national bills
  ],
  county: {
    nairobi: [
      {
        id: "c1",
        title: "Nairobi Public Transport Bill",
        description: "Restructuring public transport in Nairobi County",
        status: "draft",
        analytics: {
          totalVotes: 800,
          yesVotes: 400,
          noVotes: 300,
          undecidedVotes: 100,
        },
      },
      // Add more county bills
    ],
    // Add more counties
  },
};

interface BillsPageProps {
  type: "national" | "county";
}

export function BillsPage({ type }: BillsPageProps) {
  const [searchParams] = useSearchParams();
  const county = searchParams.get("county");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);

  const bills = type === "national" 
    ? mockBills.national 
    : county 
      ? mockBills.county[county.toLowerCase()] || []
      : [];

  const title = type === "national" 
    ? "National Bills" 
    : county 
      ? `${county} County Bills`
      : "County Bills";

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      
      <div className="grid gap-6">
        {bills.map((bill) => (
          <Card key={bill.id}>
            <CardHeader>
              <CardTitle>{bill.title}</CardTitle>
              <CardDescription>{bill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <BillAnalytics
                totalVotes={bill.analytics.totalVotes}
                yesVotes={bill.analytics.yesVotes}
                noVotes={bill.analytics.noVotes}
                undecidedVotes={bill.analytics.undecidedVotes}
                status={bill.status}
              />
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSelectedBill(bill);
                    setSubmissionDialogOpen(true);
                  }}
                >
                  Submit Your View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {bills.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No bills found{county ? ` for ${county} County` : ""}.
          </div>
        )}
      </div>

      {selectedBill && (
        <BillSubmissionDialog
          isOpen={submissionDialogOpen}
          onClose={() => {
            setSubmissionDialogOpen(false);
            setSelectedBill(null);
          }}
          billId={selectedBill.id}
          billTitle={selectedBill.title}
        />
      )}
    </div>
  );
}
