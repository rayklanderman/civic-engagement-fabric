import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Bill } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { BillsList } from "@/components/BillsList";

export function Bills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch bills from Supabase
  const { data: bills, isLoading } = useQuery<Bill[]>({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Filter and search bills
  const filteredBills = bills?.filter((bill) => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && bill.type === filter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#BB0000] mb-4 md:mb-0">Legislative Bills</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <Input
              type="search"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select
              value={filter}
              onValueChange={setFilter}
              className="w-40"
            >
              <option value="all">All Bills</option>
              <option value="national">National</option>
              <option value="county">County</option>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filteredBills?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bills found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBills?.map((bill) => (
              <div
                key={bill.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#006600] mb-2">
                      {bill.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{bill.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bill.type === "national"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {bill.type === "national" ? "National" : "County"}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {bill.status}
                  </div>
                  <div>
                    <span className="font-medium">Introduced:</span>{" "}
                    {new Date(bill.created_at).toLocaleDateString()}
                  </div>
                  {bill.type === "county" && (
                    <div>
                      <span className="font-medium">County:</span>{" "}
                      {bill.county}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline">
                    View Details
                  </Button>
                  <Button>
                    Track Bill
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}