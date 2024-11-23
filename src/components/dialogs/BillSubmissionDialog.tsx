import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface BillSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  billId: string;
  billTitle: string;
}

type VoteType = "yes" | "no" | "undecided";

export function BillSubmissionDialog({
  isOpen,
  onClose,
  billId,
  billTitle,
}: BillSubmissionDialogProps) {
  const [vote, setVote] = useState<VoteType | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!vote) return;

    try {
      // TODO: Implement API call to submit vote and comment
      await submitVoteAndComment({
        billId,
        vote,
        comment,
      });

      onClose();
    } catch (error) {
      console.error("Failed to submit vote:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Your View</DialogTitle>
          <DialogDescription>
            Share your opinion on {billTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Your Vote (Required)</Label>
            <RadioGroup
              value={vote || ""}
              onValueChange={(value) => setVote(value as VoteType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Support</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">Oppose</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="undecided" id="undecided" />
                <Label htmlFor="undecided">Undecided</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Additional Comments</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!vote}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// TODO: Implement this function to call your API
async function submitVoteAndComment({
  billId,
  vote,
  comment,
}: {
  billId: string;
  vote: VoteType;
  comment: string;
}) {
  // Implement API call
}
