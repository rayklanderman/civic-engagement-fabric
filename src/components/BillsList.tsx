import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { submitBillParticipation } from "@/api/bills";
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
  status: 'active' | 'pending' | 'closed';
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
      status: 'active'
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
      status: 'active'
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: bills = [], isLoading, isError } = useQuery<Bill[]>({
    queryKey: ['bills'],
    queryFn: fetchBills,
  });

  // Filter bills based on county, search term, and filter
  const filteredBills = useMemo(() => {
    if (!bills) return [];
    
    return bills.filter(bill => {
      // County filter
      if (countyName && bill.county) {
        const normalizedCountyName = countyName.toLowerCase();
        const normalizedBillCounty = bill.county.toLowerCase();
        if (!bill.isNational && normalizedBillCounty !== normalizedCountyName) {
          return false;
        }
      }

      // Search term filter
      if (searchTerm) {
        const normalizedSearch = searchTerm.toLowerCase();
        const titleMatch = bill.title?.toLowerCase().includes(normalizedSearch) || false;
        const descriptionMatch = bill.description?.toLowerCase().includes(normalizedSearch) || false;
        if (!titleMatch && !descriptionMatch) {
          return false;
        }
      }

      // Status filter
      if (filter && filter !== 'all') {
        if (bill.status !== filter) {
          return false;
        }
      }

      return true;
    });
  }, [bills, countyName, searchTerm, filter]);

  const handleParticipate = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phoneNumber', 'idNumber'] as const;
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBillParticipation({
        billId: selectedBill.id,
        ...formData,
      });
      
      toast({
        title: "Participation Submitted",
        description: "Thank you for participating in the legislative process. Your input has been recorded.",
      });
      
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error submitting participation:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your participation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error loading bills. Please try again later.</p>
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
                    Status: <span className={
                      bill.status === 'active' ? 'text-green-500' :
                      bill.status === 'pending' ? 'text-yellow-500' :
                      'text-red-500'
                    }>{bill.status}</span>
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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Feedback"}
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