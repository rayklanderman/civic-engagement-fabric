import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Bill {
  id: string;
  title: string;
  description: string;
  county: string;
  deadline: string;
  isNational?: boolean;
}

interface ParticipationFormData {
  name: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  comment: string;
}

interface BillsListProps {
  countyId?: string | null;
}

// Simulated API call - In a real app, this would fetch from your backend
const fetchBills = async (): Promise<Bill[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
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
    {
      id: "4",
      title: "National Public Participation Bill 2024",
      description: "Framework for public participation in governance across all counties",
      county: "National",
      deadline: "2024-06-30",
      isNational: true,
    }
  ];
};

export function BillsList({ countyId }: BillsListProps) {
  const { toast } = useToast();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState<ParticipationFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    comment: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: fetchBills,
  });

  // Filter bills based on county
  const filteredBills = useMemo(() => {
    if (!countyId) {
      return bills; // Show all bills on the main bills page
    }

    const countyBills = bills.filter(bill => 
      bill.county === countyId || bill.isNational
    );

    // If there are county-specific bills, show them along with national bills
    // If no county-specific bills exist, show only national bills
    const hasCountySpecificBills = countyBills.some(bill => !bill.isNational && bill.county === countyId);
    
    return hasCountySpecificBills 
      ? countyBills 
      : bills.filter(bill => bill.isNational);
  }, [bills, countyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submission data:", { billId: selectedBill?.id, ...formData });
    toast({
      title: "Feedback Submitted",
      description: "Thank you for participating in the bill review process.",
    });
    setIsDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      idNumber: "",
      comment: "",
    });
  };

  const handleParticipateClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">Loading bills...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        {countyId ? `Bills for ${countyId} County` : "All Current Bills"}
      </h2>
      {filteredBills.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-500">No bills found for this county.</p>
        </Card>
      ) : (
        filteredBills.map((bill: Bill) => (
          <Card key={bill.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{bill.title}</h3>
                  {bill.isNational && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      National Bill
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{bill.description}</p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span>County: {bill.county}</span>
                  <span>Deadline: {bill.deadline}</span>
                </div>
              </div>
              <Dialog open={isDialogOpen && selectedBill?.id === bill.id} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setSelectedBill(null);
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleParticipateClick(bill)}>Participate</Button>
                </DialogTrigger>
                <DialogContent 
                  className="sm:max-w-[500px]"
                  aria-describedby="bill-participation-description"
                >
                  <DialogHeader>
                    <DialogTitle>Participate in Bill Review</DialogTitle>
                    <DialogDescription id="bill-participation-description">
                      Share your feedback on this bill
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        required
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        placeholder="Enter your ID number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Comments *</Label>
                      <Textarea
                        id="comment"
                        required
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Share your thoughts on this bill"
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Feedback</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}