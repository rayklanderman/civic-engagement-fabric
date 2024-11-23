import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface BillsSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BillsSelectionDialog({ isOpen, onClose }: BillsSelectionDialogProps) {
  const navigate = useNavigate();

  const handleNationalBills = () => {
    navigate('/bills/national');
    onClose();
  };

  const handleCountyBills = () => {
    navigate('/bills');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Bill Type</DialogTitle>
          <DialogDescription>
            Choose to view National Bills or County-specific Bills
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleNationalBills}
            className="w-full"
            variant="default"
          >
            National Bills
          </Button>
          <Button
            onClick={handleCountyBills}
            className="w-full"
            variant="outline"
          >
            County Bills
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
