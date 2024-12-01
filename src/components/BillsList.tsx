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
  isNational: boolean;
  status: string;
}

interface ParticipationFormData {
  name: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  comment: string;
}

interface BillsListProps {
  countyName: string | null;
  searchTerm: string;
  filter: string;
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
      isNational: false,
      status: 'pending'
    },
    {
      id: "2",
      title: "Healthcare Services Bill",
      description: "Regulations for private and public healthcare facilities",
      county: "Mombasa",
      deadline: "2024-04-15",
      isNational: false,
      status: 'approved'
    },
    {
      id: "3",
      title: "Environmental Conservation Bill",
      description: "Regulations for environmental protection and conservation",
      county: "Kisumu",
      deadline: "2024-05-01",
      isNational: false,
      status: 'pending'
    },
    {
      id: "4",
      title: "National Public Participation Bill 2024",
      description: "Framework for public participation in governance across all counties",
      county: "National",
      deadline: "2024-06-30",
      isNational: true,
      status: 'approved'
    },
    {
      id: "5",
      title: "National Healthcare Reform Bill 2024",
      description: "Comprehensive healthcare system reforms across Kenya",
      county: "National",
      deadline: "2024-07-15",
      isNational: true,
      status: 'pending'
    }
  ];
};

export function BillsList({ countyName, searchTerm, filter }: BillsListProps) {
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

  // Filter bills based on county, search term, and filter
  const filteredBills = useMemo(() => {
    let filtered = bills;

    // Filter by county
    if (countyName) {
      filtered = bills.filter(bill => 
        bill.isNational || bill.county.toLowerCase() === countyName.toLowerCase()
      );
    }

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(bill => bill.status === filter);
    }

    return filtered;
  }, [bills, countyName, searchTerm, filter]);

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
        {countyName ? `Bills for ${countyName} County` : "All Current Bills"}
      </h2>
      {filteredBills.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">
            {countyName 
              ? "Only national bills are available for this county at the moment."
              : "No bills found."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBills.map((bill) => (
            <Card key={bill.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{bill.title}</h3>
                  <p className="text-gray-600 mb-2">{bill.description}</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {new Date(bill.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {bill.isNational ? "National Bill" : "County Bill"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {bill.status}
                  </p>
                </div>
              </div>
              <Dialog open={isDialogOpen && selectedBill?.id === bill.id} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setSelectedBill(null);
              }}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedBill(bill);
                      setIsDialogOpen(true);
                    }}
                  >
                    Participate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Your Feedback</DialogTitle>
                    <DialogDescription>
                      Provide your input on {selectedBill?.title}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        required
                        value={formData.idNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, idNumber: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Comments</Label>
                      <Textarea
                        id="comment"
                        required
                        value={formData.comment}
                        onChange={(e) =>
                          setFormData({ ...formData, comment: e.target.value })
                        }
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit Feedback
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}