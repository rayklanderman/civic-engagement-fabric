import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Bill } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Statistics() {
  // Fetch bills data
  const { data: bills, isLoading } = useQuery<Bill[]>({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  // Calculate statistics
  const stats = {
    total: bills?.length || 0,
    national: bills?.filter(b => b.type === "national").length || 0,
    county: bills?.filter(b => b.type === "county").length || 0,
    status: {
      draft: bills?.filter(b => b.status === "draft").length || 0,
      inProgress: bills?.filter(b => b.status === "in_progress").length || 0,
      passed: bills?.filter(b => b.status === "passed").length || 0,
      rejected: bills?.filter(b => b.status === "rejected").length || 0,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#BB0000]">Legislative Statistics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Bills</CardTitle>
            <CardDescription>All legislative bills</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>National Bills</CardTitle>
            <CardDescription>Parliament legislation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.national}</p>
            <Progress 
              value={(stats.national / stats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>County Bills</CardTitle>
            <CardDescription>County assemblies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.county}</p>
            <Progress 
              value={(stats.county / stats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Passed bills</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {((stats.status.passed / stats.total) * 100).toFixed(1)}%
            </p>
            <Progress 
              value={(stats.status.passed / stats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bill Status Breakdown</CardTitle>
          <CardDescription>Current status of all bills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Draft</span>
                <span>{((stats.status.draft / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(stats.status.draft / stats.total) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>In Progress</span>
                <span>{((stats.status.inProgress / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(stats.status.inProgress / stats.total) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Passed</span>
                <span>{((stats.status.passed / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(stats.status.passed / stats.total) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Rejected</span>
                <span>{((stats.status.rejected / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(stats.status.rejected / stats.total) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Bill introduction and passage rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Coming Soon: Interactive charts showing monthly trends
          </div>
        </CardContent>
      </Card>
    </div>
  );
}