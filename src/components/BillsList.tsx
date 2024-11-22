import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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

interface ParticipationFormData {
  name: string;
  email: string;
  phoneNumber: string;
  comment: string;
}

export function BillsList() {
  const [searchParams] = useSearchParams();
  const selectedCounty = searchParams.get("county");
  const { toast } = useToast();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState<ParticipationFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    comment: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBills = selectedCounty
    ? SAMPLE_BILLS.filter((bill) => bill.county === selectedCounty)
    : SAMPLE_BILLS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
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
      comment: "",
    });
  };

  const handleParticipateClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

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
              <Dialog open={isDialogOpen && selectedBill?.id === bill.id} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setSelectedBill(null);
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleParticipateClick(bill)}>Participate</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Participate in Bill Review</DialogTitle>
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