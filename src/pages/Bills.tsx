import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Bill } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BillsList } from "@/components/BillsList";
import { useParams } from 'react-router-dom';
import { kenyaCountiesGeoJSON } from '@/lib/counties';

export function Bills() {
  const { countyId } = useParams<{ countyId?: string }>();
  
  // Decode and format county name for display
  const countyName = countyId 
    ? decodeURIComponent(countyId).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : null;

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
    return matchesSearch && bill.status === filter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#BB0000] mb-4 md:mb-0">
            {countyName ? `Bills for ${countyName} County` : 'National Bills'}
          </h1>
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
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
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
          <BillsList 
            bills={filteredBills} 
            countyName={countyName} 
            searchTerm={searchTerm}
            filter={filter}
          />
        )}
      </main>
    </div>
  );
}