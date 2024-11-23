import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BillAnalyticsProps {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  undecidedVotes: number;
  status: 'draft' | 'review' | 'passed' | 'rejected';
}

export function BillAnalytics({
  totalVotes,
  yesVotes,
  noVotes,
  undecidedVotes,
  status,
}: BillAnalyticsProps) {
  const yesPercentage = (yesVotes / totalVotes) * 100;
  const noPercentage = (noVotes / totalVotes) * 100;
  const undecidedPercentage = (undecidedVotes / totalVotes) * 100;

  const statusColors = {
    draft: "bg-gray-500",
    review: "bg-yellow-500",
    passed: "bg-green-500",
    rejected: "bg-red-500",
  };

  const statusLabels = {
    draft: "Draft",
    review: "Under Review",
    passed: "Passed",
    rejected: "Rejected",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Public Opinion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Support ({yesVotes})</span>
                <span>{yesPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={yesPercentage} className="bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Oppose ({noVotes})</span>
                <span>{noPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={noPercentage} className="bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Undecided ({undecidedVotes})</span>
                <span>{undecidedPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={undecidedPercentage} className="bg-gray-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bill Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`h-3 w-3 rounded-full ${statusColors[status]}`} />
            <span className="text-sm font-medium">{statusLabels[status]}</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">{totalVotes}</div>
            <div className="text-sm text-gray-500">Total Submissions</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
