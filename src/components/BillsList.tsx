import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { submitBillVote, getBills } from "@/api/bills"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormData {
  name: string
  email: string
  message: string
  vote?: string
}

interface BillsListProps {
  countyId?: string
  countyName?: string
}

export function BillsList({ countyId, countyName }: BillsListProps) {
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    vote: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message || !formData.vote) {
        toast.error('Please fill in all required fields')
        return
      }

      // Submit bill vote with comment
      await submitBillVote({
        bill_id: selectedBill.id,
        vote: formData.vote,
        comment: formData.message
      })

      toast.success('Thank you for your participation!')
      setIsDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        message: "",
        vote: ""
      })
    } catch (error) {
      console.error("Error submitting vote:", error)
      toast.error('Failed to submit vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const { data: bills = [], isLoading, isError } = useQuery({
    queryKey: ['bills', countyId],
    queryFn: async () => {
      return getBills(countyId ? 'county' : 'national', countyId)
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error loading bills. Please try again later.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        {countyName ? `Bills for ${countyName} County` : "All Current Bills"}
      </h2>
      
      {bills.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">
            {countyName 
              ? "Only national bills are available for this county at the moment."
              : "No bills found."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bills.map((bill: any) => (
            <Card key={bill.id} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{bill.title}</h3>
              <p className="text-gray-600 mb-4">{bill.description}</p>
              <Dialog open={isDialogOpen && selectedBill?.id === bill.id} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) setSelectedBill(null)
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedBill(bill)}>
                    Participate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Participate in Bill Discussion</DialogTitle>
                    <DialogDescription>
                      Share your thoughts on {bill.title}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
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
                      <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="vote">Your Vote *</Label>
                      <select
                        id="vote"
                        className="w-full p-2 border rounded-md"
                        value={formData.vote}
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, vote: e.target.value })
                        }
                      >
                        <option value="">Select your vote</option>
                        <option value="yes">Support</option>
                        <option value="no">Oppose</option>
                        <option value="undecided">Undecided</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Comments *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}