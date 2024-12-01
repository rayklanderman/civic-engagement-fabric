import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CountySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const counties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  // Add more counties
];

export function CountySelectionDialog({ isOpen, onClose }: CountySelectionDialogProps) {
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedCounty) {
      navigate(`/bills?county=${selectedCounty.toLowerCase()}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="county-selection-description"
      >
        <DialogHeader>
          <DialogTitle>Select County</DialogTitle>
          <DialogDescription id="county-selection-description">
            Choose a county to view its public participation opportunities
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger>
              <SelectValue placeholder="Select a county" />
            </SelectTrigger>
            <SelectContent>
              {counties.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedCounty}
          >
            View County Bills
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
